"use client";
import { useEffect, useMemo, useState } from "react";
import {
  fetchInspectionSummary,
  fetchMonthChart,
  fetchRecentInspections,
  fetchWeekChart,
  fetchWorkCodeChart,
  MonthChartRow,
  type RecentRow,
  type WeekChartRow,
  type WorkCodeRow,
} from "../services/inspectionDashboard.service";

export function useDesktopDashboardHooks() {
  const [inspection, setInspection] = useState({ total: 0 });
  const [inspectionToday, setInspectionToday] = useState({ total: 0 });
  const [inspectionThisWeek, setInspectionThisWeek] = useState({ total: 0 });
  const [inspectionThisMonth, setInspectionThisMonth] = useState({ total: 0 });
  const [inspectionThisYear, setInspectionThisYear] = useState({ total: 0 });
  const [monthChart, setMonthChart] = useState<MonthChartRow[]>([]);
  const [weekChart, setWeekChart] = useState<WeekChartRow[]>([]);
  const [workCodeChart, setWorkCodeChart] = useState<WorkCodeRow[]>([]);
  const [recentInspections, setRecentInspections] = useState<RecentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [summary, week, month, workcode, recent] = await Promise.all([
          fetchInspectionSummary(false),
          fetchWeekChart(false),
          fetchMonthChart(false),
          fetchWorkCodeChart("year", false),
          fetchRecentInspections(false),
        ]);
        if (cancelled) return;
        setInspection(summary.inspection);
        setInspectionToday(summary.inspectionToday);
        setInspectionThisWeek(summary.inspectionThisWeek);
        setInspectionThisMonth(summary.inspectionThisMonth);
        setInspectionThisYear(summary.inspectionThisYear);
        setMonthChart(month);
        setWeekChart(week);
        setWorkCodeChart(workcode);
        setRecentInspections(recent);
      } catch (error: any) {
        if (!cancelled)
          setError(error?.message || "Failed to load inspections");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(
    () => ({
      inspection,
      inspectionToday,
      inspectionThisWeek,
      inspectionThisMonth,
      inspectionThisYear,
      monthChart,
      weekChart,
      workCodeChart,
      recentInspections,
      loading,
      error,
    }),
    [
      inspection,
      inspectionToday,
      inspectionThisWeek,
      inspectionThisMonth,
      inspectionThisYear,
      monthChart,
      weekChart,
      workCodeChart,
      recentInspections,
      loading,
      error,
    ]
  );
}
