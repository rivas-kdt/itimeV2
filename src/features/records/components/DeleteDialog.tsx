/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useTranslations } from "next-intl";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selectedUser: any;
  onConfirmDelete: () => void;
};

export function DeleteDialog({
  open,
  onOpenChange,
  selectedUser,
  onConfirmDelete,
}: Props) {
  const t = useTranslations("modals");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="box-design max-w-3xl w-fit text-black-text">
        <DialogHeader className="pb-2 border-b-1 border-primary">
          <DialogTitle>{t("deleteRecord")}</DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-md">
          {t("deleteConfirm")}{" "}
          <span className="text-primary">{selectedUser?.workOrder}</span>?
        </DialogDescription>

        <div className="text-md">
          <span className="text-primary">{selectedUser?.workOrder}</span>{" "}
          {t("containsDetails")}
          <Table className="mt-5">
            <TableBody>
              {[
                [t("workCode"), selectedUser?.workCode],
                [t("construction"), selectedUser?.construction],
                [t("others"), selectedUser?.others],
                [t("date"), selectedUser?.date],
                [t("duration"), selectedUser?.duration],
                [t("type"), selectedUser?.type],
                [t("location"), selectedUser?.location],
              ].map(([label, value]) => (
                <TableRow key={String(label)}>
                  <TableCell className="border border-gray-300 bg-primary-white text-md text-primary-dark text-center">
                    {label as any}
                  </TableCell>
                  <TableCell className="border border-gray-300 text-center">
                    {value as any}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="mt-5">
          <Button className="cancel-btn" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button
            className="bg-red rounded-md text-white px-5 py-2 cursor-pointer hover:bg-red-700"
            onClick={onConfirmDelete}
          >
            {t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
