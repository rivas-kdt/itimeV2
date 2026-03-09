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

export default function MobileDashboard() {
  const {
    inspectionToday,
    inspectionThisWeek,
    inspection,
    recentInspections,
    loading,
    error,
  } = useMobileDashboardHooks();
  const { session } = useAuth();

  const activeSession = true;
  const userName = session?.user?.firstName || "Inspector";

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (error) {
    return (
      <div className="text-black flex flex-col items-center justify-center">
        <CloudAlert className="text-red-500" size={150} />
        <p className="text-red-500 font-bold text-3xl">
          Error loading dashboard
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
          <p className=" text-md text-black/75">
            Here&apos;s your progress today.
          </p>
        </div>
        <div className=" h-full p-4 overflow-y-auto translate-y-22 space-y-4 no-scrollbar">
          {/* START SUMMARY CARD */}
          <div className=" p-4 rounded-md bg-white shadow-md">
            <h3 className=" font-bold text-primary">Today&apos;s Summary</h3>

            <div className=" flex justify-between px-4 pt-4 pb-2">
              <div className=" flex flex-col items-center">
                <p className=" font-bold text-black text-xl">
                  {loading ? "-" : inspectionToday.total}
                </p>
                <p className=" text-gray-300 text-md">Today</p>
              </div>
              <div className=" flex flex-col items-center">
                <p className=" font-bold text-black text-xl">
                  {loading ? "-" : inspectionThisWeek.total}
                </p>
                <p className=" text-gray-300 text-md">This Week</p>
              </div>
              <div className=" flex flex-col items-center">
                <p className=" font-bold text-black text-xl">
                  {loading ? "-" : inspection.total}
                </p>
                <p className=" text-gray-300 text-md">Total</p>
              </div>
            </div>
          </div>
          {/* END SUMMARY CARD */}

          {/* START INSPECTION HISTORY CARD */}
          <div className=" p-4 rounded-md bg-white shadow-md">
            <h3 className="text-primary font-bold">Recent Inspections</h3>
            <p className="text-sm text-gray-500 mt-1">
              Your recent inspection history.
            </p>

            {/* Map recent inspections */}
            <div className="h-full">
              {loading ? (
                <div className="mt-5 text-center text-gray-500">
                  Loading inspections...
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
                          Inspector:{" "}
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
                          Time:{" "}
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
                  No recent inspections
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
