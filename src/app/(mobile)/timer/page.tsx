"use client";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useRecordTrackerHooks } from "@/features/timer/hooks/useRecordTracker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createInspectionRecord } from "@/features/timer/services/timer.service";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function TrackerPage() {
  return (
    <ProtectedRoute>
      <TrackerContent />
    </ProtectedRoute>
  );
}

function TrackerContent() {
  const t = useTranslations("timer");
  const tModals = useTranslations("modals");
  const tCommon = useTranslations("common");
  const [searchWorkOrder, setSearchWorkOrder] = useState("");
  const { records, createRecord } = useRecordTrackerHooks(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();

  const filterWorkOrders = records.filter((data) =>
    data.workOrder.toLowerCase().includes(searchWorkOrder.toLowerCase())
  );

  const handleClickWorkOrder = (id: string) => {
    setSelectedRecord(id);
    setOpenModal(true);
  };

  const handleCreateRecord = async () => {
    const record = filterWorkOrders.find((item) => item.id === selectedRecord);
    if (!record) return;

    console.log({
      date,
      type,
      location,
    });
    // Create record with status: null
    try {
      const result = await createInspectionRecord({
        workOrderId: record.workOrderId,
        constructionItemId: record.constructionItemId,
        workCodeId: record.workCodeId,
        othersId: record.othersId,
        date,
        type,
        locationId: location,
        status: null,
      });
      // Navigate to the inspection page with the inspection ID
      router.push(`/timer/${result.data}`);
      setOpenModal(false);
    } catch (error) {
      console.error("Failed to create inspection record:", error);
    }
  };

  const getDate = () => {
    const setTodayDate = new Date().toISOString().split("T")[0];
    setDate(setTodayDate);
  };

  function handleTypeChange(value: string) {
    setType(value);
    // console.log("type", type);
  }
  function handleLocChange(value: string) {
    setLocation(value);
  }

  return (
    <div className="bg-[#e4e4e4] h-full text-black flex flex-col">
      <div className="flex justify-center items-center px-3 pt-6.5 pb-4.5 w-full shadow-lg bg-white">
        <h3>{t("timeTracker")}</h3>
      </div>
      <div className=" h-full p-6 overflow-y-auto space-y-4">
        <div className="p-1">
          <p className="text-xl">
            {t("beginTrackingDesc")}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold">
            {t("workOrder")} <span className="text-primary">*</span>
          </label>
          <Input
            className=" bg-white border-gray-500 text-sm py-5"
            placeholder={t("enterWorkOrder")}
            value={searchWorkOrder}
            onChange={(e) => setSearchWorkOrder(e.target.value)}
          />
        </div>
        {filterWorkOrders.length > 0 && searchWorkOrder ? (
          <div className="bg-white p-4 rounded-md full-shadow max-h-[70%] overflow-auto">
            {filterWorkOrders.map((data) => (
              <div
                key={data.id}
                className="mb-2 border-gray-500 border-b-1 pb-2 font-bold"
              >
                <Button
                  onClick={() => handleClickWorkOrder(data.id)}
                  variant="ghost"
                  className="w-full h-full text-left flex flex-col items-start p-0 gap-0"
                >
                  <h3 className="text-primary font-bold">{data.workOrder}</h3>
                  <div className="flex flex-row w-full justify-between gap-2 text-sm text-gray-500 px-2">
                    <label className="flex flex-col font-bold">
                      {t("constructionItemLabel")}:
                      <span className="font-thin">{data.constructionItem}</span>
                    </label>
                    <label className="font-bold">
                      {t("workCodeLabel")}:{" "}
                      <span className="font-thin">{data.workCode}</span>
                    </label>
                    <label className=" font-bold">
                      {t("othersLabel")}: <span className="font-thin">{data.others}</span>
                    </label>
                  </div>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="box-design text-black-text focus:outline-none">
          <DialogHeader className="border-b border-gray-300 pb-2">
            <DialogTitle className="flex flex-row items-center gap-3 font-semibold">
              {t("inspectionDetails")}
            </DialogTitle>
            <DialogDescription className="text-start text-sm text-gray-300 italic">
              {t("inputAdditionalDetails")}
            </DialogDescription>
          </DialogHeader>

          {/* button here for getDate - disabled input only button*/}
          <div className="flex flex-col text-black gap-2">
            <label className="font-bold">{tModals("date")}</label>
            <div className="flex flex-row gap-2">
              <Input
                className="border-gray-500 text-sm"
                placeholder={t("setDatePlaceholder")}
                value={date}
                disabled
              />
              <Button className="gradient-bg" onClick={getDate}>
                {t("setDateButton")}
              </Button>
            </div>
          </div>
          <div className="flex flex-col text-black gap-2">
            <label className="font-bold">{tModals("type")}</label>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger className="border border-gray-500 rounded-md text-black-text px-3 py-5 w-full data-[state=open]:ring-2 data-[state=open]:ring-primary data-[state=open]:border-transparent">
                <SelectValue placeholder={tModals("selectType")} />
              </SelectTrigger>

              <SelectContent className="bg-white text-black-text border-gray-300">
                <SelectItem value="Inspection" className="selection-hover">
                  {tModals("inspection")}
                </SelectItem>

                <SelectItem value="Receiving" className="selection-hover">
                  {tModals("receiving")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col text-black gap-2">
            <label className="font-bold">{tModals("location")}</label>
            <Select value={location} onValueChange={handleLocChange}>
              <SelectTrigger className="border border-gray-500 rounded-md text-black-text px-3 py-5 w-full data-[state=open]:ring-2 data-[state=open]:ring-primary data-[state=open]:border-transparent">
                <SelectValue placeholder={tModals("selectLocation")} />
              </SelectTrigger>

                <SelectContent className="bg-white text-black-text border-gray-300">
                <SelectItem value="1" className="selection-hover">
                  {t("locationWarehouseA")}
                </SelectItem>

                <SelectItem value="2" className="selection-hover">
                  {t("locationWarehouseB")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button className="cancel-btn">{tCommon("cancel")}</Button>
            <Button
              className="gradient-bg rounded-md text-white px-5 py-2"
              onClick={() => handleCreateRecord()}
            >
              {t("confirmAndStart")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
