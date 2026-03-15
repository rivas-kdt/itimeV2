"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, SquarePen } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useTimerHooks } from "@/features/timer/hooks/useTimerHooks";
import { startInspection } from "@/features/timer/services/timer.service";
import { useState } from "react";
import { TimeStepper } from "@/features/workorders/components/timeSelector";

export default function InspectPage() {
  const searchParams = useSearchParams();

  const workOrderId = searchParams.get("wo") || undefined;
  const workCodeId = searchParams.get("wc") || undefined;
  const constructionItemId = searchParams.get("ci") || undefined;
  const othersId = searchParams.get("o") || undefined;
  const type = searchParams.get("type") || "";
  const location = searchParams.get("location") || "";
  const date = searchParams.get("date") || "";

  const [isInspectionStarted, setIsInspectionStarted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isEditTime, setIsEditTime] = useState(false);

  // Add missing state variables
  const dateToday = new Date().toLocaleDateString();
  const recordedTime = { hours: 5, minutes: 45 };

  const { recordsInfo } = useTimerHooks(workOrderId || "");

  const handleInspection = async () => {
    try {
      const now = new Date();
      const startTime = now.toISOString(); // Full timestamp format

      await startInspection({
        workOrderId: workOrderId!,
        workCodeId: workCodeId!,
        constructionItemId: constructionItemId!,
        othersId: othersId!,
        type,
        locationId: location,
        startTime,
        endTime: startTime, // Initially same as start time
        status: "active",
      });

      setIsInspectionStarted(true);
      setIsFinished(false);
    } catch (error) {
      console.error("Failed to start inspection:", error);
      // Handle error - maybe show a toast or alert
    }
  };
  const handleStopInspection = () => {
    setIsInspectionStarted(false);
  };
  const handleIsOpen = () => {
    // setStartInspection(false)
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleOpenEdit = () => {
    setIsEditing(true);
  };
  const handleCloseEdit = () => {
    setIsEditing(false);
  };
  const handleFinishInspection = () => {
    setIsFinished(true);
  };
  const handleEditInspectTime = () => {
    setIsEditTime(true);
  };
  const handleUpdateInspectTime = () => {
    setIsEditTime(false);
  };

  const [openStartTime, setOpenStartTime] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);

  // State for start/end time
  const [startTime, setStartTime] = useState({
    hour: 8,
    minute: 30,
  });
  const [endTime, setEndTime] = useState({
    hour: 10,
    minute: 0,
  });

  return (
    <div className="bg-background h-full text-black flex flex-col">
      <div className="grid grid-cols-6 gap-2 p-3 pt-5 space-y-2 w-full shadow-md bg-white mb-5">
        <div className="flex justify-center items-center col-span-1">
          <Link href="/timer" className="flex flex-row mt-2 p-0">
            <ChevronLeft className="text-primary" />
            <span className="text-primary">Back</span>
          </Link>
        </div>
        <h3 className="col-span-4 flex justify-center items-center">
          Time Tracker
        </h3>
      </div>

      <div className=" h-full p-6 overflow-y-auto space-y-4 gap-5">
        <div className="bg-white p-4 rounded-md full-shadow">
          <h2 className="font-bold text-black-text">Recording Details</h2>
          <Separator className="border-gray-300 border mt-2 mb-3" />

          {/* simplify */}
          {recordsInfo && (
            <div className="border border-gray-500">
              <div className="flex flex-row justify-between">
                <p className="flex justify-center w-full border border-gray-500 bg-primary-white font-bold">
                  Work Order
                </p>
                <p className="flex justify-center w-full border border-gray-500 text-primary">
                  {recordsInfo.workOrder}
                </p>
              </div>

              <div className="flex flex-row justify-between">
                <p className="flex justify-center w-full border border-gray-500 bg-primary-white font-bold">
                  Construction Item
                </p>
                <p className="flex justify-center w-full border border-gray-500 text-primary">
                  {recordsInfo.construction}
                </p>
              </div>

              <div className="flex flex-row justify-between">
                <p className="flex justify-center w-full border border-gray-500 bg-primary-white font-bold">
                  Work Code
                </p>
                <p className="flex justify-center w-full border border-gray-500 text-primary">
                  {recordsInfo.workCode}
                </p>
              </div>

              <div className="flex flex-row justify-between">
                <p className="flex justify-center w-full border border-gray-500 bg-primary-white font-bold">
                  Others
                </p>
                <p className="flex justify-center w-full border border-gray-500 text-primary">
                  {recordsInfo.others}
                </p>
              </div>

              <div className="flex flex-row justify-between">
                <p className="flex justify-center w-full border border-gray-500 bg-primary-white font-bold">
                  Date
                </p>
                <p className="flex justify-center w-full border border-gray-500 text-primary">
                  {date}
                </p>
              </div>

              <div className="flex flex-row justify-between">
                <p className="flex justify-center w-full border border-gray-500 bg-primary-white font-bold">
                  Type
                </p>
                <p className="flex justify-center w-full border border-gray-500 text-primary">
                  {type}
                </p>
              </div>

              <div className="flex flex-row justify-between">
                <p className="flex justify-center w-full border border-gray-500 bg-primary-white font-bold">
                  Location
                </p>
                <p className="flex justify-center w-full border border-gray-500 text-primary">
                  {location}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col bg-white p-4 rounded-md full-shadow">
          {!isInspectionStarted ? (
            <div>
              <div className="flex justify-center items-center h-50">
                <div className="flex justify-between text-center text-6xl font-bold text-black-text w-full px-8">
                  <span>00</span>
                  <span>:</span>
                  <span>00</span>
                  <span>:</span>
                  <span>00</span>
                </div>
              </div>

              <Button
                className="text-white text-lg py-6 green-gradient w-full"
                onClick={handleInspection}
              >
                Start Inspection
              </Button>
            </div>
          ) : isFinished ? (
            <div>
              <div className="flex flex-col justify-center items-center h-50">
                {/* will change depending on the timer api used */}
                {/* get each part of the time (hrs, mins, sec) */}
                <div className="flex justify-between text-center text-6xl font-bold text-black-text w-full px-8">
                  <span>05</span>
                  <span>:</span>
                  <span>45</span>
                  <span>:</span>
                  <span>54</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  className="text-white text-lg py-6 green-gradient"
                  onClick={handleStopInspection}
                >
                  Save Recorded Time
                </Button>
                <Button
                  className="cancel-btn text-lg h-12"
                  onClick={handleOpenEdit}
                >
                  Edit
                </Button>
                <Button
                  className="text-white text-lg h-12 red-gradient"
                  onClick={handleStopInspection}
                >
                  Reset Time
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col justify-center items-center h-50">
                <div className="flex justify-between text-center text-6xl font-bold text-black-text w-full px-8">
                  <span>05</span>
                  <span>:</span>
                  <span>37</span>
                  <span>:</span>
                  <span>43</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  className="text-white text-lg py-6 red-gradient"
                  onClick={handleFinishInspection}
                >
                  Stop Inspection
                </Button>
                <Button
                  className="cancel-btn text-lg h-12"
                  onClick={handleStopInspection}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="box-design gap-5 focus:outline-none focus:border-none">
          <DialogHeader className="flex flex-row border-b-2 border-gray-100 pb-3">
            <DialogTitle className="flex flex-row items-center gap-3 text-black font-semibold">
              <Image
                src="/stopwatch_icon.png"
                width={35}
                height={35}
                alt="Icon"
              />
              Inspection Duration
            </DialogTitle>
          </DialogHeader>
          {recordsInfo && (
            <div>
              {/* value here should be from data */}
              <div className="flex justify-center w-full text-5xl text-black font-bold">
                5
                <span className="flex items-end font-normal text-gray-300 text-3xl mr-2">
                  h
                </span>
                37
                <span className="flex items-end font-normal text-gray-300 text-3xl mr-2">
                  m
                </span>
                43
                <span className="flex items-end font-normal text-gray-300 text-3xl">
                  s
                </span>
              </div>
              <div className="flex flex-col text-black mt-5">
                <h3>
                  Work Order Number:{" "}
                  <span className="text-primary">{recordsInfo.workOrder}</span>
                </h3>
                <h3>
                  Date Recorded:{" "}
                  <span className="text-primary">{dateToday}</span>
                </h3>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-row justify-between">
            {/* alert dialog or normal dialog */}
            <button
              className="cancel-btn w-full rounded-lg"
              onClick={handleOpenEdit}
            >
              Edit
            </button>
            <button className="green-gradient px-5 py-2 w-full text-white rounded-lg">
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditing} onOpenChange={handleCloseEdit}>
        <DialogContent className="box-design text-black-text focus:outline-none">
          <DialogHeader className="border-b border-gray-300 pb-2">
            <DialogTitle className="flex flex-row items-center gap-3 font-semibold">
              <Image src="/clock_icon.png" width={35} height={35} alt="icon" />
              Total Hour Inspection
            </DialogTitle>
          </DialogHeader>

          {recordsInfo && (
            <div className="border border-gray-500 text-black-text">
              <div className="flex flex-row justify-between">
                <p className="flex justify-center w-full border border-gray-500 bg-primary-white font-bold">
                  Work Order
                </p>
                <p className="flex justify-center w-full border border-gray-500">
                  {recordsInfo.workOrder}
                </p>
              </div>
              <div className="flex flex-row justify-between">
                <p className="flex justify-center w-full border border-gray-500 bg-primary-white font-bold">
                  Construction Item
                </p>
                <p className="flex justify-center w-full border border-gray-500">
                  {recordsInfo.construction}
                </p>
              </div>
              <div className="flex flex-row justify-between">
                <p className="flex justify-center w-full border border-gray-500 bg-primary-white font-bold">
                  Work Code
                </p>
                <p className="flex justify-center w-full border border-gray-500">
                  {recordsInfo.workCode}
                </p>
              </div>
              <div className="flex flex-row justify-between">
                <p className="flex justify-center w-full border border-gray-500 bg-primary-white font-bold">
                  Others
                </p>
                <p className="flex justify-center w-full border border-gray-500">
                  {recordsInfo.others}
                </p>
              </div>
              <div className="flex flex-row justify-between">
                <p className="flex justify-center w-full border border-gray-500 bg-primary-white font-bold">
                  Date
                </p>
                <p className="flex justify-center w-full border border-gray-500">
                  {date}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-row gap-2 justify-between items-center px-3 py-1 ">
            <span className="text-lg font-bold">Recorded Time : </span>
            <div className="flex gap-5 text-center items-center justify-center px-3 py-1 text-black-text bg-primary-op-2 rounded-md">
              {recordedTime.hours}h {recordedTime.minutes}m
              <SquarePen
                className="p-1 rounded-lg text-black-text active:text-primary"
                size={30}
                onClick={handleEditInspectTime}
              />
            </div>
          </div>
          {isEditTime ? (
            <>
              <div className="flex flex-row gap-3">
                <div className="flex flex-col gap-1 items-center">
                  <label className="w-full">Start Time</label>
                  <Input
                    id="start_time"
                    className="border-gray-300 text-sm"
                    // value={`${time.hour}:${time.minute}`}
                    value={`${startTime.hour}:${String(
                      startTime.minute,
                    ).padStart(2, "0")}
                    `}
                    onClick={() => setOpenStartTime(true)}
                    readOnly
                  />
                  <TimeStepper
                    value={startTime}
                    open={openStartTime}
                    onOpenChange={setOpenStartTime}
                    onChange={setStartTime}
                  />
                </div>
                <div className="flex flex-col gap-1 items-center">
                  <label className="w-full">End Time</label>
                  <Input
                    id="end_time"
                    className="border-gray-300 text-sm"
                    // value={`${time.hour}:${time.minute}`}
                    value={`${endTime.hour}:${String(endTime.minute).padStart(
                      2,
                      "0",
                    )}`}
                    onClick={() => setOpenEndTime(true)}
                    readOnly
                  />
                  <TimeStepper
                    value={endTime}
                    open={openEndTime}
                    onOpenChange={setOpenEndTime}
                    onChange={setEndTime}
                  />
                </div>
              </div>
              <Button className="gradient-bg" onClick={handleUpdateInspectTime}>
                Update Time
              </Button>
            </>
          ) : (
            <></>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
