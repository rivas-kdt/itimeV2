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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/useMobile";
import { useTranslations } from "next-intl";
import { useAuth } from "@/features/auth/hooks/auth-context";

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
  const t = useTranslations("dashboard");
  const { session } = useAuth();
  const {
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
    selectedMonth,
    setSelectedMonth,
  } = useDesktopDashboardHooks(session?.user?.role === "Admin" ? false : true);

  const inspectionData = monthChart;
  const workCodeData = workCodeChart;
  const recentRows = recentInspections;

  const isMobile = useIsMobile();

  return (
    <div className="flex flex-row gap-8 p-4">
      {/* Desktop View of Dashboard */}
      <div className="flex flex-col box-design w-full p-8 gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-black-text font-bold">
            {t("recentInspectionRecords")}
          </h2>
        </div>
        <div className="h-full">
          <div className="grid grid-cols-7 bg-primary-white h-12 text-primary-dark text-lg items-center font-bold">
            <p className="col-span-3 pl-3">{t("inspectorName")}</p>
            <p className="col-span-2">{t("date")}</p>
            <p className="col-span-2">{t("duration")}</p>
          </div>
          <div className="overflow-scroll h-[calc(100vh-300px)]">
            {loading ? (
              <p className="flex justify-center items-center h-full w-full text-xl text-gray-500">
                {t("loading")}
              </p>
            ) : error ? (
              <p className="flex justify-center items-center h-full w-full text-xl text-gray-500">
                {error}
              </p>
            ) : recentRows && recentRows.length > 0 ? (
              recentRows.map((inspections) => (
                <div key={inspections.id}>
                  <div className="grid grid-cols-7 px-3 gap-2 text-sm text-black-text border-b border-gray-100 py-5">
                    <p className="col-span-3">{inspections.inspector}</p>
                    <p className="col-span-2">{inspections.date}</p>
                    <p className="col-span-2">{inspections.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-sm text-gray-500">
                {t("noRecentInspections")}
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
                {t("totalInspectionsToday")}
              </p>
              <p className="flex justify-end text-lg 2xl:text-3xl font-bold">
                {t("inspectionsCount", { count: inspectionToday.total })}
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
                {t("totalInspectionsThisYear")}
              </p>
              <p className="flex justify-end text-lg 2xl:text-3xl font-bold">
                {t("inspectionsCount", { count: inspectionThisYear.total })}
              </p>
            </div>
          </div>
        </div>

        <div className="box-design w-full p-5">
          <div className="flex justify-end w-full mb-1">
            <Select
              value={selectedMonth ? selectedMonth.toString() : ""}
              onValueChange={(value) =>
                setSelectedMonth(value ? parseInt(value) : undefined)
              }
            >
              <SelectTrigger className="border border-gray-300 rounded-md text-black-text px-2 py-3">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent className="h-50 bg-white text-black border-gray-300">
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
                ].map((m, idx) => (
                  <SelectItem
                    key={m}
                    value={(idx + 1).toString()}
                    className="selection-hover"
                  >
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ChartContainer
            config={inspectionConfig}
            className="h-51.25 2xl:h-67.5 w-full ml-[-15]"
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
                      className="text-black-text font-bold 2xl:text-lg transform -rotate-90 -translate-x-47.5 translate-y-33.75 2xl:-translate-x-65 2xl:translate-y-46.25"
                    >
                      {t("numberOfInspections")}
                    </text>
                  );
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    // hideLabel
                    className="box-design w-50 text-sm text-black-text"
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
            {t("inspectionsThisMonth")}
          </h3>
        </div>

        {/* Bar Graph */}
        <div className="box-design w-full p-5">
          <ChartContainer
            config={workCodeConfig}
            className="h-51.25 2xl:h-67.5 w-full ml-[-15]"
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
                      className="text-black-text font-bold 2xl:text-lg transform -rotate-90 -translate-x-47.5 translate-y-33.75 2xl:-translate-x-65 2xl:translate-y-46.25"
                    >
                      {t("numberOfInspections")}
                    </text>
                  );
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    // hideLabel
                    className="box-design w-50 text-sm text-black-text"
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
            {t("inspectionsPerWorkCode")}
          </h3>
        </div>
      </div>
    </div>
  );
}
