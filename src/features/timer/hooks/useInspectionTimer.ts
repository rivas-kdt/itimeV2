"use client";

import { useCallback, useEffect, useState } from "react";

export type InspectionTimer = {
  workOrderId: string | null;
  startedAt: number | null;
  pausedAt: number | null;
  totalPausedMs: number;
  isRunning: boolean;
};

const STORAGE_KEY = "inspection_timer";

const emptyTimer: InspectionTimer = {
  workOrderId: null,
  startedAt: null,
  pausedAt: null,
  totalPausedMs: 0,
  isRunning: false,
};

export function useInspectionTimer(workOrderId: string) {
  const [timer, setTimer] = useState<InspectionTimer>(() => {
    if (typeof window === "undefined") return emptyTimer;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : emptyTimer;
  });

  /* persist */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timer));
  }, [timer]);

  /* actions */
  const start = useCallback(() => {
    setTimer({
      workOrderId,
      startedAt: Date.now(),
      pausedAt: null,
      totalPausedMs: 0,
      isRunning: true,
    });
  }, [workOrderId]);

  const pause = useCallback(() => {
    setTimer((t) =>
      t.isRunning && !t.pausedAt ? { ...t, pausedAt: Date.now() } : t
    );
  }, []);

  const resume = useCallback(() => {
    setTimer((t) =>
      t.pausedAt
        ? {
            ...t,
            totalPausedMs: t.totalPausedMs + (Date.now() - t.pausedAt),
            pausedAt: null,
          }
        : t
    );
  }, []);

  const stop = useCallback(() => {
    setTimer(emptyTimer);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  /* derived */
  const getElapsedMs = useCallback(() => {
    if (!timer.startedAt) return 0;
    const now = Date.now();
    const pausedMs = timer.pausedAt ? now - timer.pausedAt : 0;
    return now - timer.startedAt - timer.totalPausedMs - pausedMs;
  }, [timer]);

  return { timer, start, pause, resume, stop, getElapsedMs };
}
