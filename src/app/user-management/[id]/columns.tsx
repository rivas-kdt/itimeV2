// src/app/user-management/[id]/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Dispatch, SetStateAction } from "react";
import type { InspectionRowDTO } from "@/features/user-management/types";

export const getColumns = (
  selectedIds: string[],
  setSelectedIds: Dispatch<SetStateAction<string[]>>
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
    header: "Work Order",
    meta: { className: "text-center" },
  },
  {
    accessorKey: "construction",
    header: "Construction",
    meta: { className: "text-center" },
  },
  {
    accessorKey: "workCode",
    header: "Work Code",
    meta: { className: "text-center" },
  },
  {
    accessorKey: "others",
    header: "Others",
    meta: { className: "text-center" },
  },
  {
    accessorKey: "date",
    header: "Date",
    meta: { className: "text-center" },
  },
  {
    accessorKey: "time",
    header: "Time",
    meta: { className: "text-center" },
  },
  {
    accessorKey: "type",
    header: "Type",
    meta: { className: "text-center" },
  },
  {
    accessorKey: "location",
    header: "Location",
    meta: { className: "text-center" },
  },
];
