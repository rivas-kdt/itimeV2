import { recordsService } from "@/features/timer/tracker.service";
import { useCallback, useEffect, useState, startTransition } from "react";

type ActiveSession = {
  inspection_id: number;
  workOrder: string;
  workCode: number;
  construction: string;
  others: string;
  date: Date;
  start_time: string;
  end_time: string;
  type: string;
  status: string;
};

export function useTimerHooks() {
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAndRedirectActiveInspection = useCallback(async () => {
    try {
      setError(null);
      const data = await recordsService.getActiveInspection();

      startTransition(() => {
        setActiveSession(data?.data ?? null);
      });
    } catch (err) {
      console.error("Failed to check for active inspection:", err);
      setError("Failed to check active inspection");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setError(null);
        const data = await recordsService.getActiveInspection();

        if (!mounted) return;

        startTransition(() => {
          setActiveSession(data?.data ?? null);
        });
      } catch (err) {
        if (!mounted) return;
        console.error("Failed to check for active inspection:", err);
        setError("Failed to check active inspection");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    activeSession,
    loading,
    error,
    refetch: checkAndRedirectActiveInspection,
  };
}
