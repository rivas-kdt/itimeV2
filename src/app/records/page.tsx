/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useMobile";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useTranslations } from "next-intl";

import { DataTable } from "./data-table";
import { getColumns } from "./columns";

import { useRecordsHooks } from "@/features/records/hooks/useRecordsHooks";
import { RecordsToolbar } from "@/features/records/components/RecordsToolbar";
import { ExportDialog } from "@/features/records/components/ExportDialog";
import { DeleteDialog } from "@/features/records/components/DeleteDialog";
import { EditDialog } from "@/features/records/components/EditDialog";
import { ExportPreviewDialog } from "@/features/records/components/ExportPreviewDialog";
import { exportToExcel } from "@/features/records/services/export.service";
import { formatDateWithTimezone } from "@/lib/timezone";

export default function UserRecords() {
  return (
    <ProtectedRoute>
      <UserRecordsContent />
    </ProtectedRoute>
  );
}

function UserRecordsContent() {
  const router = useRouter();
  const t = useTranslations("records");
  const tTables = useTranslations("tables");
  const { isMobile, isLoading } = useIsMobile();

  const {
    records,
    loading,
    error,

    searchRecord,
    setSearchRecord,
    locationFilter,
    setLocationFilter,
    date,
    setDate,

    selectedIds,
    setSelectedIds,

    clearFilters,
    onUpdate,
    onDelete,
  } = useRecordsHooks();

  const [showExport, setShowExport] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isCheckedExport, setIsCheckedExport] = useState(false);

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const [checkedRecords, setCheckedRecords] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    if (isMobile === undefined) return;
    if (isMobile && !isLoading) router.replace("/dashboard");
  }, [isMobile, router, isLoading]);

  const toastStyle = (bg: string, border: string, text: string) => ({
    width: "100%",
    background: `var(${bg})`,
    border: `2px solid var(${border})`,
    color: `var(${text})`,
  });

  const toastSuccess = (title: string, desc: string) =>
    toast.success(title, {
      description: <span className="text-black-text">{desc}</span>,
      style: toastStyle("--lightgreen", "--darkgreen", "--darkgreen"),
    });

  const toastError = (title: string, desc: string) =>
    toast.error(title, {
      description: <span className="text-white">{desc}</span>,
      style: toastStyle("--lightred", "--red", "--darkred"),
    });

  const handleDelete = (id: string) => {
    const rec = records.find((r) => r.id === id) ?? null;
    setSelectedUser(rec);
    setIsDelete(true);
  };

  const handleEdit = (id: string) => {
    const rec = records.find((r) => r.id === id) ?? null;
    setSelectedUser(rec ? { ...rec } : null);
    if (rec) {
      setStartTime(rec.startTime);
      setEndTime(rec.endTime);
    }
    setIsEdit(true);
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    try {
      const updated = await onUpdate(selectedUser.id, {
        date: formatDateWithTimezone(new Date(selectedUser.date)),
        start_time: startTime,
        end_time: endTime,
        type: selectedUser.type,
        location: selectedUser.location,
      });

      setSelectedUser(updated);
      toastSuccess(t("updatedSuccessfully"), t("updatedSuccessfullyDesc"));
      setIsEdit(false);
    } catch (e: any) {
      toastError(t("updateFailed"), e?.message || t("pleaseTryAgain"));
    }
  };

  const confirmDelete = async () => {
    if (!selectedUser?.id) return;
    try {
      await onDelete(selectedUser.id);
      toastSuccess(t("recordRemoved"), t("recordRemovedDesc"));
      setIsDelete(false);
    } catch (e: any) {
      toastError(t("deletionFailed"), e?.message || t("pleaseTryAgain"));
    }
  };

  const handleCheckedExport = () => {
    const selected = records.filter((r) => selectedIds.includes(r.id));
    setCheckedRecords(selected);
    setCurrentPage(1);
    setIsCheckedExport(true);
  };

  const handleDelExpEntry = (id: string) => {
    setCheckedRecords((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const handleExport = async () => {
    try {
      await exportToExcel(checkedRecords, "inspection-records");
      toastSuccess(
        "Exported Successfully",
        `${checkedRecords.length} record(s) exported to file.`
      );
      setIsCheckedExport(false);
    } catch (e: any) {
      toastError("Export Failed", e?.message || "Please try again.");
    }
  };

  const handleExportAll = async () => {
    try {
      await exportToExcel(records, "all-inspection-records");
      toastSuccess(
        "Exported Successfully",
        `All ${records.length} record(s) exported to file.`
      );
      setShowExport(false);
    } catch (e: any) {
      toastError("Export Failed", e?.message || "Please try again.");
    }
  };

  // const handleExportMonth = async () => {
  //   console.log("Exporting month:", date);
  //   try {
  //     if (!date?.from || !date?.to) {
  //       toastError("Invalid Date Range", "Please select a date range first.");
  //       return;
  //     }
  //     const monthYear = new Date(date.from).toLocaleString("default", {
  //       month: "long",
  //       year: "numeric",
  //     });
  //     await exportToExcel(records, `inspection-records-${monthYear}`);
  //     toastSuccess(
  //       "Exported Successfully",
  //       `${records.length} record(s) from selected date range exported.`
  //     );
  //     setShowExport(false);
  //   } catch (e: any) {
  //     toastError("Export Failed", e?.message || "Please try again.");
  //   }
  // };

  const handleExportMonth = async (month: number) => {
    console.log("Exporting month:", month);

    try {
      const filtered = records.filter((r) => {
        const recordDate = new Date(r.date);
        return recordDate.getMonth() === month;
      });

      if (filtered.length === 0) {
        toastError("No Data", "No records found for this month.");
        return;
      }

      const monthName = new Date(0, month).toLocaleString("default", {
        month: "long",
      });

      await exportToExcel(filtered, `inspection-records-${monthName}`);

      toastSuccess(
        "Exported Successfully",
        `${filtered.length} record(s) from ${monthName} exported.`
      );

      setShowExport(false);
    } catch (e: any) {
      toastError("Export Failed", e?.message || "Please try again.");
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil(checkedRecords.length / rowsPerPage)
  );
  const currentRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return checkedRecords.slice(start, start + rowsPerPage);
  }, [checkedRecords, currentPage]);

  useEffect(() => {
    //TODO: Fix this warning
    if (checkedRecords.length === 0) setCurrentPage(1);
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [checkedRecords.length, currentPage, totalPages]);

  const columns = getColumns(
    selectedIds,
    setSelectedIds,
    {
      onEdit: handleEdit,
      onDelete: handleDelete,
    },
    tTables
  );
  // TODO
  return (
    <div className="flex flex-row gap-5 h-full p-8">
      <div className="flex flex-col box-design w-full p-8 gap-8">
        <RecordsToolbar
          searchRecord={searchRecord}
          setSearchRecord={setSearchRecord}
          // typeFilter={typeFilter as any}
          // setTypeFilter={setTypeFilter as any}
          locationFilter={locationFilter as any}
          setLocationFilter={setLocationFilter as any}
          date={date}
          setDate={setDate}
          onOpenExport={() => setShowExport(true)}
          onClear={() => {
            clearFilters();
            toastSuccess(t("clearedFilters"), t("clearedFiltersDesc"));
          }}
        />

        {error ? <div className="text-red-600 text-sm">{error}</div> : null}
        {/* {loading ? (
          <div className="text-gray-500 text-3xl">Loading…</div>
        ) : null} */}

        <div className="w-full">
          <DataTable columns={columns} data={records} loading={loading} />
        </div>
      </div>

      <ExportDialog
        open={showExport}
        onOpenChange={setShowExport}
        onExportAll={() => {
          handleExportAll();
          // toastSuccess(t("exportedSuccessfully"), t("exportedAllDesc"));
        }}
        // onExportMonth={() => {
        //   handleExportMonth();
        //   toastSuccess(t("exportedSuccessfully"), t("exportedMonthDesc"));
        // }}
        onExportMonth={(month) => {
          handleExportMonth(month);
          // toastSuccess(t("exportedSuccessfully"), t("exportedMonthDesc"));
        }}
        onExportSelected={handleCheckedExport}
      />

      <DeleteDialog
        open={isDelete}
        onOpenChange={setIsDelete}
        selectedUser={selectedUser}
        onConfirmDelete={confirmDelete}
      />

      <EditDialog
        open={isEdit}
        onOpenChange={setIsEdit}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        onSave={handleSave}
      />

      <ExportPreviewDialog
        open={isCheckedExport}
        onOpenChange={setIsCheckedExport}
        rows={currentRows}
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        onRemove={handleDelExpEntry}
        onExport={() => {
          handleExport();
          // toastSuccess(t("exportedSuccessfully"), t("exportedSelectedDesc"));
        }}
      />
    </div>
  );
}
