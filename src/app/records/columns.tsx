"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Dispatch, SetStateAction } from "react";

export type Inspections = {
  id: string;
  workOrder: string;
  date: string;
  duration: string; // HH:MM or similar
  start_time: string;
  end_time: string;
  type: "Inspection" | "Receiving";
  location: "Warehouse A" | "Warehouse B";
  construction: string;
  workCode: number;
  others: number;
};

interface RowActions {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
export const getColumns = (
  selectedIds: string[],
  setSelectedIds: Dispatch<SetStateAction<string[]>>,
  actions: RowActions
): ColumnDef<Inspections>[] => [
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
    accessorKey: "duration",
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
  {
    id: "actions",
    cell: ({ row }) => {
      const inspect = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white border-none shadow-[0_10px_30px_var(--gray_300)] text-black-text m-0 p-0"
          >
            <DropdownMenuItem
              className="hover:bg-gray-100 hover:text-black-text px-4 py-3 rounded-none"
              onClick={() => actions.onEdit(inspect.id)}
            >
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-300 m-0 p-0" />
            <DropdownMenuItem
              className="hover:bg-gray-100 hover:text-black-text px-4 py-3 rounded-none"
              onClick={() => actions.onDelete(inspect.id)}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    meta: { className: "text-center" },
  },
];
