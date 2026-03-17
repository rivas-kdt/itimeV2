// src/app/user-management/[id]/page.tsx
"use client";

import SheetDaysLayout, {
  RowData,
} from "@/features/user-management/components/sheet";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { SheetDaysPdf } from "@/features/user-management/components/printableTracker";

import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  CircleMinus,
  ClipboardCheck,
  Eraser,
  FileDown,
  FileText,
  Frown,
  ListFilter,
  Package2,
  SearchCheck,
  SearchIcon,
  Sheet,
  UserPen,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/useMobile";
import { useTranslations } from "next-intl";

import type { InspectionRowDTO } from "@/features/user-management/types";
import { getColumns } from "./columns";
import { getGroup } from "@/features/user-management/services/management.service";
import { getLocation } from "@/features/records/services/records.service";
import { useUserHooks } from "@/features/user-management/hooks/useUserHooks";

type EditForm = {
  first_name: string;
  last_name: string;
  email: string;
  group: string; // UI value (name) - for now, we map to dummy group_id if needed
  dept: string;
  access: "Admin" | "User";
  group_id?: string; // if you have real UUIDs
};

export type UserInfo = {
  name: string;
  empID?: string;
};

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

export default function UserProfilePage() {
  const params = useParams();
  const empID = String(params.id);

  const router = useRouter();
  const { isMobile, isLoading } = useIsMobile();
  const tTables = useTranslations("tables");
  const t = useTranslations("userProfile");
  const tMgmt = useTranslations("userManagement");
  const tCommon = useTranslations("common");

  // gets the value from the passed month data
  const [currentSheet, setCurrentSheet] = useState<{
    visibleRows: RowData[];
    month: number;
    year: number;
    monthKey: string;
  } | null>(null);

  //checking if mobileview
  useEffect(() => {
    if (isMobile === undefined) return;
    if (isMobile && !isLoading) router.replace("/dashboard");
  }, [isMobile, router, isLoading]);

  const {
    user,
    records,
    loading,

    monthlyData,
    monthlyLoading,
    month,
    year,
    setMonth,
    setYear,

    searchRecord,
    setSearchRecord,
    typeFilter,
    setTypeFilter,
    locationFilter,
    setLocationFilter,

    updateUser,
  } = useUserHooks(empID);

  const [showExport, setShowExport] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCheckedExport, setIsCheckedExport] = useState(false);
  const [checkedRecords, setCheckedRecords] = useState<InspectionRowDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [isEdit, setIsEdit] = useState(false);
  const [editForm, setEditForm] = useState<EditForm | null>(null);

  const userName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`;
  const userInfo = {
    name: userName,
    empID: user?.empID,
  };
  const today = new Date();

  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const columns = useMemo(
    () => getColumns(selectedIds, setSelectedIds, tTables),
    [selectedIds, tTables],
  );

  const handleToast = (status: boolean, action: string) => {
    if (status && action === "exportAll") {
      return toastSuccess(t("exportedFileSuccess"), t("exportedAllDesc"));
    } else if (status && action === "exportMonth") {
      return toastSuccess(t("exportedFileSuccess"), t("exportedMonthDesc"));
    } else if (status && action === "exportSelect") {
      return toastSuccess(t("exportedFileSuccess"), t("exportedSelectDesc"));
    } else if (
      !status &&
      (action === "exportAll" ||
        action === "exportMonth" ||
        action === "exportSelect")
    ) {
      return toastError(t("failedToExport"), t("processFailed"));
    } else if (status && action === "exportTracker") {
      return toastSuccess(
        t("monthlyTrackerExportedSuccess"),
        t("monthlyTrackerExportedDesc"),
      );
    } else if (status && action === "updateDetails") {
      return toastSuccess(
        t("informationUpdatedSuccess"),
        t("informationUpdatedDesc"),
      );
    } else if (!status && action === "exportTracker") {
      return toastError(t("failedToExportTracker"), t("processFailed"));
    } else if (!status && action === "updateDetails") {
      return toastError(
        t("failedToUpdateInformation"),
        t("failedToUpdateInfoDesc"),
      );
    }
  };

  // Export selection
  const handleCheckedExport = () => {
    const filtered = records.filter((r) => selectedIds.includes(r.id));
    setCheckedRecords(filtered);
    setCurrentPage(1);
    setIsCheckedExport(true);
  };

  const handleDelExpEntry = (id: string) => {
    // const updated = checkedRecords.filter((r) => r.id !== id);
    // setCheckedRecords(updated);

    // const updatedSelected = selectedIds.filter((x) => x !== id);
    // setSelectedIds(updatedSelected);

    // const newTotalPages = Math.ceil(updated.length / rowsPerPage);
    // if (currentPage > newTotalPages && newTotalPages > 0)
    //   setCurrentPage(newTotalPages);
    const updated = checkedRecords.filter((r) => r.id !== id);
    setCheckedRecords(updated);

    const updatedSelected = selectedIds.filter((x) => x !== id);
    setSelectedIds(updatedSelected);

    const newTotalPages = Math.max(1, Math.ceil(updated.length / rowsPerPage));

    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = checkedRecords.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.max(
    1,
    Math.ceil(checkedRecords.length / rowsPerPage),
  );
  const hasRecords = checkedRecords.length > 0;

  const handleSheetChange = useCallback(
    (data: {
      visibleRows: RowData[];
      month: number;
      year: number;
      monthKey: string;
    }) => {
      setCurrentSheet(data);
      setSelectedMonth(data.month);
      setSelectedYear(data.year);
    },
    [setCurrentSheet, setSelectedMonth, setSelectedYear],
  );

  // useEffect(() => {
  //   if (!hasRecords) {
  //     setCurrentPage(1);
  //     return;
  //   }
  //   if (currentPage > totalPages) setCurrentPage(totalPages);
  // }, [checkedRecords, totalPages, currentPage, hasRecords]);

  const openEdit = () => {
    if (!user) return;
    setEditForm({
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      email: user.email ?? "",
      group: user.group ?? "",
      dept: user.dept ?? "",
      access: user.role ?? "User",
    });
    setIsEdit(true);
  };

  const handleSave = async () => {
    if (!editForm) return;

    try {
      await updateUser({
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        email: editForm.email,
        access: editForm.access,
        ...(editForm.group_id ? { group_id: editForm.group_id } : {}),
      });

      handleToast(true, "updateDetails");
      setIsEdit(false);
      setEditForm(null);
    } catch {
      handleToast(false, "updateDetails");
    }
  };

  // UI-only options (replace later with real DB groups/depts)
  const [groupOptions, setGroupOptions] = useState<
    Array<{ group_id: string; group_name: string }>
  >([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const res = await getGroup();
      setGroupOptions(res.groups);
    };
    fetchGroups();
  }, []);

  const [loc, setLoc] = useState<any[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await getLocation();
        setLoc(res.locations || []);
      } catch (e) {
        console.error("Failed to fetch locations:", e);
        setLoc([]);
      }
    };
    fetchLocations();
  }, []);

  if (loading) return null;

  if (!user) {
    return (
      <div className="bg-white flex flex-col justify-center items-center gap-5 h-full text-black-text ">
        <Frown size={150} />
        <div className="text-5xl font-bold">{t("userNotFound")}</div>
        <span className="text-gray-300">{t("userNotFoundDesc")}</span>

        <Link href={`/user-management`}>
          <Button className="gradient-bg">{t("goBack")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 h-full p-8">
      {/* Header */}
      <div className="flex flex-col box-design w-full p-8 gap-5">
        <div className="flex flex-row justify-between items-center">
          <Link
            href={`/user-management`}
            className="flex flex-row gap-2 text-black-text cursor-pointer"
          >
            <ChevronLeft />
            {t("back")}
          </Link>
          <div>
            <Button className="btn-css gradient-bg" onClick={openEdit}>
              {t("editUserDetails")}
              <UserPen />
            </Button>
          </div>
        </div>

        <div className="flex flex-row justify-between items-center text-black-text">
          <p className="text-5xl 2xl:text-7xl font-bold">
            {user.last_name}, {user.first_name}
          </p>
          <p className="text-2xl 2xl:text-3xl mt-4 2xl:mt-8">
            {t("employeeNo")} {user.empID}
          </p>
        </div>
      </div>

      {/* Monthly tracker */}
      <div className="flex flex-col box-design w-full p-8 gap-5">
        <div className="flex flex-row justify-between pb-3 border-b border-gray-300">
          <div className="flex flex-row gap-3 text-3xl font-bold">
            <CalendarCheck size={32} />
            {t("monthlyInspectionTracker")}
          </div>

          <div className="flex flex-row gap-5">
            {/* <Button className="btn-css gradient-bg">
              {t("exportAsExcel")}
              <Sheet />
            </Button> */}
            {/* pdf renderer button */}
            <PDFDownloadLink
              document={
                currentSheet ? (
                  <SheetDaysPdf
                    rows={currentSheet?.visibleRows || []}
                    month={currentSheet?.month ?? month}
                    year={currentSheet?.year ?? year}
                    user={userInfo}
                  />
                ) : (
                  <SheetDaysPdf rows={[]} month={0} year={0} user={userInfo} />
                )
              }
              fileName={`Monthly_Tracker_${
                currentSheet?.monthKey || "N/A"
              }.pdf`}
            >
              {({ loading }) => (
                <Button
                  className="btn-css gradient-bg"
                  disabled={loading || !currentSheet}
                  onClick={() => handleToast(true, "exportTracker")}
                >
                  {loading ? t("generatingPdf") : t("downloadPdf")}
                  <FileText className="ml-2" />
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </div>
        <div className="h-fit">
          <SheetDaysLayout
            initialRows={monthlyData}
            month={month}
            year={year}
            setMonth={setMonth}
            setYear={setYear}
            onSheetChange={handleSheetChange}
            isLoading={monthlyLoading}
          />
        </div>
      </div>

      {/* Inspection records */}
      <div className="flex flex-col box-design w-full p-8 gap-5">
        <div className="flex flex-row gap-3 text-3xl font-bold pb-3 border-b border-gray-300">
          <ClipboardCheck size={32} />
          {t("inspectionRecords")}
        </div>

        <div className="flex flex-row gap-3">
          <div className="w-full h-full">
            <ButtonGroup className="w-full">
              <ButtonGroupText
                asChild
                className="h-9 w-10 border border-primary p-2"
              >
                <SearchIcon
                  size={10}
                  strokeWidth={2}
                  className="bg-primary-op-2 text-primary"
                />
              </ButtonGroupText>
              <InputGroup className=" border border-primary p-0 m-0 focus:outline-none">
                <InputGroupInput
                  placeholder={t("searchPlaceholder")}
                  className="text-gray-500 text-lg placeholder:text-lg mt-1"
                  value={searchRecord}
                  onChange={(e) => setSearchRecord(e.target.value)}
                />
              </InputGroup>
            </ButtonGroup>
          </div>

          <div className="flex flex-row justify-between gap-3 h-7.5">
            {/* <Popover>
              <PopoverTrigger className="btn-css gradient-bg">
                Filter by Type
                <ListFilter />
              </PopoverTrigger>
              <PopoverContent
                align="center"
                className="popover-design w-[175px] text-black-text"
              >
                <div
                  className="flex items-center p-3 justify-between cursor-pointer hover:bg-gray-50 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <SearchCheck className="text-primary" />
                    <span className="text-black-text ">Inspection</span>
                  </div>

                  <Checkbox
                    checked={typeFilter.includes("Inspection")}
                    onCheckedChange={(checked) => {
                      setTypeFilter((prev) =>
                        checked
                          ? [...prev, "Inspection"]
                          : prev.filter((t) => t !== "Inspection")
                      );
                    }}
                    className="checkbox-css mr-2"
                  />
                </div>

                <Separator className="border-1 border-primary-300" />

                <div
                  className="flex items-center p-3 justify-between cursor-pointer hover:bg-gray-50 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Package2 className="text-primary" />
                    <span className="text-black-text">Receiving</span>
                  </div>

                  <Checkbox
                    checked={typeFilter.includes("Receiving")}
                    onCheckedChange={(checked) => {
                      setTypeFilter((prev) =>
                        checked
                          ? [...prev, "Receiving"]
                          : prev.filter((t) => t !== "Receiving")
                      );
                    }}
                    className="checkbox-css mr-2"
                  />
                </div>
              </PopoverContent>
            </Popover> */}

            {/* TO DO */}
            <Popover>
              <PopoverTrigger className="btn-css gradient-bg">
                {t("filterByLocation")}
                <ListFilter />
              </PopoverTrigger>
              <PopoverContent
                align="center"
                className="popover-design w-55 text-black"
              >
                {loc.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">
                    {t("noLocationsFound")}
                  </div>
                ) : (
                  loc.map((l, idx) => (
                    <div key={(l as any).loc_id ?? l.location}>
                      <div
                        className="flex items-center p-3 justify-between cursor-pointer hover:bg-gray-50 rounded"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Warehouse className="text-primary" />
                          <span className="text-black-text">{l.location}</span>
                        </div>

                        <Checkbox
                          checked={locationFilter.includes(l.location)}
                          onCheckedChange={(checked) => {
                            setLocationFilter((prev) =>
                              checked
                                ? [...prev, l.location]
                                : prev.filter((x) => x !== l.location),
                            );
                          }}
                          className="checkbox-css mr-2"
                        />
                      </div>

                      {idx !== loc.length - 1 && (
                        <Separator className="border border-primary-300" />
                      )}
                    </div>
                  ))
                )}
              </PopoverContent>
            </Popover>

            <Button
              className="btn-css gradient-bg"
              onClick={() => setShowExport(true)}
            >
              {t("export")}
              <FileDown />
            </Button>

            <Button
              className="btn-css gradient-bg"
              onClick={() => {
                setSelectedIds([]);
                setSearchRecord("");
                setTypeFilter([]);
                setLocationFilter([]);
              }}
            >
              {t("clear")}
              <Eraser />
            </Button>
          </div>
        </div>

        <div className="w-full">
          <DataTable columns={columns} data={records} />
        </div>
      </div>

      {/* Export Dialog */}
      <Dialog open={showExport} onOpenChange={setShowExport}>
        <DialogContent className="box-design max-w-6xl">
          <DialogHeader className="flex flex-col justify-between text-black-text pb-2 border-b-1 border-primary">
            <DialogTitle>{t("exportData")}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-row gap-5 justify-between max-h-75">
            {/* Export ALL DATA */}
            <DialogHeader className="flex flex-col gap-5 border border-gray-500 w-87.5 p-6 rounded-lg">
              <DialogTitle className="font-bold text-black-text">
                {t("exportAllData")}
              </DialogTitle>
              <div className="text-black-text">{t("exportAllDataDesc")}</div>

              <button
                className="gradient-bg rounded-md text-white px-5 py-2 w-full text-nowrap mt-auto cursor-pointer"
                onClick={() => handleToast(true, "exportAll")}
              >
                {t("exportAllData")}
              </button>
            </DialogHeader>

            {/* Export Data for Specific Month */}
            <DialogHeader className="flex flex-col gap-5 border-1 border-gray-500 w-[350px] p-6 rounded-lg">
              <DialogTitle className="font-bold text-black-text">
                {t("exportDataOfMonth")}
              </DialogTitle>
              <div className="text-black-text mb-10">
                {t("exportMonthDesc")}
              </div>

              <div className="flex flex-row justify-between gap-2 mt-auto">
                <Select>
                  <SelectTrigger className="border-1 border-gray-300 rounded-md text-black-text px-3 py-5 w-full cursor-pointer">
                    <SelectValue placeholder={t("selectMonth")} />
                  </SelectTrigger>
                  <SelectContent className="h-[200px] bg-white text-black border-gray-300">
                    {[
                      t("monthJanuary"),
                      t("monthFebruary"),
                      t("monthMarch"),
                      t("monthApril"),
                      t("monthMay"),
                      t("monthJune"),
                      t("monthJuly"),
                      t("monthAugust"),
                      t("monthSeptember"),
                      t("monthOctober"),
                      t("monthNovember"),
                      t("monthDecember"),
                    ].map((m) => (
                      <SelectItem key={m} value={m} className="selection-hover">
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <button
                  className="gradient-bg rounded-md text-white px-5 py-2 w-full text-nowrap cursor-pointer"
                  onClick={() => handleToast(true, "exportMonth")}
                >
                  {t("exportThisMonth")}
                </button>
              </div>
            </DialogHeader>

            {/* Export Selected Data */}
            <DialogHeader className="flex flex-col gap-5 border-1 border-gray-500 w-[350px] p-6 rounded-lg">
              <DialogTitle className="font-bold text-black-text">
                {t("exportCheckedData")}
              </DialogTitle>
              <div className="text-black-text">
                {t("exportCheckedDataDesc")}
              </div>

              <button
                className="gradient-bg rounded-md text-white px-5 py-2 w-full text-nowrap mt-auto cursor-pointer"
                onClick={() => handleCheckedExport()}
              >
                {t("exportSelectedData")}
              </button>
            </DialogHeader>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Details */}
      <Dialog open={isEdit} onOpenChange={setIsEdit}>
        <DialogContent className="box-design max-w-md">
          <DialogHeader className="flex flex-col justify-between text-black-text pb-2 border-b-1 border-primary">
            <DialogTitle>{t("updateUserInformation")}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3 text-black-text">
            <div className="flex flex-col gap-2">
              <label className="font-bold">{t("employeeId")}</label>
              <Input
                className="border-gray-700 text-sm bg-gray-100"
                value={user.empID}
                disabled
              />
            </div>

            <div className="flex flex-row justify-between gap-2">
              <div className="flex flex-col gap-2 w-full">
                <label className="font-bold">{t("firstName")}</label>
                <Input
                  className="border-gray-300 text-sm"
                  placeholder={t("enterFirstName")}
                  value={editForm?.first_name || ""}
                  onChange={(e) =>
                    setEditForm((prev) =>
                      prev ? { ...prev, first_name: e.target.value } : prev,
                    )
                  }
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label className="font-bold">{t("lastName")}</label>
                <Input
                  className="border-gray-300 text-sm"
                  placeholder={t("enterLastName")}
                  value={editForm?.last_name || ""}
                  onChange={(e) =>
                    setEditForm((prev) =>
                      prev ? { ...prev, last_name: e.target.value } : prev,
                    )
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold">{t("email")}</label>
              <Input
                className="border-gray-300 text-sm"
                placeholder={t("enterEmail")}
                value={editForm?.email || ""}
                onChange={(e) =>
                  setEditForm((prev) =>
                    prev ? { ...prev, email: e.target.value } : prev,
                  )
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold">{t("access")}</label>
              <Select
                value={editForm?.access || "User"}
                onValueChange={(v: "Admin" | "User") =>
                  setEditForm((prev) => (prev ? { ...prev, access: v } : prev))
                }
              >
                <SelectTrigger className="border-1 border-gray-300 rounded-md text-black-text px-3 py-5 w-full data-[state=open]:ring-2 data-[state=open]:ring-primary data-[state=open]:border-transparent">
                  <SelectValue placeholder={t("selectAccess")} />
                </SelectTrigger>
                <SelectContent className="bg-white text-black-text border-gray-300">
                  <SelectItem value="Admin" className="selection-hover">
                    {tMgmt("admin")}
                  </SelectItem>
                  <SelectItem value="User" className="selection-hover">
                    {tMgmt("user")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-row justify-between gap-2">
              <div className="flex flex-col gap-2 w-full">
                <label className="font-bold">{t("group")}</label>
                <Select
                  value={editForm?.group || ""}
                  onValueChange={(value) => {
                    // map chosen group name to uuid for PATCH if you have them
                    const found = groupOptions.find(
                      (g) => g.group_name === value,
                    );
                    setEditForm((prev) =>
                      prev
                        ? { ...prev, group: value, group_id: found?.group_id }
                        : prev,
                    );
                  }}
                >
                  <SelectTrigger className="border-1 border-gray-300 rounded-md text-black-text px-3 py-5 w-full max-w-100 min-w-0 flex items-center overflow-hidden data-[state=open]:ring-2 data-[state=open]:ring-primary data-[state=open]:border-transparent">
                    <SelectValue
                      placeholder={t("selectGroup")}
                      className="truncate"
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black-text border-gray-300">
                    {groupOptions.map((g) => (
                      <SelectItem
                        key={g.group_id}
                        value={g.group_name}
                        className="selection-hover"
                      >
                        {g.group_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              className="cancel-btn"
              onClick={() => {
                setIsEdit(false);
                setEditForm(null);
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              className="gradient-bg text-white px-5 py-2 rounded-md"
              onClick={handleSave}
            >
              {t("saveChanges")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog confirmation for Export */}
      <AlertDialog open={isCheckedExport} onOpenChange={setIsCheckedExport}>
        <AlertDialogContent className="box-design">
          <AlertDialogHeader className="text-black">
            <AlertDialogTitle>{t("exportTheseRecords")} </AlertDialogTitle>
            <AlertDialogDescription className="my-3">
              {t("checkAndConfirmRecords")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div>
            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow className="bg-primary-white text-md text-primary-dark">
                  <TableHead className="text-primary-dark text-center w-1/4">
                    Work ID
                  </TableHead>
                  <TableHead className="text-primary-dark text-center w-1/4">
                    Date
                  </TableHead>
                  <TableHead className="text-primary-dark text-center w-1/4">
                    Time
                  </TableHead>
                  <TableHead className="w-1/9"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRows.length > 0 ? (
                  currentRows.map((r) => (
                    <TableRow
                      className="text-sm text-black-text m-0"
                      key={r.id}
                    >
                      <TableCell className="text-center">{r.workID}</TableCell>
                      <TableCell className="text-center">{r.date}</TableCell>
                      <TableCell className="text-center">{r.time}</TableCell>
                      <TableCell className="flex justify-center items-center text-center">
                        <CircleMinus
                          className="text-black-text flex justify-center items-center cursor-pointer"
                          size={20}
                          strokeWidth={1}
                          fill="#ffe8d8"
                          onClick={() => handleDelExpEntry(r.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-3 text-lg font-bold text-black-text"
                    >
                      {t("noEntriesFound")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {hasRecords && (
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={!hasRecords || currentPage === 1}
                  className="bg-white border-1 border-gray-300 text-black-text"
                >
                  <ChevronLeft />
                </Button>

                <span className="text-black-text">
                  {t("pageOf", { current: currentPage, total: totalPages })}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={!hasRecords || currentPage === totalPages}
                  className="bg-white border-1 border-gray-300 text-black-text"
                >
                  <ChevronRight />
                </Button>
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="cancel-btn">
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={!hasRecords}
              className={`gradient-bg ${
                !hasRecords
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : ""
              }`}
              onClick={() => handleToast(true, "exportSelect")}
            >
              {t("exportFile")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
