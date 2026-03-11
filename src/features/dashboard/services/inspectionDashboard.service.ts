/* eslint-disable @typescript-eslint/no-explicit-any */
export type Summary = {
  inspection: { total: number };
  inspectionToday: { total: number };
  inspectionThisWeek: { total: number };
  inspectionThisMonth: { total: number };
  inspectionThisYear: { total: number };
};

export type WeekChartRow = { day: string; "Inspections: ": number };
export type MonthChartRow = { day: string; "Inspections: ": number };
export type WorkCodeRow = { workCode: string; "Inspections: ": number };

export type RecentRow = {
  id: string;
  inspector: string;
  time: string;
  workID: string;
  date: string;
  type: string;
};

export async function fetchInspectionSummary(
  self: boolean = false
): Promise<Summary> {
  const params = new URLSearchParams();
  if (self) params.append("self", "true");
  const res = await fetch(`/api/v2/inspections/summary?${params.toString()}`);
  const data = await res.json();
  if (!res.ok)
    throw new Error(data?.error || "Failed to fetch inspection summary");
  return data as Summary;
}

export async function fetchWeekChart(
  self: boolean = false
): Promise<WeekChartRow[]> {
  const params = new URLSearchParams();
  if (self) params.append("self", "true");
  const res = await fetch(`/api/v2/inspections/week?${params.toString()}`);
  const data = await res.json();
  if (!res.ok)
    throw new Error(data?.error || "Failed to fetch week chart data");
  return (data.data ?? []) as WeekChartRow[];
}

export async function fetchMonthChart(
  self: boolean = false
): Promise<WeekChartRow[]> {
  const params = new URLSearchParams();
  if (self) params.append("self", "true");
  const res = await fetch(`/api/v2/inspections/month?${params.toString()}`);
  const data = await res.json();
  if (!res.ok)
    throw new Error(data?.error || "Failed to fetch week chart data");
  return (data.data ?? []) as WeekChartRow[];
}

export async function fetchWorkCodeChart(
  range: "week" | "month" | "year" = "year",
  self: boolean = false
): Promise<WorkCodeRow[]> {
  const params = new URLSearchParams();
  params.append("range", range);
  if (self) params.append("self", "true");
  const res = await fetch(`/api/v2/inspections/workCode?${params.toString()}`);
  const data = await res.json();
  if (!res.ok)
    throw new Error(data?.error || "Failed to fetch work code chart data");
  return (data.data ?? []) as WorkCodeRow[];
}

export async function fetchRecentInspections(
  self: boolean = false,
  limit: number = 15
): Promise<RecentRow[]> {
  const params = new URLSearchParams();
  params.append("limit", limit.toString());
  if (self) params.append("self", "true");
  const res = await fetch(`/api/v2/inspections/recent?${params.toString()}`);
  const data = await res.json();
  if (!res.ok)
    throw new Error(data?.error || "Failed to fetch recent inspections");
  return (data.data ?? []) as RecentRow[];
}
