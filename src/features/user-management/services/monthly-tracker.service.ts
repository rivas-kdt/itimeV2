export async function getMonthlyInspectionData(
  userId: string,
  month?: number,
  year?: number
) {
  const params = new URLSearchParams();
  params.append("format", "monthly");
  if (month !== undefined) params.append("month", (month + 1).toString());
  if (year !== undefined) params.append("year", year.toString());

  const res = await fetch(
    `/api/v2/users/${userId}/inspections?${params.toString()}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("[getMonthlyInspectionData] Error:", data);
    throw new Error(data?.error || "Failed to fetch inspection data");
  }
  return data.rows || [];
}
