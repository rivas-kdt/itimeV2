"use client";
import { useEffect, useMemo, useState } from "react";
import {
    fetchInspectionSummary,
    fetchRecentInspections,
    type RecentRow,
} from "../services/inspectionDashboard.service";

export function useMobileDashboardHooks() {
    const [inspection, setInspection] = useState({ total: 0 });
    const [inspectionToday, setInspectionToday] = useState({ total: 0 });
    const [inspectionThisWeek, setInspectionThisWeek] = useState({ total: 0 });
    const [inspectionThisMonth, setInspectionThisMonth] = useState({ total: 0 });
    const [inspectionThisYear, setInspectionThisYear] = useState({ total: 0 });
    const [recentInspections, setRecentInspections] = useState<RecentRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const [summary, recent] = await Promise.all([
                    fetchInspectionSummary(true),
                    fetchRecentInspections(true),
                ]);
                if (cancelled) return;
                setInspection(summary.inspection);
                setInspectionToday(summary.inspectionToday);
                setInspectionThisWeek(summary.inspectionThisWeek);
                setInspectionThisMonth(summary.inspectionThisMonth);
                setInspectionThisYear(summary.inspectionThisYear);
                setRecentInspections(recent);
            } catch (error: any) {
                if (!cancelled) setError(error?.message || "Failed to load inspections");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    // return {
    //     inspection,
    //     inspectionToday,
    //     inspectionThisWeek,
    //     inspectionThisMonth,
    //     inspectionThisYear,
    //     recentInspections,
    //     loading,
    //     error
    // };

    return useMemo(
        () => ({
            inspection,
            inspectionToday,
            inspectionThisWeek,
            inspectionThisMonth,
            inspectionThisYear,
            recentInspections,
            loading,
            error
        }), [inspection,
        inspectionToday,
        inspectionThisWeek,
        inspectionThisMonth,
        inspectionThisYear,
        recentInspections,
        loading,
        error]
    )
}
