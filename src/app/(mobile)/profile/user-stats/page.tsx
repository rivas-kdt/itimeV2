"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserProfile } from "@/features/profile/hooks/useUserProfileHooks";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

const chartData = [
  { day: "Monday", inspections: 120 },
  { day: "Tuesday", inspections: 148 },
  { day: "Wednesday", inspections: 203 },
  { day: "Thursday", inspections: 222 },
  { day: "Friday", inspections: 164 },
];

const chartConfig = {
  inspections: {
    label: "Time",
    color: "#ffb347",
  },
} satisfies ChartConfig;

export default function UserStatsPage() {
  const { profile, loading } = useUserProfile();

  return (
    <div className=" bg-white-gray h-full w-screen overflow-y-scroll text-black px-5 flex flex-col gap-4">
      {!loading && profile && (
        <h4 className="text-lg font-semibold">
          Statistics for {profile.first_name}
        </h4>
      )}
      <span className="italic">
        Here&apos;s the weekly log of your inspection durations.
      </span>
      <div className="flex flex-col gap-4 bg-white rounded-md p-4 full-shadow">
        <div className="flex flex-col text-black gap-2">
          <label className="text-sm">
            Average Daily Inspection Time{" "}
            <span className="italic text-gray-300">(Aug 11 - Aug 15 2025)</span>
          </label>{" "}
          {/*automatic date here for the week*/}
          <h2 className="font-bold">3 h 15 mins</h2>
          <Separator className="border border-primary mb-2" />
          <ChartContainer
            config={chartConfig}
            className="min-h-[250px] w-full ml-[-25]"
          >
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={"day"}
                tickLine={false}
                tickMargin={10}
                // axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                domain={[0, 240]}
                label={{
                  value: "Minutes",
                  angle: -90,
                  offset: 20,
                  position: "insideLeft",
                  style: { fill: "#ff6801", fontWeight: "bold" },
                }} //change to hours after calc
              />
              <ChartTooltip
                content={(props) => {
                  if (!props.active || !props.payload?.length) {
                    return null;
                  }
                  const modifiedPayload = props.payload.map((item) => {
                    //changes the value to actual time duration instead of just minutes - this should be calc before sending as chartData to change YAxis
                    const toHours = Math.trunc(item.value / 60);
                    const toMins = Math.trunc(
                      parseFloat(
                        "0." +
                          (item.value / 60).toFixed(2).toString().split(".")[1]
                      ) * 60
                    );

                    return {
                      ...item,
                      value:
                        typeof item.value === "number"
                          ? `${toHours}h ${toMins}mins`
                          : item.value,
                    };
                  });

                  return (
                    <ChartTooltipContent
                      active={props.active}
                      payload={modifiedPayload}
                      label={props.label}
                    />
                  );
                }}
              />
              <Bar
                dataKey="inspections"
                fill="var(--color-inspections)"
                radius={5}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      <div className="flex flex-row justify-between gap-3">
        <div className="flex flex-col gap-2 bg-white rounded-md full-shadow p-3 w-full">
          <Tabs defaultValue="time" className="w-full">
            <TabsList className="bg-pale-brown mb-3 flex justify-between w-full h-full">
              <TabsTrigger
                value="time"
                className="text-lg text-center wrap-anywhere"
              >
                Total Inspection Time
              </TabsTrigger>
              <TabsTrigger
                value="record"
                className="text-lg text-center wrap-anywhere"
              >
                Total Inspections Recorded
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="time"
              className="flex flex-row justify-between mb-3"
            >
              <div className="w-full flex flex-col justify-center items-center">
                <label className="font-bold mb-2">Today</label>
                <h2 className="font-extrabold text-gray-500"> 3h 35mins</h2>
              </div>
              <Separator
                orientation="vertical"
                className="border border-primary"
              />
              <div className="w-full flex flex-col justify-center items-center">
                <label className="font-bold mb-2">All Time</label>
                <h2 className="font-extrabold text-gray-500"> 45h 28mins</h2>
              </div>
            </TabsContent>

            <TabsContent
              value="record"
              className="flex flex-row justify-between mb-3"
            >
              <div className="w-full flex flex-col justify-center items-center">
                <label className="font-bold mb-2">Today</label>
                <h2 className="font-extrabold text-gray-500"> 5 records</h2>
              </div>
              <Separator
                orientation="vertical"
                className="border border-primary"
              />
              <div className="w-full flex flex-col justify-center items-center">
                <label className="font-bold mb-2">All Time</label>
                <h2 className="font-extrabold text-gray-500"> 19 records</h2>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
