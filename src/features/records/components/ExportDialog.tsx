"use client";

import { ImportSection } from "./fileupload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileSpreadsheet } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onExportAll: () => void;
  onExportMonth: () => void;
  onExportSelected: () => void;
};

export function ExportDialog({
  open,
  onOpenChange,
  onExportAll,
  onExportMonth,
  onExportSelected,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="box-design max-w-6xl focus:outline-none">
        <DialogHeader className="flex flex-col justify-between pb-2 border-b-1 border-primary">
          <DialogTitle className="flex items-center gap-2 text-black-text">
            <FileSpreadsheet className="w-7 h-7" />
            {/* Import &  */}
            Export Data
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Select which type of Data to be exported
            {/* or upload a file to be imported to the table. */}
          </DialogDescription>
        </DialogHeader>
        {/* <ImportSection
          showModal={open}
          onImportSuccess={() => onOpenChange(false)}
        /> */}

        <div className="flex flex-row gap-5 justify-between max-h-[300px]">
          <DialogHeader className="flex flex-col gap-5 border-1 border-gray-500 w-[350px] p-6 rounded-lg">
            <DialogTitle className="font-bold">Export All Data</DialogTitle>
            <DialogDescription className="text-black-text">
              This collects all of the table inside the table and exports it as
              an Excel File.
            </DialogDescription>

            <button
              className="gradient-bg rounded-md text-white px-5 py-2 w-full text-nowrap mt-auto cursor-pointer"
              onClick={onExportAll}
            >
              Export All Data
            </button>
          </DialogHeader>

          <DialogHeader className="flex flex-col gap-5 border-1 border-gray-500 w-[350px] p-6 rounded-lg">
            <DialogTitle className="font-bold">
              Export Data of a Month
            </DialogTitle>
            <DialogDescription className="text-black-text mb-10">
              This collects all of the data from the selected month only.
            </DialogDescription>

            <div className="flex flex-row justify-between gap-2 mt-auto">
              <Select>
                <SelectTrigger className="border-1 border-gray-300 rounded-md text-black-text px-3 py-5 w-full">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent className="h-[200px] bg-white text-black border-gray-300">
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
                  ].map((m) => (
                    <SelectItem key={m} value={m} className="selection-hover">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <button
                className="gradient-bg rounded-md text-white px-5 py-2 w-full text-nowrap cursor-pointer"
                onClick={onExportMonth}
              >
                Export this Month
              </button>
            </div>
          </DialogHeader>

          <DialogHeader className="flex flex-col gap-5 border-1 border-gray-500 w-[350px] p-6 rounded-lg">
            <DialogTitle className="font-bold">Export Checked Data</DialogTitle>
            <DialogDescription className="text-black-text">
              This exports only the checked records in the table.
            </DialogDescription>

            <button
              className="gradient-bg rounded-md text-white px-5 py-2 w-full text-nowrap mt-auto cursor-pointer"
              onClick={onExportSelected}
            >
              Export Selected Data
            </button>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
}
