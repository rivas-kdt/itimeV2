import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkOrderEdit } from "@/features/workorders/hooks/useWorkOrderEdit";
import { useWorkOrderHooks } from "@/features/workorders/hooks/useWorkOrderHooks";
import { ChevronLeft, Pencil, AlertCircle, Info, SquarePen } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { TimeStepper } from "@/features/workorders/components/timeSelector";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";

function Skeleton() {
    return (
        <div className="flex flex-col bg-white gap-5 rounded-lg mx-8 p-4 shadow-lg animate-pulse"><div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-3">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-2 h-10 bg-gray-200 rounded"></div>
                    <div className="col-span-1 h-10 bg-gray-200 rounded"></div>
                    <div className="col-span-1 h-10 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    )
}

export default function EditWorkOrdersPage() {
    const searchParams = useSearchParams();

    const workOrderId = searchParams.get("workOrderId") || undefined;
    const workCodeId = searchParams.get("workCodeId") || undefined;
    const constructionItemId = searchParams.get("constructionItemId") || undefined;
    const othersId = searchParams.get("othersId") || undefined;

    const { recordsInfo, recordsInfoLoading, recordsInfoError, refetch } = useWorkOrderHooks(workOrderId, workCodeId, constructionItemId, othersId)

    const {
        isEditing,
        formData,
        startEdit,
        updateField,
        cancelEdit,
        submitEdit,
        isSubmitting,
    } = useWorkOrderEdit();

    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
    const [isEditingTime, setIsEditingTime] = useState<boolean>(false)
    const [openStartTime, setOpenStartTime] = useState<boolean>(false)
    const [openEndTime, setOpenEndTime] = useState<boolean>(false)
    const [startTime, setStartTime] = useState({ hour: 8, minute: 30 })
    const [endTime, setEndTime] = useState({ hour: 10, minute: 0 })

    // Use the recordsInfo data
    const loading = recordsInfoLoading;
    const error = recordsInfoError;

    // Helper to parse ISO date string in local timezone (not UTC)
    const parseLocalDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day); // month is 0-indexed
    };

    // Extract work order from first record
    const workOrder = useMemo(() => {
        if (!recordsInfo || recordsInfo.length === 0) return null;
        return recordsInfo[0];
    }, [recordsInfo]);
    
    const inspectedDates = useMemo(() => {
        if (!recordsInfo || recordsInfo.length === 0) return [];
        return recordsInfo
            .filter(record => record.date !== null)
            .map((record) => parseLocalDate(record.date));
    }, [recordsInfo]);

    const getTotalDurationForDate = (date?: Date) => {
        if (!recordsInfo || recordsInfo.length === 0) return { hours: 0, minutes: 0 };
        
        let inspectionsToSum = recordsInfo;
        
        // If date has a value and records have dates, filter by date
        if (date && recordsInfo.some(r => r.date !== null)) {
            // Format selected date as YYYY-MM-DD in local timezone
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            inspectionsToSum = recordsInfo.filter(record => record.date === dateStr);
        }
        
        let totalMinutes = 0;
        inspectionsToSum.forEach(record => {
            if (record.duration) {
                const [hours, minutes] = record.duration.split(':').map(Number);
                totalMinutes += hours * 60 + minutes;
            }
        });
        
        const totalHours = Math.floor(totalMinutes / 60);
        const totalMins = totalMinutes % 60;
        return { hours: totalHours, minutes: totalMins };
    };

    const recordedTime = getTotalDurationForDate(selectedDate);
    const formattedDate = selectedDate?.toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    });

    const handleSelectDate = (selectedDate: Date | undefined) => {
        if (!selectedDate) return;
        setSelectedDate(selectedDate);
        setIsDialogOpen(true);
    };

    const handleSaveEdit = async () => {
        const success = await submitEdit();
        if (success) {
            refetch();
        }
    };

    const handleEditTime = () => {
        setIsEditingTime(true);
    };

    const handleUpdateTime = () => {
        setIsEditingTime(false);
    };

    return (
    <div className="bg-background h-full overflow-y-scroll text-black">
      {/* Header */}
      <div className="grid grid-cols-6 gap-2 pt-4 pb-4 px-2 space-y-2 w-full shadow-md bg-white mb-5">
        <div className="flex justify-center items-center col-span-1 pl-3">
          <Link href="/work-orders" className="flex flex-row mt-2">
            <ChevronLeft className="text-primary" />
            <span className="text-primary">Back</span>
          </Link>
        </div>
        <h3 className="col-span-4 flex justify-center items-center font-semibold">
          Edit Work Order Details
        </h3>
      </div>

      {/* Content */}
      <div className="pb-8">
        {loading && (
          <>
            <Skeleton />
            <div className="mx-8 mt-5 mb-4 p-3 bg-gray-50 rounded-lg h-64 animate-pulse"></div>
          </>
        )}

        {error && !loading && (
          <div className="mx-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-red-800 font-semibold">Error Loading Work Order</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <Button
                onClick={refetch}
                size="sm"
                variant="outline"
                className="mt-3 text-red-700 border-red-300 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {!loading && !error && workOrder && (
          <>
            {/* Work Order Details */}
            {isEditing && formData ? (
              <div className="flex flex-col bg-white gap-5 rounded-lg mx-8 p-4 shadow-lg">
                <h4 className="font-bold">Edit Work Order Details</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium">Work Order</label>
                    <Input
                      disabled
                      value={formData.work_order || ""}
                      className="border-gray-500 bg-gray-100 text-gray-500"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-2">
                      <label className="text-sm font-medium">
                        Construction Item
                      </label>
                      <Input
                        value={formData.constructionItem || ""}
                        onChange={(e) =>
                          updateField("constructionItem", e.target.value)
                        }
                        className="border-primary"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-sm font-medium">Work Code</label>
                      <Input
                        type="number"
                        value={formData.workCode || ""}
                        onChange={(e) =>
                          updateField("workCode", e.target.value)
                        }
                        className="border-primary"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-sm font-medium">Others</label>
                      <Input
                        type="number"
                        value={formData.others || ""}
                        onChange={(e) =>
                          updateField("others", parseInt(e.target.value) || 0)
                        }
                        className="border-primary"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveEdit}
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-primary-300 to-primary text-white"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      onClick={cancelEdit}
                      disabled={isSubmitting}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col bg-white gap-5 rounded-lg mx-8 p-4 shadow-lg">
                <div className="flex flex-row justify-between items-center">
                  <h4 className="font-bold">Work Order Details</h4>
                  <button
                    onClick={() => startEdit(workOrder)}
                    className="flex items-center gap-2 bg-primary-300 text-white rounded-md py-1 px-3 hover:bg-primary-400 transition"
                  >
                    <Pencil size={18} />
                    Edit
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600">
                      Work Order
                    </label>
                    <Input
                      disabled
                      value={workOrder.workOrder || ""}
                      className="border-gray-500 bg-gray-100 text-gray-600"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-600">
                        Construction Item
                      </label>
                      <Input
                        disabled
                        value={workOrder.construction || ""}
                        className="border-gray-300 bg-gray-50"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-sm font-medium text-gray-600">
                        Work Code
                      </label>
                      <Input
                        disabled
                        value={workOrder.workCode || ""}
                        className="border-gray-300 bg-gray-50"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-sm font-medium text-gray-600">
                        Others
                      </label>
                      <Input
                        disabled
                        value={workOrder.others || ""}
                        className="border-gray-300 bg-gray-50"
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Total Inspections:</span>{" "}
                    {workOrder.inspectionCount || 0}
                  </div>
                </div>
              </div>
            )}

            {/* Calendar Section */}
            <div className="bg-white mx-8 mt-5 mb-4 p-3 rounded-lg shadow-lg">
              <div className="flex items-center justify-between p-2">
                <h3 className="font-bold">
                  Select a Date to View Total Inspection Hours
                </h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Info size={24} className="text-primary" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    sideOffset={-5}
                    align="end"
                    className="border-none bg-white text-black shadow-lg w-fit rounded-lg"
                  >
                    <div className="flex flex-col gap-3 min-w-40">
                      <h4 className="font-bold text-black">Legend</h4>
                      <div className="flex flex-row gap-2 items-center">
                        <div className="bg-primary-300 w-5 h-5 rounded-full"></div>
                        <span className="text-sm">Inspected Date</span>
                      </div>
                      <div className="flex flex-row gap-2 items-center">
                        <div className="bg-primary-op-1 w-5 h-5 rounded-full"></div>
                        <span className="text-sm">Today&apos;s Date</span>
                      </div>
                      <div className="flex flex-row gap-2 items-center">
                        <div className="bg-primary w-5 h-5 rounded-full"></div>
                        <span className="text-sm">Selected Date</span>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <Calendar
                mode="single"
                defaultMonth={selectedDate}
                selected={selectedDate}
                onSelect={handleSelectDate}
                className="rounded-lg w-full bg-primary-white border-2 border-primary-op-2"
                modifiers={{
                  inspected: inspectedDates,
                }}
                modifiersClassNames={{
                  inspected: "inspected-dates",
                }}
              />
            </div>
          </>
        )}

        {!loading && !error && !workOrder && (
          <div className="mx-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">No work order found</p>
          </div>
        )}
      </div>

      {/* Dialog for Inspection Details */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="box-design text-black max-w-md">
          <DialogHeader className="border-b pb-2">
            <DialogTitle className="flex items-center gap-3 font-semibold">
              <Image src="/clock_icon.png" width={35} height={35} alt="Clock" />
              Total Hour Inspection
            </DialogTitle>
          </DialogHeader>

          {workOrder && (
            <div className="space-y-3">
              <div className="border rounded-lg overflow-hidden">
                <div className="flex">
                  <div className="w-1/2 bg-primary-white p-2 font-bold border-r border-b">
                    Work Order
                  </div>
                  <div className="w-1/2 p-2 border-b">
                    {workOrder.workOrder}
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/2 bg-primary-white p-2 font-bold border-r border-b">
                    Construction Item
                  </div>
                  <div className="w-1/2 p-2 border-b">
                    {workOrder.construction}
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/2 bg-primary-white p-2 font-bold border-r border-b">
                    Work Code
                  </div>
                  <div className="w-1/2 p-2 border-b">{workOrder.workCode}</div>
                </div>
                <div className="flex">
                  <div className="w-1/2 bg-primary-white p-2 font-bold border-r border-b">
                    Others
                  </div>
                  <div className="w-1/2 p-2 border-b">{workOrder.others}</div>
                </div>
                <div className="flex">
                  <div className="w-1/2 bg-primary-white p-2 font-bold border-r">
                    Date
                  </div>
                  <div className="w-1/2 p-2">
                    {formattedDate ?? "No date selected"}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-3 py-2 bg-primary-op-2 rounded-md">
                <span className="font-bold">Recorded Time:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {recordedTime.hours}h {recordedTime.minutes}m
                  </span>
                  <button
                    onClick={handleEditTime}
                    className="p-1 hover:bg-primary-300/20 rounded transition"
                  >
                    <SquarePen size={24} className="text-primary" />
                  </button>
                </div>
              </div>

              {isEditingTime && (
                <>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-sm font-medium">Start Time</label>
                      <Input
                        value={`${startTime.hour}:${String(startTime.minute).padStart(2, "0")}`}
                        onClick={() => setOpenStartTime(true)}
                        readOnly
                        className="cursor-pointer"
                      />
                      <TimeStepper
                        value={startTime}
                        open={openStartTime}
                        onOpenChange={setOpenStartTime}
                        onChange={setStartTime}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium">End Time</label>
                      <Input
                        value={`${endTime.hour}:${String(endTime.minute).padStart(2, "0")}`}
                        onClick={() => setOpenEndTime(true)}
                        readOnly
                        className="cursor-pointer"
                      />
                      <TimeStepper
                        value={endTime}
                        open={openEndTime}
                        onOpenChange={setOpenEndTime}
                        onChange={setEndTime}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleUpdateTime}
                    className="w-full bg-gradient-to-r from-primary-300 to-primary text-white"
                  >
                    Update Time
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}