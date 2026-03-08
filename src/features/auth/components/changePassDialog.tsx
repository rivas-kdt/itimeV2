/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onChangePass: () => void;
};

export function ChangePassDialog({ open, onOpenChange, onChangePass }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="box-design max-w-md text-black-text">
        <DialogHeader className="border-b-1 border-primary pb-2">
          <DialogTitle>Update Account Password</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col w-full gap-1">
            <label htmlFor="workCode" className="font-bold">
              Old Password
            </label>
            <Input
              id="oldPassword"
              placeholder="Enter Old Password"
              className="border-gray-300 text-sm"
            />
          </div>

          <div className="flex flex-col w-full gap-1">
            <label htmlFor="workCode" className="font-bold">
              New Password
            </label>
            <Input
              id="newPassword"
              placeholder="Enter New Password"
              className="border-gray-300 text-sm"
            />
          </div>

          <div className="flex flex-col w-full gap-1">
            <label htmlFor="workCode" className="font-bold">
              Confirm New Password
            </label>
            <Input
              id="confirmPassword"
              placeholder="Confirm Password"
              className="border-gray-300 text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button className="cancel-btn" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="gradient-bg text-white px-5 py-2"
            onClick={onChangePass}
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
