"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomComboBox } from "@/components/customComboBox";
import { useWorkOrderEdit } from "@/features/workorders/hooks/useWorkOrderEdit";
import { useWorkOrderHooks } from "@/features/workorders/hooks/useWorkOrderHooks";
import { useWorkOrderLists } from "@/features/workorders/hooks/useWorkOrderLists";
import {
  ChevronLeft,
  Pencil,
  AlertCircle,
  Info,
  SquarePen,
} from "lucide-react";
import Link from "next/link";
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
import { useSearchParams, useRouter } from "next/navigation";
import { toTimezoneISOString } from "@/lib/timezone";
import { useTranslations } from "next-intl";

function Skeleton() {
  return (
    <div className="flex flex-col bg-white gap-5 rounded-lg mx-8 p-4 shadow-lg animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="space-y-3">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-2 h-10 bg-gray-200 rounded"></div>
          <div className="col-span-1 h-10 bg-gray-200 rounded"></div>
          <div className="col-span-1 h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function EditWorkOrdersPage() {
  const t = useTranslations("editWorkOrder");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const router = useRouter();

  const workOrderId = searchParams.get("workOrderId") || undefined;
  const workCodeId = searchParams.get("workCodeId") || undefined;
  const constructionItemId =
    searchParams.get("constructionItemId") || undefined;
  const othersId = searchParams.get("othersId") || undefined;

  const {
    recordsInfo,
    recordsTotal,
    recordsInfoLoading,
    recordsInfoError,
    refetch,
    refetchRecordInfo,
  } = useWorkOrderHooks(workOrderId, workCodeId, constructionItemId, othersId);

  const {
    isEditing,
    formData,
    startEdit,
    updateConstructionItem,
    updateWorkCode,
    updateOthers,
    cancelEdit,
    submitEdit,
    isSubmitting,
  } = useWorkOrderEdit();

  const { itemList, workCodeList, othersList } = useWorkOrderLists();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditingTime, setIsEditingTime] = useState<boolean>(false);
  const [openStartTime, setOpenStartTime] = useState<string | boolean>(false);
  const [openEndTime, setOpenEndTime] = useState<string | boolean>(false);
  const [startTime, setStartTime] = useState({ hour: 8, minute: 30 });
  const [endTime, setEndTime] = useState({ hour: 10, minute: 0 });
  const [editedInspections, setEditedInspections] = useState<
    Record<string, { startTime?: string; endTime?: string }>
  >({});

  // Use the recordsInfo data
  const loading = recordsInfoLoading;
  const error = recordsInfoError;

  // Helper to parse ISO date string in local timezone (not UTC)
  const parseLocalDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
  };

  // Extract work order from first record
  const workOrder = useMemo(() => {
    if (!recordsInfo || recordsInfo.length === 0) return null;
    const data = {
      workOrderId: workOrderId,
      workOrder: recordsInfo[0].workOrder,
      constructionItemId: constructionItemId,
      construction: recordsInfo[0].construction,
      workCodeId: workCodeId,
      workCode: recordsInfo[0].workCode,
      othersId: othersId,
      others: recordsInfo[0].others,
    };
    return data;
  }, [recordsInfo]);

  const inspectedDates = useMemo(() => {
    if (!recordsInfo || recordsInfo.length === 0) return [];
    return recordsInfo
      .filter((record) => record.date !== null)
      .map((record) => parseLocalDate(record.date));
  }, [recordsInfo]);

  const getInspectionsForDate = (date?: Date) => {
    if (!recordsInfo || recordsInfo.length === 0) return [];
    if (date && recordsInfo.some((r) => r.date !== null)) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(1, "0");
      const dateStr = `${year}-${month}-${day}`;
      return recordsInfo.filter((record) => record.date === dateStr);
    }

    return recordsInfo;
  };

  const getTotalDurationForDate = (date?: Date) => {
    const inspectionsToSum = getInspectionsForDate(date);

    let totalMinutes = 0;
    inspectionsToSum.forEach((record) => {
      if (record.duration) {
        const [hours, minutes] = record.duration.split(":").map(Number);
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
  });

  // Extract string values for CustomComboBox display
  const itemListValues = useMemo(
    () => itemList.map((item) => item.value),
    [itemList],
  );
  const workCodeListValues = useMemo(
    () => workCodeList.map((item) => item.value),
    [workCodeList],
  );
  const othersListValues = useMemo(
    () => othersList.map((item) => item.value),
    [othersList],
  );

  // Mapping functions to find ID from value
  const getItemId = (value: string) => {
    const item = itemList.find((i) => i.value === value);
    return item?.id?.toString();
  };

  const getWorkCodeId = (value: string) => {
    const item = workCodeList.find((i) => i.value === value);
    return item?.id?.toString();
  };

  const getOthersId = (value: string) => {
    const item = othersList.find((i) => i.value === value);
    return item?.id?.toString();
  };

  // Wrapper functions to pass both value and ID
  const handleConstructionItemChange = (value: string) => {
    updateConstructionItem(value, getItemId(value));
  };

  const handleWorkCodeChange = (value: string) => {
    updateWorkCode(value, getWorkCodeId(value));
  };

  const handleOthersChange = (value: string) => {
    updateOthers(value, getOthersId(value));
  };

  const handleSelectDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setSelectedDate(selectedDate);
    setIsDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    // Extract inspection IDs from recordsInfo
    const inspectionIds =
      recordsInfo
        ?.map((record) => record.id || record.inspection_id)
        .filter(Boolean) || [];
    const result = await submitEdit(inspectionIds);
    if (result) {
      // Redirect to edit page with updated query parameters
      const params = new URLSearchParams({
        workOrderId: result.workOrderId || "",
        workCodeId: result.workCodeId || "",
        constructionItemId: result.constructionItemId || "",
        othersId: result.othersId || "",
      });
      router.push(`/work-orders/edit?${params.toString()}`);
    }
  };

  const handleEditTime = () => {
    setIsEditingTime(true);
  };

  const handleDialogClose = () => {
    setIsEditingTime(false);
    setIsDialogOpen(false);
  };

  const handleUpdateTime = () => {
    setIsEditingTime(false);
  };

  const setInspectionTime = (
    inspectionId: string | number,
    timeField: "startTime" | "endTime",
    time: { hour: number; minute: number },
  ) => {
    const timeString = `${String(time.hour).padStart(2, "0")}:${String(
      time.minute,
    ).padStart(2, "0")}`;
    setEditedInspections((prev) => ({
      ...prev,
      [inspectionId]: {
        ...prev[inspectionId],
        [timeField]: timeString,
      },
    }));
  };

  const handleSaveInspectionTimes = async () => {
    try {
      const updatesToApply = Object.entries(editedInspections);
      for (const [inspectionId, updates] of updatesToApply) {
        const res = await fetch(`/api/v2/inspections/${inspectionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error(
            `Failed to update inspection ${inspectionId}:`,
            errorData,
          );
        }
      }
      setEditedInspections({});
      setIsEditingTime(false);
      setIsDialogOpen(false);

      // Refetch recordsInfo data to update frontend in real-time
      refetchRecordInfo?.();
    } catch (error) {
      console.error("Failed to save inspection times:", error);
    }
  };

  const formatTime = (time: any) => {
    const [hour, minute] = time.split(":").map(Number);

    const result = {
      hour,
      minute,
    };
    return result;
  };

  const startInspection = async () => {
    try {
      if (!workOrder) {
        console.error("Work order data not available");
        return;
      }

      // Format selected date using timezone utility
      const selectedDateISO = toTimezoneISOString(selectedDate);
      const inspectionRes = await fetch("/api/v2/inspections", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workOrderId: workOrderId,
          workCodeId: workCodeId,
          constructionItemId: constructionItemId,
          othersId: othersId,
          type: "Inspection",
          locationId: 1,
          inspection_date: selectedDateISO,
          startTime: new Date().toISOString(),
          status: null,
        }),
      });

      const inspectionData = await inspectionRes.json();
      if (!inspectionRes.ok) {
        throw new Error(inspectionData?.error || "Failed to create inspection");
      }

      const inspectionId = inspectionData.data || inspectionData.inspection_id;
      router.push(`/timer/${inspectionId}`);
    } catch (error) {
      console.error("Error starting inspection:", error);
    }
  };

  return (
    <div className="bg-background h-full overflow-y-scroll text-black">
      {/* Header */}
      <div className="grid grid-cols-6 gap-2 pt-4 pb-4 px-2 space-y-2 w-full shadow-md bg-white mb-5">
        <div className="flex justify-center items-center col-span-1 pl-3">
          <Link href="/work-orders" className="flex flex-row mt-2">
            <ChevronLeft className="text-primary" />
            <span className="text-primary">{t("back")}</span>
          </Link>
        </div>
        <h3 className="col-span-4 flex justify-center items-center font-semibold">
          {t("title")}
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
            <AlertCircle className="text-red-600 shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-red-800 font-semibold">
                {t("errorLoadingWorkOrder")}
              </p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <Button
                onClick={refetch}
                size="sm"
                variant="outline"
                className="mt-3 text-red-700 border-red-300 hover:bg-red-50"
              >
                {t("tryAgain")}
              </Button>
            </div>
          </div>
        )}

        {!loading && !error && workOrder && (
          <>
            {/* Work Order Details */}
            {isEditing && formData ? (
              <div className="flex flex-col bg-white gap-5 rounded-lg mx-8 p-4 shadow-lg">
                <h4 className="font-bold">{t("editWorkOrderDetails")}</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium">
                      {t("workOrder")}
                    </label>
                    <Input
                      disabled
                      value={formData.work_order || ""}
                      className="border-gray-500 bg-gray-100 text-gray-500"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-2">
                      <CustomComboBox
                        label={t("constructionItem")}
                        value={formData.constructionItem || ""}
                        setValue={handleConstructionItemChange}
                        items={itemListValues}
                        placeholder={t("selectConstructionItem")}
                      />
                    </div>
                    <div className="col-span-1">
                      <CustomComboBox
                        label={t("workCode")}
                        value={formData.workCode?.toString() || ""}
                        setValue={handleWorkCodeChange}
                        items={workCodeListValues}
                        placeholder={t("selectWorkCode")}
                      />
                    </div>
                    <div className="col-span-1">
                      <CustomComboBox
                        label={t("others")}
                        value={formData.others?.toString() || ""}
                        setValue={handleOthersChange}
                        items={othersListValues}
                        placeholder={t("selectOthers")}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveEdit}
                      disabled={isSubmitting}
                      className="flex-1 bg-linear-to-r from-primary-300 to-primary text-white"
                    >
                      {isSubmitting ? t("saving") : t("saveChanges")}
                    </Button>
                    <Button
                      onClick={cancelEdit}
                      disabled={isSubmitting}
                      variant="outline"
                      className="flex-1"
                    >
                      {t("cancel")}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col bg-white gap-5 rounded-lg mx-8 p-4 shadow-lg">
                <div className="flex flex-row justify-between items-center">
                  <h4 className="font-bold">{t("workOrderDetails")}</h4>
                  {/* <button
                    onClick={() => startEdit(workOrder)}
                    className="flex items-center gap-2 bg-primary-300 text-white rounded-md py-1 px-3 hover:bg-primary-400 transition"
                  >
                    <Pencil size={18} />
                    {t("edit")}
                  </button> */}
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600">
                      {t("workOrder")}
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
                        {t("constructionItem")}
                      </label>
                      <Input
                        disabled
                        value={workOrder.construction || ""}
                        className="border-gray-300 bg-gray-50"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-sm font-medium text-gray-600">
                        {t("workCode")}
                      </label>
                      <Input
                        disabled
                        value={workOrder.workCode || ""}
                        className="border-gray-300 bg-gray-50"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-sm font-medium text-gray-600">
                        {t("others")}
                      </label>
                      <Input
                        disabled
                        value={workOrder.others || ""}
                        className="border-gray-300 bg-gray-50"
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">
                      {t("totalInspections")}:
                    </span>{" "}
                    {String(recordsTotal || 0)}
                  </div>
                </div>
              </div>
            )}

            {/* Calendar Section */}
            <div className="bg-white mx-8 mt-5 mb-4 p-3 rounded-lg shadow-lg">
              <div className="flex items-center justify-between p-2">
                <h3 className="font-bold">{t("selectDateToViewHours")}</h3>
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
                      <h4 className="font-bold text-black">{t("legend")}</h4>
                      <div className="flex flex-row gap-2 items-center">
                        <div className="bg-primary-300 w-5 h-5 rounded-full"></div>
                        <span className="text-sm">{t("inspectedDate")}</span>
                      </div>
                      <div className="flex flex-row gap-2 items-center">
                        <div className="bg-primary-op-1 w-5 h-5 rounded-full"></div>
                        <span className="text-sm">{t("todaysDate")}</span>
                      </div>
                      <div className="flex flex-row gap-2 items-center">
                        <div className="bg-primary w-5 h-5 rounded-full"></div>
                        <span className="text-sm">{t("selectedDate")}</span>
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
                className="rounded-lg w-full border border-gray-300"
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
            <p className="text-yellow-800">{t("noWorkOrderFound")}</p>
          </div>
        )}
      </div>

      {/* Dialog for Inspection Details */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="box-design text-black max-w-sm">
          <DialogHeader className="border-b pb-2">
            <DialogTitle className="flex items-center gap-3 font-semibold">
              <Image src="/clock_icon.png" width={35} height={35} alt="Clock" />
              {t("totalHourInspection")}
            </DialogTitle>
          </DialogHeader>

          {workOrder && (
            <div className="space-y-3">
              <div className="border rounded-lg overflow-hidden">
                <div className="flex">
                  <div className="w-1/2 bg-primary-white p-2 font-bold border-r border-b">
                    {t("workOrder")}
                  </div>
                  <div className="w-1/2 p-2 border-b">
                    {workOrder.workOrder}
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/2 bg-primary-white p-2 font-bold border-r border-b">
                    {t("constructionItem")}
                  </div>
                  <div className="w-1/2 p-2 border-b">
                    {workOrder.construction}
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/2 bg-primary-white p-2 font-bold border-r border-b">
                    {t("workCode")}
                  </div>
                  <div className="w-1/2 p-2 border-b">{workOrder.workCode}</div>
                </div>
                <div className="flex">
                  <div className="w-1/2 bg-primary-white p-2 font-bold border-r border-b">
                    {t("others")}
                  </div>
                  <div className="w-1/2 p-2 border-b">{workOrder.others}</div>
                </div>
                <div className="flex">
                  <div className="w-1/2 bg-primary-white p-2 font-bold border-r">
                    {t("date")}
                  </div>
                  <div className="w-1/2 p-2">
                    {formattedDate ?? t("noDateSelected")}
                  </div>
                </div>
              </div>

              {recordedTime.hours === 0 && recordedTime.minutes === 0 ? (
                // <div className="flex items-center justify-center px-3 py-2 bg-primary-op-2 rounded-md">
                <Button
                  onClick={startInspection}
                  className="w-full bg-primary text-white hover:bg-primary-400"
                >
                  {t("startInspection")}
                </Button>
              ) : (
                // </div>
                <div className="flex items-center justify-between px-3 py-2 bg-primary-white border border-black rounded-md">
                  <div className="flex flex-col">
                    <span className="font-bold">{t("recordedTime")}:</span>
                    <span className="text-xs text-gray-600">
                      {getInspectionsForDate(selectedDate).length}{" "}
                      {getInspectionsForDate(selectedDate).length === 1
                        ? t("inspection")
                        : "inspections"}
                    </span>
                  </div>
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
              )}

              {isEditingTime && (
                <>
                  {(() => {
                    const inspectionsOnDate =
                      getInspectionsForDate(selectedDate);
                    if (inspectionsOnDate.length === 0) {
                      return (
                        <div className="text-center py-4 text-gray-500">
                          {t("noInspectionsOnDate")}
                        </div>
                      );
                    }
                    return (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {inspectionsOnDate
                          .sort((a, b) => {
                            const timeA = (
                              a.start_time ||
                              a.startTime ||
                              "00:00"
                            ).toString();
                            const timeB = (
                              b.start_time ||
                              b.startTime ||
                              "00:00"
                            ).toString();
                            // Parse HH:MM format as minutes for correct comparison
                            const parseTime = (timeStr: string) => {
                              const match = timeStr.match(/(\d{2}):?(\d{2})/);
                              if (match) {
                                return (
                                  parseInt(match[1]) * 60 + parseInt(match[2])
                                );
                              }
                              return 0;
                            };
                            return parseTime(timeA) - parseTime(timeB);
                          })
                          .map((inspection, index) => {
                            const inspectionId =
                              inspection.id || inspection.inspection_id;
                            const editedData = editedInspections[inspectionId];
                            const displayStartTime =
                              editedData?.startTime ||
                              inspection.startTime ||
                              "";
                            const displayEndTime =
                              editedData?.endTime || inspection.endTime || "";

                            return (
                              <div
                                key={inspectionId || index}
                                className="border rounded-lg p-3 bg-gray-50"
                              >
                                <div className="font-semibold text-sm mb-3 pb-2 border-b">
                                  {t("inspection")} #{index + 1}
                                </div>
                                <div className="flex gap-3">
                                  <div className="flex-1">
                                    <label className="text-sm font-medium">
                                      {t("startTime")}
                                    </label>
                                    <Input
                                      value={displayStartTime}
                                      onClick={() =>
                                        setOpenStartTime(inspectionId)
                                      }
                                      readOnly
                                      className="cursor-pointer"
                                    />
                                    {openStartTime === inspectionId && (
                                      <TimeStepper
                                        value={formatTime(
                                          displayStartTime || "00:00",
                                        )}
                                        open={true}
                                        onOpenChange={(open) =>
                                          setOpenStartTime(
                                            open ? inspectionId : false,
                                          )
                                        }
                                        onChange={(time) =>
                                          setInspectionTime(
                                            inspectionId,
                                            "startTime",
                                            time,
                                          )
                                        }
                                      />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <label className="text-sm font-medium">
                                      {t("endTime")}
                                    </label>
                                    <Input
                                      value={displayEndTime}
                                      onClick={() =>
                                        setOpenEndTime(inspectionId)
                                      }
                                      readOnly
                                      className="cursor-pointer"
                                    />
                                    {openEndTime === inspectionId && (
                                      <TimeStepper
                                        value={formatTime(
                                          displayEndTime || "00:00",
                                        )}
                                        open={true}
                                        onOpenChange={(open) =>
                                          setOpenEndTime(
                                            open ? inspectionId : false,
                                          )
                                        }
                                        onChange={(time) =>
                                          setInspectionTime(
                                            inspectionId,
                                            "endTime",
                                            time,
                                          )
                                        }
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    );
                  })()}
                  <Button
                    onClick={handleSaveInspectionTimes}
                    className="w-full bg-linear-to-r from-primary-300 to-primary text-white"
                  >
                    {t("updateTime")}
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
