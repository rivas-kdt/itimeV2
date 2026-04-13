"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { EllipsisVertical, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useWorkOrderHooks } from "@/features/workorders/hooks/useWorkOrderHooks";
import { useTranslations } from "next-intl";

export default function WorkOrdersPage() {
  return (
    <ProtectedRoute>
      <WorkOrdersContent />
    </ProtectedRoute>
  );
}

function WorkOrdersContent() {
  const t = useTranslations("workOrders");
  const { records, searchWorkOrder, setSearchWorkOrder, loading, error } =
    useWorkOrderHooks();

  return (
    <div className=" bg-white-gray h-full text-black flex flex-col">
      <div className=" pt-5 pb-4 px-8 space-y-2 w-full shadow-lg bg-white">
        <p className=" text-2xl font-bold text-black my-2">{t("title")}</p>
        <div className="flex gap-2">
          <div className="flex flex-row bg-white rounded-md px-2 py-1 w-full items-center border-2 border-gray-300">
            <Search className="mr-2 text-gray-500" />
            <input
              className=" w-full py-2 border-none m-0 outline-none focus:outline-none"
              placeholder={t("searchPlaceholder")}
              value={searchWorkOrder}
              onChange={(e) => setSearchWorkOrder(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className=" h-full w-full bg-white-gray pt-4 pb-8 px-8 overflow-y-auto space-y-4 test no-scrollbar">
        {loading ? (
          <div className="text-lg h-full flex justify-center items-center text-gray-500">
            {t("loadingWorkOrders")}
          </div>
        ) : error ? (
          <div className="text-lg h-full flex justify-center items-center text-red-500">
            {t("errorLabel")}: {error}
          </div>
        ) : records.length > 0 ? (
          records.map((orders, index) => (
            <div
              key={orders.id}
              className="active:bg-primary-op-2 active:rounded-md"
            >
              <div className=" flex px-1">
                <div className=" flex flex-col flex-1">
                  <div className="flex flex-row justify-between mb-2">
                    <p className=" text-2xl font-bold text-primary tracking-wide">
                      {orders?.workOrder}
                    </p>
                    <Popover>
                      <PopoverTrigger>
                        <EllipsisVertical className=" text-primary" />
                      </PopoverTrigger>
                      <PopoverContent
                        side="left"
                        align="start"
                        className="bg-white w-full text-black border-none full-shadow rounded-lg p-2"
                      >
                        {/* <Link href={`/work-orders/${orders.work_id}`}> */}
                        <Link
                          href={`/work-orders/edit?workOrderId=${orders.workOrderId}&workCodeId=${orders.workCodeId}&constructionItemId=${orders.constructionItemId}&othersId=${orders.othersId}`}
                        >
                          {/* <div className="active:bg-primary-op-2 active:text-primary px-2 py-1 rounded-md"> */}
                          <div className="active:bg-primary-op-2 active:text-primary px-5 rounded-md">
                            {t("edit")}
                          </div>
                        </Link>
                        {/* <Separator className="my-2 border border-gray-300" /> */}
                        {/* <Link href={`/timer/${orders.work_id}`}>
                          <div className="active:bg-primary-op-2 active:text-primary pl-2 pr-5 py-1 rounded-md">
                            Start Inspection
                          </div>
                        </Link> */}
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className=" flex justify-between items-center">
                    <div className=" text-xs text-gray-500 font-bold w-[130px]">
                      {t("constructionItemLabel")}:
                      <p className="text-gray-500 font-normal">
                        {orders.constructionItem}
                      </p>
                    </div>
                    <Separator
                      orientation="vertical"
                      className="border border-gray-300"
                    />
                    <div className=" text-xs text-gray-500 font-bold">
                      {t("workCodeLabel")}:
                      <p className="text-gray-500 font-normal">
                        {orders.workCode}
                      </p>
                    </div>
                    <Separator
                      orientation="vertical"
                      className="border border-gray-300"
                    />
                    <div className=" text-xs text-gray-500 font-bold w-[60px]">
                      {t("othersLabel")}:
                      <p className="text-gray-500 font-normal">
                        {orders.others}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {index < records.length - 1 && (
                <Separator className="mt-2 border border-gray-300" />
              )}
            </div>
          ))
        ) : (
          <div className="text-2xl h-full flex justify-center items-center">
            {t("noWorkOrdersFound")}
          </div>
        )}
      </div>
    </div>
  );
}
