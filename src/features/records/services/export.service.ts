/* eslint-disable @typescript-eslint/no-explicit-any */
import { InspectionsDTO } from "../types";

export async function exportToExcel(
  records: InspectionsDTO[],
  filename: string = "inspection-records",
) {
  try {
    const XLSXModule = await import("xlsx");
    const XLSX = XLSXModule;

    const exportData = records.map((record) => ({
      "Work Order": record.workOrder,
      "Work Code": record.workCode,
      Construction: record.construction,
      Others: record.others,
      Date: record.date,
      "Start Time": record.start_time,
      "End Time": record.end_time,
      Duration: record.duration,
      Type: record.type,
      Location: record.location,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inspections");

    const maxWidth = 20;
    worksheet["!cols"] = Array(Object.keys(exportData[0] || {}).length).fill({
      wch: maxWidth,
    });

    XLSX.writeFile(
      workbook,
      `${filename}-${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  } catch (error) {
    console.error("Export error:", error);
    exportToCSV(records, filename);
  }
}

export function exportToCSV(
  records: InspectionsDTO[],
  filename: string = "inspection-records",
) {
  const headers = [
    "Work Order",
    "Work Code",
    "Construction",
    "Others",
    "Date",
    "Start Time",
    "End Time",
    "Duration",
    "Type",
    "Location",
  ];

  const rows = records.map((record) => [
    record.workOrder,
    record.workCode,
    record.construction,
    record.others,
    record.date,
    record.start_time,
    record.end_time,
    record.duration,
    record.type,
    record.location,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) =>
          typeof cell === "string" && cell.includes(",") ? `"${cell}"` : cell,
        )
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filename}-${new Date().toISOString().split("T")[0]}.csv`,
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
