/* eslint-disable @typescript-eslint/no-explicit-any */
import { CalendarSearch, PackageSearch } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { useDesktopDashboardHooks } from "../hooks/useDesktopDashboardHooks";

const inspectionConfig = {
  month_inspections: {
    label: "Inspections",
    color: "#ffb347",
  },
} satisfies ChartConfig;

const workCodeConfig = {
  workcode: {
    label: "Inspections",
    color: "#ffb347",
  },
} satisfies ChartConfig;

export default function DesktopDashboard() {
  const {
    inspection,
    inspectionToday,
    inspectionThisWeek,
    inspectionThisMonth,
    inspectionThisYear,
    monthChart,
    weekChart,
    workCodeChart,
    recentInspections,
    loading,
    error,
  } = useDesktopDashboardHooks();

  const inspectionData = monthChart;
  const workCodeData = workCodeChart;
  const recentRows = recentInspections;

  return (
    <div className="flex flex-row gap-8 p-4">
      {/* Desktop View of Dashboard */}
      <div className="flex flex-col box-design w-full p-8 gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-black-text font-bold">
            Recent Inspection Records
          </h2>
        </div>
        <div className="h-full">
          <div className="grid grid-cols-10 bg-primary-white h-12 text-primary-dark text-lg items-center font-bold">
            <p className="col-span-3 pl-3">Inspector Name</p>
            <p className="col-span-2">Date</p>
            <p className="col-span-2">Duration</p>
            <p className="col-span-1">Type</p>
          </div>
          <div className="overflow-scroll h-[calc(100vh-300px)]">
            {loading ? (
              <p className="flex justify-center items-center h-full w-full text-xl text-gray-500">
                Loading…
              </p>
            ) : error ? (
              <p className="flex justify-center items-center h-full w-full text-xl text-gray-500">
                {error}
              </p>
            ) : recentRows && recentRows.length > 0 ? (
              recentRows.map((inspections) => (
                <div key={inspections.id}>
                  <div className="grid grid-cols-10 px-3 gap-2 text-sm text-black-text border-b border-gray-100 py-5">
                    <p className="col-span-3">{inspections.inspector}</p>
                    <p className="col-span-2">{inspections.date}</p>
                    <p className="col-span-2">{inspections.time}</p>
                    <p className="col-span-1">{inspections.type}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-sm text-gray-500">
                No Recent Inspections
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full gap-5 2xl:gap-6">
        {/* Summary Part */}
        <div className="flex flex-row gap-8">
          <div className="flex flex-row box-design w-full h-fit p-5 gap-3">
            <div className="flex items-center bg-pale-brown rounded-xl">
              <PackageSearch
                strokeWidth={1.5}
                className="text-primary-300 mx-2 w-12 h-12 2xl:w-24 2xl:h-24"
              />
            </div>
            <div className="flex flex-col gap-3 px-1 pt-3 w-full">
              <p className="font-bold text-black-text text-md 2xl:text-xl">
                Total Inspections Today
              </p>
              <p className="flex justify-end text-lg 2xl:text-3xl font-bold">
                {inspectionToday.total} Inspections
              </p>
            </div>
          </div>
          <div className="flex flex-row box-design w-full h-fit p-5 gap-3">
            <div className="flex items-center bg-pale-brown rounded-xl">
              <CalendarSearch
                strokeWidth={1.5}
                className="text-primary-300 mx-2 w-12 h-12 2xl:w-24 2xl:h-24"
              />
            </div>
            <div className="flex flex-col gap-3 px-1 pt-3 w-full">
              <p className="font-bold text-black-text text-md 2xl:text-xl">
                Total Inspections this Month
              </p>
              <p className="flex justify-end text-lg 2xl:text-3xl font-bold">
                {inspectionThisMonth.total} Inspections
              </p>
            </div>
          </div>
        </div>
        <div className="box-design w-full p-5">
          <ChartContainer
            config={inspectionConfig}
            className="h-[205px] 2xl:h-[270px] w-full ml-[-15]"
          >
            <LineChart accessibilityLayer data={inspectionData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={"day"}
                tickLine={false}
                tickMargin={10}
                tick={{ style: { fontWeight: "Bold" } }}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                domain={[0, 60]}
                tick={{ style: { fontWeight: "Bold" } }}
                label={({
                  viewBox,
                }: {
                  viewBox: { x: number; y: number; height: number };
                }) => {
                  const { x, y, height } = viewBox;
                  return (
                    <text
                      x={x + 45}
                      y={y + height + 55}
                      textAnchor="middle"
                      className="text-black-text font-bold 2xl:text-lg transform -rotate-90 translate-x-[-190px] translate-y-[135px] 2xl:translate-x-[-260px] 2xl:translate-y-[185px]"
                    >
                      Number of Inspections
                    </text>
                  );
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    // hideLabel
                    className="box-design w-[200px] text-sm text-black-text"
                  />
                }
              />
              <Line
                dataKey={`Inspections: `}
                type="natural"
                stroke="var(--color-month_inspections)"
                strokeWidth={2}
                dot={{ fill: "var(--color-month_inspections)" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
          <h3 className="w-full text-center text-black font-bold">
            INSPECTIONS THIS MONTH
          </h3>
        </div>

        {/* Bar Graph */}
        <div className="box-design w-full p-5">
          <ChartContainer
            config={workCodeConfig}
            className="h-[205px] 2xl:h-[270px] w-full ml-[-15]"
          >
            <BarChart accessibilityLayer data={workCodeData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={"workCode"}
                tickLine={false}
                tickMargin={10}
                tick={{ style: { fontWeight: "Bold" } }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ style: { fontWeight: "Bold" } }}
                label={({
                  viewBox,
                }: {
                  viewBox: { x: number; y: number; height: number };
                }) => {
                  const { x, y, height } = viewBox;
                  return (
                    <text
                      x={x + 45}
                      y={y + height + 55}
                      textAnchor="middle"
                      className="text-black-text font-bold 2xl:text-lg transform -rotate-90 translate-x-[-190px] translate-y-[135px] 2xl:translate-x-[-260px] 2xl:translate-y-[185px]"
                    >
                      Number of Inspections
                    </text>
                  );
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    // hideLabel
                    className="box-design w-[200px] text-sm text-black-text"
                  />
                }
              />
              <Bar
                dataKey={`Inspections: `}
                fill="var(--color-workcode)"
                radius={3}
              />
            </BarChart>
          </ChartContainer>
          <h3 className="w-full text-center text-black font-bold">
            INSPECTIONS PER WORK CODE
          </h3>
        </div>
      </div>
    </div>
  );
}
