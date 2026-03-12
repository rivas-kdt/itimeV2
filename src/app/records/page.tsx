/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useMobile";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useTranslations } from "next-intl";

import { DataTable } from "./data-table";
import { getColumns, Inspections } from "./columns";

import { useRecordsHooks } from "@/features/records/hooks/useRecordsHooks";
import { RecordsToolbar } from "@/features/records/components/RecordsToolbar";
import { ExportDialog } from "@/features/records/components/ExportDialog";
import { DeleteDialog } from "@/features/records/components/DeleteDialog";
import { EditDialog } from "@/features/records/components/EditDialog";
import { ExportPreviewDialog } from "@/features/records/components/ExportPreviewDialog";
import { getLocation } from "@/features/records/services/records.service";

export default function UserRecords() {
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <ProtectedRoute>
      <UserRecordsContent />
    </ProtectedRoute>
  );
}

function UserRecordsContent() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const t = useTranslations("records");
  const tTables = useTranslations("tables");

  const {
    records,
    loading,
    error,

    searchRecord,
    setSearchRecord,
    typeFilter,
    setTypeFilter,
    locationFilter,
    setLocationFilter,

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
    if (isMobile) router.replace("/dashboard");
  }, [isMobile, router]);

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
      setStartTime(rec.start_time);
      setEndTime(rec.end_time);
    }
    setIsEdit(true);
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    try {
      const updated = await onUpdate(selectedUser.id, {
        date: selectedUser.date,
        start_time: startTime,
        end_time: endTime,
        type: selectedUser.type,
        location: selectedUser.location,
      });

      setSelectedUser(updated);
      toastSuccess(
        t("updatedSuccessfully"),
        t("updatedSuccessfullyDesc"),
      );
      setIsEdit(false);
    } catch (e: any) {
      toastError(t("updateFailed"), e?.message || t("pleaseTryAgain"));
    }
  };

  const confirmDelete = async () => {
    if (!selectedUser?.id) return;
    try {
      await onDelete(selectedUser.id);
      toastSuccess(
        t("recordRemoved"),
        t("recordRemovedDesc"),
      );
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

  const totalPages = Math.max(
    1,
    Math.ceil(checkedRecords.length / rowsPerPage),
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

  const columns = getColumns(selectedIds, setSelectedIds, {
    onEdit: handleEdit,
    onDelete: handleDelete,
  }, tTables);
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
        //TODO: implement export all
        onExportAll={() =>
          toastSuccess(
            t("exportedSuccessfully"),
            t("exportedAllDesc"),
          )
        }
        //TODO: implement export month
        onExportMonth={() =>
          toastSuccess(
            t("exportedSuccessfully"),
            t("exportedMonthDesc"),
          )
        }
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
        //TODO: implement export checked
        onExport={() =>
          toastSuccess(
            t("exportedSuccessfully"),
            t("exportedSelectedDesc"),
          )
        }
      />
    </div>
  );
}
