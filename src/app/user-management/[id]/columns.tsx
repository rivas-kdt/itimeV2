// src/app/user-management/[id]/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Dispatch, SetStateAction } from "react";
import type { InspectionRowDTO } from "@/features/user-management/types";

type TableT = (key: string) => string;

export const getColumns = (
  selectedIds: string[],
  setSelectedIds: Dispatch<SetStateAction<string[]>>,
  t: TableT
): ColumnDef<InspectionRowDTO>[] => [
  {
    id: "exportBox",
    cell: ({ row }) => {
      const rowId = row.original.id;
      const isChecked = selectedIds.includes(rowId);

      return (
        <Checkbox
          checked={isChecked}
          onCheckedChange={(checked) => {
            setSelectedIds((prev) =>
              checked ? [...prev, rowId] : prev.filter((id) => id !== rowId)
            );
          }}
          className="w-5 h-5 data-[state=checked]:bg-primary data-[state=checked]:border-none data-[state=checked]:text-white"
        />
      );
    },
    meta: {
      className: "text-center w-40",
    },
  },
  {
    accessorKey: "workOrder",
    header: t("workOrder"),
    meta: { className: "text-center" },
  },
  {
    accessorKey: "construction",
    header: t("constructionItems"),
    meta: { className: "text-center" },
  },
  {
    accessorKey: "workCode",
    header: t("workCode"),
    meta: { className: "text-center" },
  },
  {
    accessorKey: "others",
    header: t("others"),
    meta: { className: "text-center" },
  },
  {
    accessorKey: "date",
    header: t("date"),
    meta: { className: "text-center" },
  },
  {
    accessorKey: "duration",
    header: t("time"),
    meta: { className: "text-center" },
  },
  {
    accessorKey: "type",
    header: t("type"),
    meta: { className: "text-center" },
  },
  {
    accessorKey: "location",
    header: t("location"),
    meta: { className: "text-center" },
  },
];
