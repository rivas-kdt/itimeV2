"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { useIsMobile } from "@/hooks/useMobile";
import { useTranslations } from "next-intl";

export type TimeValue = {
  hour: number;
  minute: number;
};

type Props = {
  value: TimeValue;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (value: TimeValue) => void;
};

export function TimeStepper({ value, open, onOpenChange, onChange }: Props) {
  const isMobile = useIsMobile();
  const t = useTranslations("modals");
  const tCommon = useTranslations("common");
  const [time, setTime] = useState<TimeValue>(value);

  const addHours = (delta: number) => {
    let newHour = (time.hour + delta) % 24;
    if (newHour < 0) newHour += 24; // handle negative wrap
    setTime({ ...time, hour: newHour });
  };

  const addMinutes = (delta: number) => {
    let total = time.minute + delta;
    while (total < 0) total += 60;
    total = total % 60;
    setTime({ ...time, minute: total });
  };

  const handleUpdate = () => {
    onChange(time);
    onOpenChange(false);
  };

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="box-design">
          <DialogHeader className="border-b border-gray-300 pb-2">
            <DialogTitle className="flex text-black-text font-bold">
              {t("setNewTime")}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center gap-3 py-1 text-black-text rounded-md border border-primary">
            {t("newTimeLabel")} :{" "}
            <span>
              {String(time.hour).padStart(2, "0")} :{" "}
              {String(time.minute).padStart(2, "0")}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-black-text">
            <div className="flex justify-center text-md">{t("setHours")}</div>
            <div className="flex items-center">
              <button className="number-btns" onClick={() => addHours(-5)}>
                -5
              </button>

              <button className="number-btns " onClick={() => addHours(-1)}>
                <ChevronLeft strokeWidth={1} />
              </button>
              <div className="number-box">
                {String(time.hour).padStart(2, "0")}
              </div>
              <button className="number-btns " onClick={() => addHours(1)}>
                <ChevronRight strokeWidth={1} />
              </button>
              <button className="number-btns " onClick={() => addHours(5)}>
                +5
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 text-black-text">
            <div className="flex justify-center text-md">{t("setMinutes")}</div>
            <div className="flex items-center">
              <button className="number-btns" onClick={() => addMinutes(-5)}>
                -5
              </button>

              <button className="number-btns " onClick={() => addMinutes(-1)}>
                <ChevronLeft strokeWidth={1} />
              </button>
              <div className="number-box">
                {String(time.minute).padStart(2, "0")}
              </div>
              <button className="number-btns " onClick={() => addMinutes(1)}>
                <ChevronRight strokeWidth={1} />
              </button>
              <button className="number-btns " onClick={() => addMinutes(5)}>
                +5
              </button>
            </div>
          </div>
          {/* 時間帯 -> Time of Day*/}
          {/* <div className="flex items-center justify-between gap-3 text-black-text">
            <div className="flex justify-center text-md">Time of Day</div>
            <div className="flex items-center">
              <button
                className={clsx(
                  time.ampm === "AM" ? "number-btns" : "number-btns",
                )}
                onClick={() => setTime({ ...time, ampm: "AM" })}
              >
                AM
              </button>
              <button
                className={clsx(
                  time.ampm === "PM" ? "number-btns" : "number-btns",
                )}
                onClick={() => setTime({ ...time, ampm: "PM" })}
              >
                PM
              </button>
            </div>
          </div> */}
          <DialogFooter>
            <Button className="gradient-bg" onClick={handleUpdate}>
              {t("saveTime")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-auto box-design">
        <DialogHeader className="border-b-1 border-primary pb-2">
          <DialogTitle className="text-2xl text-black-text">
            {t("updateTheTime")}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 italic">
            {t("clickToChangeTime")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            {/* Hours */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-center text-xl">{t("hours")}</div>
              <div className="flex items-center text-black-text">
                <button className="number-btns" onClick={() => addHours(-5)}>
                  -5
                </button>

                <button className="number-btns " onClick={() => addHours(-1)}>
                  <ChevronLeft strokeWidth={1} />
                </button>
                <div className="number-box">
                  {String(time.hour).padStart(2, "0")}
                </div>
                <button className="number-btns " onClick={() => addHours(1)}>
                  <ChevronRight strokeWidth={1} />
                </button>
                <button className="number-btns " onClick={() => addHours(5)}>
                  +5
                </button>
              </div>
            </div>

            <div className="text-2xl font-bold text-black mt-9">:</div>

            {/* Minutes */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-center text-xl">{t("minutes")}</div>
              <div className="flex items-center text-black-text">
                <button className="number-btns " onClick={() => addMinutes(-5)}>
                  -5
                </button>
                <button className="number-btns " onClick={() => addMinutes(-1)}>
                  <ChevronLeft strokeWidth={1} />
                </button>
                <div className="number-box">
                  {String(time.minute).padStart(2, "0")}
                </div>
                <button className="number-btns " onClick={() => addMinutes(1)}>
                  <ChevronRight strokeWidth={1} />
                </button>
                <button className="number-btns " onClick={() => addMinutes(5)}>
                  +5
                </button>
              </div>
            </div>

            {/* AM/PM */}
            {/* <div className="flex flex-col gap-3">
              <div className="h-[28]"> </div>
              <div className="flex items-center gap-1 ml-4 ">
                <Button
                  variant="outline"
                  className={clsx(
                    time.ampm === "AM"
                      ? "text-xl py-[21px] bg-gray-300 text-white border-black cursor-pointer"
                      : "text-xl py-[21px] bg-white text-black-text cursor-pointer"
                  )}
                  onClick={() => setAMPM("AM")}
                >
                  AM
                </Button>
                <Button
                  variant="outline"
                  className={clsx(
                    time.ampm === "PM"
                      ? "text-xl py-[21px] bg-gray-300 text-white border-black cursor-pointer"
                      : "text-xl py-[21px] bg-white text-black-text cursor-pointer"
                  )}
                  onClick={() => setAMPM("PM")}
                >
                  PM
                </Button>
              </div>
            </div> */}
          </div>

          <DialogFooter className="flex justify-end gap-2 mt-5">
            <button
              className="bg-gray-100 text-black-text px-5 py-2 rounded-md cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              {tCommon("cancel")}
            </button>
            <button
              className="gradient-bg text-white px-5 py-2 rounded-md cursor-pointer"
              onClick={handleUpdate}
            >
              {t("update")}
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
