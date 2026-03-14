import { useEffect, useState } from "react";

export function useElapsedTimer(startTime?: string | null, active?: boolean) {
  // eslint-disable-next-line react-hooks/purity
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!startTime || !active) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, active]);

  if (!startTime) {
    return { hours: "00", minutes: "00", seconds: "00", elapsedMs: 0 };
  }

  const start = new Date(startTime).getTime();
  const elapsedMs = Math.max(now - start, 0);

  const totalSeconds = Math.floor(elapsedMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
    elapsedMs,
  };
}
