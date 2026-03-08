import { useState, useCallback, useEffect } from "react";

type Timer = {
  workOrderId: string | null;
  startTime: number | null;
  isRunning: boolean;
};

const STORAGE_KEY = "activeTimer";

export const useTimer = () => {
  const [timer, setTimer] = useState<Timer>({
    workOrderId: null,
    startTime: null,
    isRunning: false,
  });

  //get from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: Timer = JSON.parse(stored);
        setTimer(parsed);
      } catch (e) {
        console.error("Failed to parse timer from storage", e);
      }
    }
  }, []);

  //put to localStorage whenever timer changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timer));
  }, [timer]);

  const start = useCallback((workOrderId: string) => {
    setTimer({
      workOrderId,
      startTime: Date.now(),
      isRunning: true,
    });
  }, []);

  const stop = useCallback(() => {
    setTimer((prev) => ({
      ...prev,
      isRunning: false,
    }));
  }, []);

  const getElapsedMs = useCallback(() => {
    if (!timer.startTime) return 0;
    if (timer.isRunning) {
      return Date.now() - timer.startTime;
    } else {
      return 0;
    }
  }, [timer]);

  return { timer, start, stop, getElapsedMs };
};
