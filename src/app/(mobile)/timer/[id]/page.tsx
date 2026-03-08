"use client";

import {
  TimeStepper,
  TimeValue,
} from "@/features/records/components/timeSelector";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/useMobile";
import { ChevronLeft, SquarePen, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
// import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { useRecordTrackerHooks } from "@/features/timer/hooks/useRecordTracker";
import { updateInspection } from "@/features/timer/services/timer.service";
import { useTimerHooks } from "@/features/timer/hooks/useTimerHooks";
import { useElapsedTimer } from "@/features/timer/hooks/useElapsedTimer";

export default function TimerPage() {
  // const { workOrderID } = useRouter().query;
  const [startInspection, setStartInspection] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isEditTime, setIsEditTime] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();
  const params = useParams();
  const id = params.id as string;
  const today = new Date();
  // Array of month names
  const months = [
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
  ];
  const month = months[today.getMonth()]; // getMonth() returns 0-11
  const day = today.getDate();
  const year = today.getFullYear();
  const dateToday = `${month} ${day}, ${year}`;

  const { recordsInfo, recordsInfoLoading } = useTimerHooks(id);
  const [elapsedMs, setElapsedMs] = useState(0);

  const [startTimeMs, setStartTimeMs] = useState<number | null>(null); // timestamp when timer started
  const [accumulatedMs, setAccumulatedMs] = useState(0); // time accumulated from previous sessions

  useEffect(() => {
    if (!startInspection || startTimeMs === null) return;

    const interval = setInterval(() => {
      const now = Date.now();
      setElapsedMs(accumulatedMs + (now - startTimeMs)); // total elapsed
    }, 1000);

    return () => clearInterval(interval);
  }, [startInspection, startTimeMs, accumulatedMs]);

  // // Update elapsedMs every second while timer is running
  // useEffect(() => {
  //   if (!startInspection) return;

  //   const interval = setInterval(() => {
  //     setElapsedMs((prev) => prev + 1000); // increment by 1 second
  //   }, 1000);

  //   return () => clearInterval(interval); // cleanup when stop/reset
  // }, [startInspection]);

  useEffect(() => {
    if (isMobile === undefined) return;
    console.log("isMobile: ", isMobile);
    if (!isMobile) router.replace("/dashboard");
    console.log("isMobile routing: ", isMobile);
  }, [isMobile, router]);

  // useEffect(() => {
  //   if (recordsInfo?.status === "active") {
  //     setStartInspection(true);
  //   }
  // }, [recordsInfo]);

  useEffect(() => {
    if (!recordsInfo) return;

    if (recordsInfo.status === "active") {
      setStartInspection(true);
    } else if (
      recordsInfo.status === "ended" &&
      recordsInfo.start_time &&
      recordsInfo.end_time
    ) {
      const start = new Date(recordsInfo.start_time).getTime();
      const end = new Date(recordsInfo.end_time).getTime();
      setElapsedMs(end - start); // retain elapsed time even after stopping
      setStartInspection(false); // ensure timer is stopped
    }
  }, [recordsInfo]);

  // const timer = useElapsedTimer(
  //   recordsInfo?.start_time,
  //   // recordsInfo?.status === "active",
  //   startInspection,
  //   // setElapsedMs,
  // );

  const handleInspection = async () => {
    // try {
    //   const now = new Date();
    //   const startTime = now.toISOString();

    //   await updateInspection(
    //     {
    //       startTime,
    //       status: "active",
    //     },
    //     id as String,
    //   );

    //   setStartTimeMs(Date.now());
    //   setStartInspection(true);
    //   setIsFinished(false);
    // } catch (error) {
    //   console.error("Failed to start inspection:", error);
    //   // Handle error
    // }
    try {
      const now = new Date();
      await updateInspection(
        { startTime: now.toISOString(), status: "active" },
        id,
      );

      setStartTimeMs(Date.now());
      setStartInspection(true);
      setIsFinished(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStopInspection = async () => {
    // try {
    //   const now = new Date();
    //   const endTime = now.toISOString();

    //   await updateInspection(
    //     {
    //       endTime,
    //     },
    //     id as String,
    //   );

    //   setStartInspection(false);
    //   setElapsedMs(0);
    // } catch (error) {
    //   console.error("Failed to stop inspection:", error);
    //   // Handle error
    // }
    try {
      const now = new Date();
      await updateInspection({ endTime: now.toISOString() }, id);

      if (startTimeMs !== null) {
        setAccumulatedMs((prev) => prev + (Date.now() - startTimeMs)); // add current session
      }

      setStartInspection(false);
      setStartTimeMs(null); // stop timer
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetTimer = () => {
    setStartInspection(false);
    setStartTimeMs(null);
    setAccumulatedMs(0);
    setElapsedMs(0);
  };

  const handleSaveInspection = async () => {
    // try {
    //   const now = new Date();
    //   const endTime = now.toISOString();

    //   await updateInspection(
    //     {
    //       endTime,
    //       status: "ended",
    //     },
    //     id as String,
    //   );

    //   setIsFinished(true);
    //   setStartInspection(false);
    //   setStartTimeMs(null);
    // } catch (error) {
    //   console.error("Failed to save inspection:", error);
    //   // Handle error
    // }
    try {
      const now = new Date();
      await updateInspection(
        { endTime: now.toISOString(), status: "ended" },
        id,
      );

      if (startTimeMs !== null) {
        setAccumulatedMs((prev) => prev + (Date.now() - startTimeMs));
      }

      setStartInspection(false);
      setStartTimeMs(null);
      setIsFinished(true);
    } catch (error) {
      console.error(error);
    }
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
  const [startTime, setStartTime] = useState<TimeValue>({
    hour: 8,
    minute: 30,
  });
  const [endTime, setEndTime] = useState<TimeValue>({
    hour: 10,
    minute: 0,
  });

  const hours = String(Math.floor(elapsedMs / (1000 * 60 * 60))).padStart(
    2,
    "0",
  );
  const minutes = String(Math.floor((elapsedMs / (1000 * 60)) % 60)).padStart(
    2,
    "0",
  );
  const seconds = String(Math.floor((elapsedMs / 1000) % 60)).padStart(2, "0");
  // Function to calculate recorded time in hours and minutes
  const calculateRecordedTime = (start: TimeValue, end: TimeValue) => {
    const startMinutes = start.hour * 60 + start.minute;
    const endMinutes = end.hour * 60 + end.minute;

    let diff = endMinutes - startMinutes;
    if (diff < 0) diff += 24 * 60;

    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    return { hours, minutes };
  };

  const formattedDate = (date: any) => {
    console.log(date);
    const formatted = new Date(date).toISOString().split("T")[0];
    console.log(formatted);
    return formatted;
  };

  const recordedTime = calculateRecordedTime(startTime, endTime);

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
          {recordsInfo && !recordsInfoLoading && (
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
                  {recordsInfo?.inspection_date &&
                    formattedDate(recordsInfo.inspection_date)}
                </p>
              </div>

              <div className="flex flex-row justify-between">
                <p className="flex justify-center w-full border border-gray-500 bg-primary-white font-bold">
                  Type
                </p>
                <p className="flex justify-center w-full border border-gray-500 text-primary">
                  {recordsInfo.type}
                </p>
              </div>

              <div className="flex flex-row justify-between">
                <p className="flex justify-center w-full border border-gray-500 bg-primary-white font-bold">
                  Location
                </p>
                <p className="flex justify-center w-full border border-gray-500 text-primary">
                  {recordsInfo.location}
                </p>
              </div>
            </div>
          )}

          {recordsInfoLoading && (
            <div className="text-center py-4">Loading inspection data...</div>
          )}
        </div>

        <div className="flex flex-col bg-white p-4 rounded-md full-shadow">
          {startInspection ? (
            /* RUNNING TIMER */
            <div>
              <div className="flex flex-col justify-center items-center h-50">
                <div className="flex justify-between text-center text-6xl font-bold text-black-text w-full px-8">
                  <span>{hours}</span>
                  <span>:</span>
                  <span>{minutes}</span>
                  <span>:</span>
                  <span>{seconds}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  className="text-white text-lg py-6 green-gradient"
                  onClick={handleSaveInspection}
                >
                  Save Inspection
                </Button>

                <Button
                  className="text-white text-lg py-6 red-gradient"
                  onClick={handleSaveInspection}
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
          ) : recordsInfo?.status === "ended" ? (
            /* FINISHED TIMER */
            <div>
              <div className="flex flex-col justify-center items-center h-50">
                <div className="flex justify-between text-center text-6xl font-bold text-black-text w-full px-8">
                  <span>{hours}</span>
                  <span>:</span>
                  <span>{minutes}</span>
                  <span>:</span>
                  <span>{seconds}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  className="text-white text-lg py-6 green-gradient"
                  onClick={handleSaveInspection}
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
                  onClick={handleResetTimer}
                >
                  Reset Time
                </Button>
              </div>
            </div>
          ) : (
            /* NOT STARTED */
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
                  {recordsInfo.date}
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
