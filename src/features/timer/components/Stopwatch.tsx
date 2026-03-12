// components/Stopwatch.js
"use client";

import { useState, useEffect, useRef } from "react";

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0); // elapsed time in ms
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedStartTime = localStorage.getItem("stopwatch_startTime");
    const savedElapsed = localStorage.getItem("stopwatch_elapsed");
    const savedRunning = localStorage.getItem("stopwatch_isRunning");

    if (savedElapsed) setElapsed(Number(savedElapsed));
    if (savedRunning === "true" && savedStartTime) {
      startTimeRef.current = Number(savedStartTime);
      setIsRunning(true);
      rafRef.current = requestAnimationFrame(updateTime);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("stopwatch_elapsed", elapsed.toString());
    localStorage.setItem("stopwatch_isRunning", isRunning.toString());
    if (startTimeRef.current) {
      localStorage.setItem(
        "stopwatch_startTime",
        startTimeRef.current.toString()
      );
    }
  }, [elapsed, isRunning]);

  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
      startTimeRef.current = Date.now() - elapsed;
      localStorage.setItem(
        "stopwatch_startTime",
        startTimeRef.current.toString()
      );
      rafRef.current = requestAnimationFrame(updateTime);
    }
  };

  const pause = () => {
    setIsRunning(false);
    cancelAnimationFrame(rafRef.current);
  };

  const reset = () => {
    setIsRunning(false);
    cancelAnimationFrame(rafRef.current);
    setElapsed(0);
    startTimeRef.current = null;
    localStorage.removeItem("stopwatch_startTime");
    localStorage.removeItem("stopwatch_elapsed");
    localStorage.removeItem("stopwatch_isRunning");
  };

  const updateTime = () => {
    setElapsed(Date.now() - startTimeRef.current);
    rafRef.current = requestAnimationFrame(updateTime);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const formatTime = (ms) => {
    const minutes = String(Math.floor(ms / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    const milliseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
    return `${minutes}:${seconds}:${milliseconds}`;
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>⏱ Persistent Stopwatch</h1>
      <h2>{formatTime(elapsed)}</h2>
      <div style={{ marginTop: "10px" }}>
        {!isRunning && elapsed === 0 && <button onClick={start}>Start</button>}
        {isRunning && <button onClick={pause}>Pause</button>}
        {!isRunning && elapsed > 0 && <button onClick={start}>Resume</button>}
        <button onClick={reset} style={{ marginLeft: "5px" }}>
          Reset
        </button>
      </div>
    </div>
  );
}
