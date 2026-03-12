/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CircleMinus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  rows: any[];
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;

  onRemove: (id: string) => void;
  onExport: () => void;
};

export function ExportPreviewDialog({
  open,
  onOpenChange,
  rows,
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onRemove,
  onExport,
}: Props) {
  const t = useTranslations("exportPreview");
  const tModals = useTranslations("modals");
  const hasRecords = rows.length > 0;
  console.log("rows: ", rows);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="box-design">
        <AlertDialogHeader className="text-black">
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription className="my-3">
            {t("description")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="bg-primary-white text-md text-primary-dark">
                <TableHead className="text-primary-dark text-center w-1/4">
                  {t("workId")}
                </TableHead>
                <TableHead className="text-primary-dark text-center w-1/4">
                  {t("date")}
                </TableHead>
                <TableHead className="text-primary-dark text-center w-1/4">
                  {t("time")}
                </TableHead>
                <TableHead className="w-1/9"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hasRecords ? (
                rows.map((r) => (
                  <TableRow className="text-sm text-black-text m-0" key={r.id}>
                    <TableCell className="text-center">{r.workOrder}</TableCell>
                    <TableCell className="text-center">{r.date}</TableCell>
                    <TableCell className="text-center">{r.duration}</TableCell>
                    <TableCell className="flex justify-center items-center text-center">
                      <CircleMinus
                        className="text-black-text cursor-pointer"
                        size={20}
                        strokeWidth={1}
                        fill="#ffe8d8"
                        onClick={() => onRemove(r.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-3 text-lg font-bold text-black-text"
                  >
                    {t("noEntriesFound")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {hasRecords && (
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onPrev}
                disabled={currentPage === 1}
                className="bg-white border-1 border-gray-300 text-black-text"
              >
                <ChevronLeft />
              </Button>

              <span className="text-black-text">
                {t("pageOf", { current: currentPage, total: totalPages })}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={onNext}
                disabled={currentPage === totalPages}
                className="bg-white border-1 border-gray-300 text-black-text"
              >
                <ChevronRight />
              </Button>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="cancel-btn">{tModals("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            disabled={!hasRecords}
            className={`gradient-bg ${
              !hasRecords
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : ""
            }`}
            onClick={onExport}
          >
            {t("exportFile")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
