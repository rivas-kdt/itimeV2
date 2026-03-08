import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { useBreakpoint } from "@/hooks/screenBreakpoints";

export type MonthKey = `${number}-${string}`;

export type RowData = {
  id?: string;
  workOrder: string;
  construction: string;
  workCode: string; // e.g. "6"
  others: string; // e.g. "4"
  monthlyData: Record<string, Record<string, string | number>>; // day => "09.00" | 9 | etc.
};

export function toNumberHours(val: string | number | undefined | null): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return Number.isFinite(val) ? val : 0;

  const s = String(val).trim();
  if (!s) return 0;

  // Accept "09.00" style
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

const SheetDaysLayout = ({
  initialRows = [],
  month,
  year,
  setMonth,
  setYear,
  onSheetChange,
  isLoading,
}: {
  initialRows?: RowData[];
  month: number;
  year: number;
  setMonth: (m: number) => void;
  setYear: (y: number) => void;
  onSheetChange?: (data: {
    visibleRows: RowData[];
    month: number;
    year: number;
    monthKey: string;
  }) => void;
  isLoading?: boolean;
}) => {
  // const [rows, setRows] = useState<RowData[]>(initialRows);
  const rows = initialRows;
  // const [dataLoaded, setDataLoaded] = useState(false);
  // const dataLoaded = initialRows.length > 0;
  const dataLoaded = rows;
  console.log("rows: ", rows);

  // useEffect(() => {
  //   if (initialRows && initialRows.length > 0) {
  //     const id = setTimeout(() => setDataLoaded(true), 0);
  //     return () => clearTimeout(id);
  //   }
  // }, [initialRows]);
  /* ---------- Helpers ---------- */

  const getDaysInMonth = (m: number, y: number): Date[] => {
    const d = new Date(y, m, 1);
    const days: Date[] = [];
    while (d.getMonth() === m) {
      days.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return days;
  };

  function sumHours(values: Array<string | number | undefined>): number {
    return values.reduce<number>((acc, v) => acc + toNumberHours(v), 0);
  }

  /* ---------- Month logic ---------- */

  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}` as MonthKey;

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return;
    const [y, m] = value.split("-").map(Number);
    setYear(y);
    setMonth(m - 1);
  };

  const daysInMonth = useMemo(() => getDaysInMonth(month, year), [month, year]);

  /* ---------- Sync rows ---------- */

  // useEffect(() => {
  //   setRows(initialRows);
  // }, [initialRows, monthKey]);

  /* ---------- Visible rows (only those with data for selected month) ---------- */

  const visibleRows = useMemo(() => {
    return rows.filter((row) => {
      const monthData = row.monthlyData?.[monthKey];
      console.log("monthData", monthData, "monthKey", monthKey);
      return monthData && Object.keys(monthData).length > 0;
    });
  }, [rows, monthKey]);
  console.log("initialRows: ", initialRows);
  console.log("visibleRows", visibleRows);

  useEffect(() => {
    if (onSheetChange) {
      onSheetChange({
        visibleRows,
        month,
        year,
        monthKey,
      });
    }
  }, [visibleRows, month, year, monthKey, onSheetChange]);

  /* ---------- Totals (HOURS -> rendered HH:MM) ---------- */

  const dailyTotalsHours: Record<string, number> = {};
  let grandTotalHours = 0;

  for (const row of visibleRows) {
    const data = (row.monthlyData?.[monthKey] || {}) as Record<
      string,
      string | number
    >;
    for (const day in data) {
      const h = toNumberHours(data[day]);
      dailyTotalsHours[day] = (dailyTotalsHours[day] || 0) + h;
      grandTotalHours += h;
    }
  }

  /* ---------- Layout ---------- */

  const bp = useBreakpoint();
  const fixedColumns = 5;

  const fixedColumnWidth =
    bp === "2xl"
      ? 116
      : bp === "xl"
        ? 96
        : bp === "lg"
          ? 86
          : bp === "md"
            ? 66
            : 96;

  const dynamicAreaWidth = `calc(100vw - ${fixedColumns * fixedColumnWidth}px)`;
  const dateColumnWidth = `calc(${dynamicAreaWidth} / ${daysInMonth.length})`;

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  /* ---------- Render ---------- */

  return (
    <div className="p-1 font-sans w-full max-w-screen overflow-hidden">
      {/* Month Picker */}
      <div className="flex justify-end gap-2 mb-4">
        <Input
          type="month"
          value={monthKey}
          onChange={handleMonthChange}
          className="w-[190px] border-1 border-gray-300 rounded-md text-black-text py-5 cursor-pointer"
        />
      </div>

      {/* Empty State */}
      {isLoading ? (
        <div className="w-full border border-gray-300 rounded text-sm">
          {/* Header */}
          <div className="flex border-b border-gray-300 bg-primary-op-2 font-bold text-black-text text-center">
            <div className="flex items-center justify-center w-[80px] 2xl:w-[100px] p-2 border-r">
              Work Order
            </div>
            <div className="flex items-center justify-center w-[100px] 2xl:w-[120px] p-2 border-r">
              Construction Item
            </div>
            <div className="flex items-center justify-center w-[60px] 2xl:w-[80px] p-2 border-r">
              Work Code
            </div>
            <div className="flex items-center justify-center w-[60px] 2xl:w-[80px] p-2 border-r">
              Others
            </div>
            <div className="flex items-center justify-center w-[40px] 2xl:w-[60px] p-2 border-r">
              Total
            </div>

            {daysInMonth.map((date, idx) => (
              <div
                key={`header-${monthKey}-${idx}`}
                className="p-2 border-r last:border-r-0"
                style={{ width: dateColumnWidth }}
              >
                <div>{String(date.getDate()).padStart(2, "0")}</div>
                <div className="text-[10px] 2xl:text-xs text-gray-600">
                  {dayNames[date.getDay()]}
                </div>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="flex py-8 text-xl text-black-text text-center font-bold justify-center">
            Fetching Data...
          </div>

          {/* Footer */}
          <div className="flex font-semibold bg-gray-100/50 border-t border-gray-300 text-black-text text-center">
            <div className="w-[300px] 2xl:w-[380px] p-2 border-r text-left">
              Actual Man-Hour
            </div>
            <div className="w-[40px] 2xl:w-[60px] p-2 border-r">
              {grandTotalHours}
            </div>

            {daysInMonth.map((_, idx) => (
              <div
                key={`footer-${monthKey}-${idx}`}
                className="p-2 border-r last:border-r-0"
                style={{ width: dateColumnWidth }}
              >
                {dailyTotalsHours[String(idx + 1)] ?? 0}
              </div>
            ))}
          </div>
        </div>
      ) : (
        dataLoaded &&
        visibleRows.length === 0 && (
          <div className="w-full border border-gray-300 rounded text-sm">
            {/* Header */}
            <div className="flex border-b border-gray-300 bg-primary-op-2 font-bold text-black-text text-center">
              <div className="flex items-center justify-center w-[80px] 2xl:w-[100px] p-2 border-r">
                Work Order
              </div>
              <div className="flex items-center justify-center w-[100px] 2xl:w-[120px] p-2 border-r">
                Construction Item
              </div>
              <div className="flex items-center justify-center w-[60px] 2xl:w-[80px] p-2 border-r">
                Work Code
              </div>
              <div className="flex items-center justify-center w-[60px] 2xl:w-[80px] p-2 border-r">
                Others
              </div>
              <div className="flex items-center justify-center w-[40px] 2xl:w-[60px] p-2 border-r">
                Total
              </div>

              {daysInMonth.map((date, idx) => (
                <div
                  key={`header-${monthKey}-${idx}`}
                  className="p-2 border-r last:border-r-0"
                  style={{ width: dateColumnWidth }}
                >
                  <div>{String(date.getDate()).padStart(2, "0")}</div>
                  <div className="text-[10px] 2xl:text-xs text-gray-600">
                    {dayNames[date.getDay()]}
                  </div>
                </div>
              ))}
            </div>

            {/* Body */}
            <div className="flex py-8 text-xl text-black-text text-center font-bold justify-center">
              No records for this month.
            </div>

            {/* Footer */}
            <div className="flex font-semibold bg-gray-100/50 border-t border-gray-300 text-black-text text-center">
              <div className="w-[300px] 2xl:w-[380px] p-2 border-r text-left">
                Actual Man-Hour
              </div>
              <div className="w-[40px] 2xl:w-[60px] p-2 border-r">
                {grandTotalHours}
              </div>

              {daysInMonth.map((_, idx) => (
                <div
                  key={`footer-${monthKey}-${idx}`}
                  className="p-2 border-r last:border-r-0"
                  style={{ width: dateColumnWidth }}
                >
                  {dailyTotalsHours[String(idx + 1)] ?? 0}
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* Data State */}
      {visibleRows.length > 0 && (
        <div className="w-full border border-gray-300 rounded text-sm">
          {/* Header */}
          <div className="flex border-b border-gray-300 bg-primary-op-2 font-bold text-black-text text-center">
            <div className="flex items-center justify-center w-[80px] 2xl:w-[100px] p-2 border-r">
              Work Order
            </div>
            <div className="flex items-center justify-center w-[100px] 2xl:w-[120px] p-2 border-r">
              Construction Item
            </div>
            <div className="flex items-center justify-center w-[60px] 2xl:w-[80px] p-2 border-r">
              Work Code
            </div>
            <div className="flex items-center justify-center w-[60px] 2xl:w-[80px] p-2 border-r">
              Others
            </div>
            <div className="flex items-center justify-center w-[40px] 2xl:w-[60px] p-2 border-r">
              Total
            </div>

            {daysInMonth.map((date, idx) => (
              <div
                key={`header-${monthKey}-${idx}`}
                className="p-2 border-r last:border-r-0"
                style={{ width: dateColumnWidth }}
              >
                <div>{String(date.getDate()).padStart(2, "0")}</div>
                <div className="text-[10px] 2xl:text-xs text-gray-600">
                  {dayNames[date.getDay()]}
                </div>
              </div>
            ))}
          </div>

          {/* Rows */}
          {visibleRows.map((row, rIdx) => {
            const data = row.monthlyData?.[monthKey] || {};
            const totalHours = sumHours(Object.values(data) as any);

            return (
              <div
                key={
                  row.id ??
                  `${row.workOrder}-${row.workCode}-${row.others}-${rIdx}`
                }
                className="flex border-b border-gray-500 text-black-text text-center"
              >
                <div className="w-[80px] 2xl:w-[100px] p-2 border-r border-gray-500">
                  {row.workOrder}
                </div>
                <div className="w-[100px] 2xl:w-[120px] p-2 border-r border-gray-500">
                  {row.construction}
                </div>
                <div className="w-[60px] 2xl:w-[80px] p-2 border-r border-gray-500">
                  {row.workCode}
                </div>
                <div className="w-[60px] 2xl:w-[80px] p-2 border-r border-gray-500">
                  {row.others}
                </div>

                {/* Row total like "18:00" */}
                <div className="w-[40px] 2xl:w-[60px] p-2 border-r border-gray-500 font-semibold">
                  {totalHours}
                </div>

                {daysInMonth.map((date, dIdx) => {
                  const dayKey = String(date.getDate()); // "10"
                  const cellHours = toNumberHours((data as any)[dayKey]); // "09.00" -> 9

                  return (
                    <div
                      key={`${row.id ?? rIdx}-${monthKey}-${dIdx}`}
                      className="p-2 border-r last:border-r-0"
                      style={{ width: dateColumnWidth }}
                    >
                      {cellHours > 0 ? cellHours : ""}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Footer */}
          <div className="flex font-semibold bg-gray-100/50 border-t border-gray-300 text-black-text text-center">
            <div className="w-[300px] 2xl:w-[380px] p-2 border-r text-left">
              Actual Man-Hour
            </div>
            <div className="w-[40px] 2xl:w-[60px] p-2 border-r">
              {grandTotalHours}
            </div>

            {daysInMonth.map((_, idx) => (
              <div
                key={`footer-${monthKey}-${idx}`}
                className="p-2 border-r last:border-r-0"
                style={{ width: dateColumnWidth }}
              >
                {dailyTotalsHours[String(idx + 1)] ?? 0}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SheetDaysLayout;
