import { useState, useCallback } from "react";

export interface TimeValue {
  hour: number;
  minute: number;
}

export interface RecordedTime {
  hours: number;
  minutes: number;
}

export interface DurationResult {
  hours: string;
  minutes: string;
  seconds: string;
}

export function useTimeEditor() {
  const [startTime, setStartTime] = useState<TimeValue>({
    hour: 8,
    minute: 30,
  });

  const [endTime, setEndTime] = useState<TimeValue>({
    hour: 10,
    minute: 0,
  });

  const [openStartTime, setOpenStartTime] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);

  // Parse ISO string to TimeValue
  const parseTimeFromISO = useCallback((isoString: string): TimeValue => {
    const date = new Date(isoString);
    return {
      hour: date.getHours(),
      minute: date.getMinutes(),
    };
  }, []);

  // Calculate recorded time between start and end
  const calculateRecordedTime = useCallback(
    (start: TimeValue, end: TimeValue): RecordedTime => {
      const startMinutes = start.hour * 60 + start.minute;
      const endMinutes = end.hour * 60 + end.minute;

      let diff = endMinutes - startMinutes;
      if (diff < 0) diff += 24 * 60;

      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;

      return { hours, minutes };
    },
    []
  );

  // Calculate duration from ISO timestamps
  const getDuration = useCallback(
    (start?: string, end?: string): DurationResult => {
      if (!start || !end) {
        return { hours: "00", minutes: "00", seconds: "00" };
      }

      const startDate = new Date(start).getTime();
      const endDate = new Date(end).getTime();
      const diff = endDate - startDate;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return {
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      };
    },
    []
  );

  // Load times from inspection data
  const loadTimesFromInspection = useCallback(
    (startTimeStr?: string, endTimeStr?: string) => {
      if (startTimeStr && endTimeStr) {
        setStartTime(parseTimeFromISO(startTimeStr));
        setEndTime(parseTimeFromISO(endTimeStr));
      }
    },
    [parseTimeFromISO]
  );

  // Reset times to defaults
  const resetTimes = useCallback(() => {
    setStartTime({ hour: 8, minute: 30 });
    setEndTime({ hour: 10, minute: 0 });
    setOpenStartTime(false);
    setOpenEndTime(false);
  }, []);

  // Close time dialogs
  const closeTimeDialogs = useCallback(() => {
    setOpenStartTime(false);
    setOpenEndTime(false);
  }, []);

  return {
    // Time values
    startTime,
    setStartTime,
    endTime,
    setEndTime,

    // Dialog states
    openStartTime,
    setOpenStartTime,
    openEndTime,
    setOpenEndTime,

    // Utility functions
    parseTimeFromISO,
    calculateRecordedTime,
    getDuration,
    loadTimesFromInspection,
    resetTimes,
    closeTimeDialogs,
  };
}
