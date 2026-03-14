"use client";

import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { AlarmClock, ClipboardList, CloudAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { use } from "react";
import { useMobileDashboardHooks } from "../hooks/useMobileDashboardHooks";
import { useTranslations } from "next-intl";
import { useTimerHooks } from "../hooks/useTimerHooks";
import { useElapsedTimer } from "../hooks/useElapsedTimer";

export default function MobileDashboard() {
  const t = useTranslations("dashboard");
  const {
    inspectionToday,
    inspectionThisWeek,
    inspection,
    recentInspections,
    loading,
    error,
  } = useMobileDashboardHooks();
  const { session } = useAuth();

  const { activeSession } = useTimerHooks();
  const { hours, minutes, seconds } = useElapsedTimer(
    activeSession?.start_time,
    activeSession?.status === "active"
  );
  console.log(activeSession, hours);

  // const activeSession = true;
  const userName = session?.user?.firstName || t("defaultInspectorName");

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("goodMorning");
    if (hour < 18) return t("goodAfternoon");
    return t("goodEvening");
  };

  if (error) {
    return (
      <div className="text-black flex flex-col items-center justify-center">
        <CloudAlert className="text-red-500" size={150} />
        <p className="text-red-500 font-bold text-3xl">
          {t("errorLoadingDashboard")}
        </p>
        <p className="text-lg text-gray-500 mt-5">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="text-black flex flex-col">
        <div className=" p-4 w-full shadow-lg bg-white fixed z-10">
          <p className=" text-2xl font-medium">
            {getGreeting()},{" "}
            <span className=" text-primary font-bold">{userName}!</span>
          </p>
          <p className=" text-md text-black/75">{t("progressToday")}</p>
        </div>
        <div className=" h-full p-4 overflow-y-auto translate-y-22 space-y-4 no-scrollbar">
          {activeSession ? (
            <div className=" p-4 rounded-md bg-white shadow-md">
              <h3 className=" text-primary font-bold">Active Session</h3>

              <div className=" flex flex-col mt-2">
                <p className=" font-bold text-md">
                  Work Order:{" "}
                  <span className=" font-normal text-black">
                    {activeSession?.workOrder}
                  </span>
                </p>
                <Table className="mt-2 border-1">
                  <TableHeader>
                    <TableRow className="bg-pale-brown">
                      <TableHead className=" font-bold text-sm">
                        Construction Item
                      </TableHead>
                      <TableHead className=" font-bold text-sm">
                        Work Code
                      </TableHead>
                      <TableHead className=" font-bold text-sm">
                        Others
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className=" font-normal">
                        {activeSession?.construction}
                      </TableCell>
                      <TableCell className=" font-normal">
                        {activeSession?.workCode}
                      </TableCell>
                      <TableCell className=" font-normal">
                        {activeSession?.others}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className=" flex flex-col mt-5">
                <div className="flex flex-row justify-between">
                  <p className=" text-xl font-normal text-black">
                    Elapsed Time:
                  </p>
                  <p className=" text-xl font-bold mb-2">{`${hours}:${minutes}:${seconds}`}</p>
                </div>
                <Link
                  href={`/timer/${activeSession?.inspection_id}`}
                  className="w-full"
                >
                  <Button className=" red-gradient active:bg-red-700 px-4 py-1 rounded-sm w-full text-white text-sm">
                    Go to Inspection Tracker
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className=" p-4 rounded-md bg-white shadow-md">
              <h3 className=" text-primary font-bold">Active Session</h3>
              <div className=" flex flex-col justify-center items-center font-bold mt-2 py-8 px-3 gap-5">
                No Active Session
                <Link href="/scan-barcode" className="w-full">
                  <Button className="w-full green-gradient">
                    Start a Session
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* START SUMMARY CARD */}
          <div className=" p-4 rounded-md bg-white shadow-md">
            <h3 className=" font-bold text-primary">{t("todaysSummary")}</h3>

            <div className=" flex justify-between px-4 pt-4 pb-2">
              <div className=" flex flex-col items-center">
                <p className=" font-bold text-black text-xl">
                  {loading ? "-" : inspectionToday.total}
                </p>
                <p className=" text-gray-300 text-md">{t("summaryToday")}</p>
              </div>
              <div className=" flex flex-col items-center">
                <p className=" font-bold text-black text-xl">
                  {loading ? "-" : inspectionThisWeek.total}
                </p>
                <p className=" text-gray-300 text-md">{t("summaryThisWeek")}</p>
              </div>
              <div className=" flex flex-col items-center">
                <p className=" font-bold text-black text-xl">
                  {loading ? "-" : inspection.total}
                </p>
                <p className=" text-gray-300 text-md">{t("summaryTotal")}</p>
              </div>
            </div>
          </div>
          {/* END SUMMARY CARD */}

          {/* START INSPECTION HISTORY CARD */}
          <div className=" p-4 rounded-md bg-white shadow-md">
            <h3 className="text-primary font-bold">
              {t("recentInspectionRecords")}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {t("recentInspectionHistory")}
            </p>

            {/* Map recent inspections */}
            <div className="h-full">
              {loading ? (
                <div className="mt-5 text-center text-gray-500">
                  {t("loadingInspections")}
                </div>
              ) : recentInspections.length > 0 ? (
                recentInspections.slice(0, 7).map((inspection, index) => (
                  <div key={inspection.id}>
                    <div className="my-5">
                      <div className="flex justify-between mb-2">
                        <h5 className="text-primary font-semibold mb-1">
                          {inspection.workID}
                        </h5>
                        <p className="text-xs text-gray-400 mt-2">
                          {inspection.type} · {inspection.date}
                        </p>
                      </div>
                      <div className=" flex gap-2 text-black justify-between h-[20px]">
                        <p className=" flex flex-row w-full justify-center items-center text-center font-bold text-sm mt-1">
                          <ClipboardList className="text-primary-300 mr-1 mt-[-3px]" />
                          {t("inspectorLabel")}:{" "}
                          <span className=" pl-1 font-normal">
                            {inspection.inspector}
                          </span>
                        </p>
                        <Separator
                          orientation="vertical"
                          className="border border-gray-300"
                        />
                        <p className=" flex flex-row w-full justify-center items-center text-center font-bold text-sm mt-1">
                          <AlarmClock className="text-primary-300 mr-1 mt-[-3px]" />
                          {t("timeLabel")}:{" "}
                          <span className="pl-1 font-normal">
                            {inspection.time}
                          </span>
                        </p>
                      </div>
                    </div>
                    {index < recentInspections.slice(0, 7).length - 1 && (
                      <Separator className="mt-3 border border-gray-300" />
                    )}
                  </div>
                ))
              ) : (
                <div className="mt-5 text-center text-gray-500">
                  {t("noRecentInspections")}
                </div>
              )}
            </div>
          </div>
          {/* END INSPECTION HISTORY CARD */}
        </div>
      </div>
    </>
  );
}
