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

export default function UserProfilePage({
  monthlyPDFData,
}: {
  monthlyPDFData: RowData[];
}) {
  const params = useParams();
  const empID = String(params.id);

  const router = useRouter();
  const { isMobile, isLoading } = useIsMobile();

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

  console.log(monthlyData);

  const [showExport, setShowExport] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCheckedExport, setIsCheckedExport] = useState(false);
  const [checkedRecords, setCheckedRecords] = useState<InspectionRowDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [isEdit, setIsEdit] = useState(false);
  const [editForm, setEditForm] = useState<EditForm | null>(null);

  const today = new Date();

  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const columns = useMemo(
    () => getColumns(selectedIds, setSelectedIds),
    [selectedIds]
  );

  const handleToast = (status: boolean, action: string) => {
    if (status && action === "exportAll") {
      return toastSuccess(
        "Exported the File Successfully",
        "All of the data in the table has been exported."
      );
    } else if (status && action === "exportMonth") {
      return toastSuccess(
        "Exported the File Successfully",
        "Data for the Selected Month has been exported."
      );
    } else if (status && action === "exportSelect") {
      return toastSuccess(
        "Exported the File Successfully",
        "Selected Data has been exported."
      );
    } else if (
      !status &&
      (action === "exportAll" ||
        action === "exportMonth" ||
        action === "exportSelect")
    ) {
      return toastError(
        "Failed to Export the File",
        "Process Failed. Please try again."
      );
    } else if (status && action === "exportTracker") {
      return toastSuccess(
        "Monthly Tracker Exported Successfully",
        `The Monthly Tracker of the user can now be downloaded.`
      );
    } else if (status && action === "updateDetails") {
      return toastSuccess(
        "Information Updated Successfully",
        "User Information was updated."
      );
    } else if (!status && action === "exportTracker") {
      return toastError(
        "Failed to Export Tracker",
        "Process Failed. Please try again."
      );
    } else if (!status && action === "updateDetails") {
      return toastError(
        "Failed to Update Information",
        "User Information was not updated. Please try again."
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
    const updated = checkedRecords.filter((r) => r.id !== id);
    setCheckedRecords(updated);

    const updatedSelected = selectedIds.filter((x) => x !== id);
    setSelectedIds(updatedSelected);

    const newTotalPages = Math.ceil(updated.length / rowsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0)
      setCurrentPage(newTotalPages);
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = checkedRecords.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.max(
    1,
    Math.ceil(checkedRecords.length / rowsPerPage)
  );
  const hasRecords = checkedRecords.length > 0;

  const handlePDF = () => {
    handleToast(true, "exportTracker");
    window.print();
  };

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
    []
  );

  useEffect(() => {
    if (!hasRecords) {
      setCurrentPage(1);
      return;
    }
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [checkedRecords, totalPages, currentPage, hasRecords]);

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

  const deptOptions = [
    { id: "dept_A", name: "dept_A" },
    { id: "dept_B", name: "dept_B" },
  ];

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
        <div className="text-5xl font-bold">User not found</div>
        <span className="text-gray-300">
          We are unable to find the user you&apos;re looking for. Please try
          again.
        </span>

        <Link href={`/user-management`}>
          <Button className="gradient-bg">Go Back</Button>
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
            Back
          </Link>
          <div>
            <Button className="btn-css gradient-bg" onClick={openEdit}>
              Edit User Details
              <UserPen />
            </Button>
          </div>
        </div>

        <div className="flex flex-row justify-between items-center text-black-text">
          <p className="text-5xl 2xl:text-7xl font-bold">
            {user.last_name}, {user.first_name}
          </p>
          <p className="text-2xl 2xl:text-3xl mt-4 2xl:mt-8">
            Employee no. {user.empID}
          </p>
        </div>
      </div>

      {/* Monthly tracker */}
      <div className="flex flex-col box-design w-full p-8 gap-5">
        <div className="flex flex-row justify-between pb-3 border-b-1 border-gray-300">
          <div className="flex flex-row gap-3 text-3xl font-bold">
            <CalendarCheck size={32} />
            Monthly Inspection Tracker
          </div>

          <div className="flex flex-row gap-5">
            <Button className="btn-css gradient-bg" onClick={() => handlePDF()}>
              Export as Excel
              <Sheet />
            </Button>
            {/* pdf renderer button */}
            <PDFDownloadLink
              document={
                currentSheet ? (
                  <SheetDaysPdf
                    rows={currentSheet?.visibleRows || []}
                    month={currentSheet?.month ?? month}
                    year={currentSheet?.year ?? year}
                  />
                ) : (
                  <SheetDaysPdf rows={[]} month={0} year={0} />
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
                >
                  {loading ? "Generating PDF..." : "Download PDF"}
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
        <div className="flex flex-row gap-3 text-3xl font-bold pb-3 border-b-1 border-gray-300">
          <ClipboardCheck size={32} />
          Inspection Records
        </div>

        <div className="flex flex-row gap-3">
          <div className="w-full h-full">
            <ButtonGroup className="w-full">
              <ButtonGroupText
                asChild
                className="h-9 w-[40px] border border-primary p-2"
              >
                <SearchIcon
                  size={10}
                  strokeWidth={2}
                  className="bg-primary-op-2 text-primary"
                />
              </ButtonGroupText>
              <InputGroup className=" border border-primary p-0 m-0 focus:outline-none">
                <InputGroupInput
                  placeholder="Search..."
                  className="text-gray-500 text-lg placeholder:text-lg mt-1"
                  value={searchRecord}
                  onChange={(e) => setSearchRecord(e.target.value)}
                />
              </InputGroup>
            </ButtonGroup>
          </div>

          <div className="flex flex-row justify-between gap-3 h-[30px]">
            <Popover>
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
            </Popover>

            {/* TO DO */}
            <Popover>
              <PopoverTrigger className="btn-css gradient-bg">
                Filter by Location
                <ListFilter />
              </PopoverTrigger>
              <PopoverContent
                align="center"
                className="popover-design w-[220px] text-black"
              >
                {loc.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">
                    No locations found
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
                                : prev.filter((x) => x !== l.location)
                            );
                          }}
                          className="checkbox-css mr-2"
                        />
                      </div>

                      {idx !== loc.length - 1 && (
                        <Separator className="border-1 border-primary-300" />
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
              Export
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
              Clear
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
            <DialogTitle>Export Data</DialogTitle>
          </DialogHeader>

          <div className="flex flex-row gap-5 justify-between max-h-[300px]">
            {/* Export ALL DATA */}
            <DialogHeader className="flex flex-col gap-5 border-1 border-gray-500 w-[350px] p-6 rounded-lg">
              <DialogTitle className="font-bold text-black-text">
                Export All Data
              </DialogTitle>
              <div className="text-black-text">
                This collects all of the table inside the table and exports it
                as an Excel File.
              </div>

              <button
                className="gradient-bg rounded-md text-white px-5 py-2 w-full text-nowrap mt-auto cursor-pointer"
                onClick={() => handleToast(true, "exportAll")}
              >
                Export All Data
              </button>
            </DialogHeader>

            {/* Export Data for Specific Month */}
            <DialogHeader className="flex flex-col gap-5 border-1 border-gray-500 w-[350px] p-6 rounded-lg">
              <DialogTitle className="font-bold text-black-text">
                Export Data of a Month
              </DialogTitle>
              <div className="text-black-text mb-10">
                This collects all of the data from the selected month only. It
                will not export the data from the other months.
              </div>

              <div className="flex flex-row justify-between gap-2 mt-auto">
                <Select>
                  <SelectTrigger className="border-1 border-gray-300 rounded-md text-black-text px-3 py-5 w-full cursor-pointer">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent className="h-[200px] bg-white text-black border-gray-300">
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
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
                  Export this Month
                </button>
              </div>
            </DialogHeader>

            {/* Export Selected Data */}
            <DialogHeader className="flex flex-col gap-5 border-1 border-gray-500 w-[350px] p-6 rounded-lg">
              <DialogTitle className="font-bold text-black-text">
                Export Checked Data
              </DialogTitle>
              <div className="text-black-text">
                This collects all of the data inside the table that has their
                checkbox marked as checked. It exports the selected records as
                an Excel File.
              </div>

              <button
                className="gradient-bg rounded-md text-white px-5 py-2 w-full text-nowrap mt-auto cursor-pointer"
                onClick={() => handleCheckedExport()}
              >
                Export Selected Data
              </button>
            </DialogHeader>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Details */}
      <Dialog open={isEdit} onOpenChange={setIsEdit}>
        <DialogContent className="box-design max-w-md">
          <DialogHeader className="flex flex-col justify-between text-black-text pb-2 border-b-1 border-primary">
            <DialogTitle>Update User Information</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3 text-black-text">
            <div className="flex flex-col gap-2">
              <label className="font-bold">Employee ID</label>
              <Input
                className="border-gray-700 text-sm bg-gray-100"
                value={user.empID}
                disabled
              />
            </div>

            <div className="flex flex-row justify-between gap-2">
              <div className="flex flex-col gap-2 w-full">
                <label className="font-bold">First Name</label>
                <Input
                  className="border-gray-300 text-sm"
                  placeholder="Enter First Name"
                  value={editForm?.first_name || ""}
                  onChange={(e) =>
                    setEditForm((prev) =>
                      prev ? { ...prev, first_name: e.target.value } : prev
                    )
                  }
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label className="font-bold">Last Name</label>
                <Input
                  className="border-gray-300 text-sm"
                  placeholder="Enter Last Name"
                  value={editForm?.last_name || ""}
                  onChange={(e) =>
                    setEditForm((prev) =>
                      prev ? { ...prev, last_name: e.target.value } : prev
                    )
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold">Email</label>
              <Input
                className="border-gray-300 text-sm"
                placeholder="Enter Email"
                value={editForm?.email || ""}
                onChange={(e) =>
                  setEditForm((prev) =>
                    prev ? { ...prev, email: e.target.value } : prev
                  )
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold">Access</label>
              <Select
                value={editForm?.access || "User"}
                onValueChange={(v: "Admin" | "User") =>
                  setEditForm((prev) => (prev ? { ...prev, access: v } : prev))
                }
              >
                <SelectTrigger className="border-1 border-gray-300 rounded-md text-black-text px-3 py-5 w-full data-[state=open]:ring-2 data-[state=open]:ring-primary data-[state=open]:border-transparent">
                  <SelectValue placeholder="Select Access" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black-text border-gray-300">
                  <SelectItem value="Admin" className="selection-hover">
                    Admin
                  </SelectItem>
                  <SelectItem value="User" className="selection-hover">
                    User
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-row justify-between gap-2">
              <div className="flex flex-col gap-2 w-full">
                <label className="font-bold">Group</label>
                <Select
                  value={editForm?.group || ""}
                  onValueChange={(value) => {
                    // map chosen group name to uuid for PATCH if you have them
                    const found = groupOptions.find(
                      (g) => g.group_name === value
                    );
                    setEditForm((prev) =>
                      prev
                        ? { ...prev, group: value, group_id: found?.group_id }
                        : prev
                    );
                  }}
                >
                  <SelectTrigger className="border-1 border-gray-300 rounded-md text-black-text px-3 py-5 w-full data-[state=open]:ring-2 data-[state=open]:ring-primary data-[state=open]:border-transparent">
                    <SelectValue placeholder="Select Group" />
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
              Cancel
            </Button>
            <Button
              className="gradient-bg text-white px-5 py-2 rounded-md"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog confirmation for Export */}
      <AlertDialog open={isCheckedExport} onOpenChange={setIsCheckedExport}>
        <AlertDialogContent className="box-design">
          <AlertDialogHeader className="text-black">
            <AlertDialogTitle>Export these Records? </AlertDialogTitle>
            <AlertDialogDescription className="my-3">
              Check and confirm the list of records to be exported.
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
                      No Entries found
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
                  Page {currentPage} of {totalPages}
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
            <AlertDialogCancel className="cancel-btn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!hasRecords}
              className={`gradient-bg ${
                !hasRecords
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : ""
              }`}
              onClick={() => handleToast(true, "exportSelect")}
            >
              Export File
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
