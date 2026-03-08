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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getLocation } from "../services/records.service";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  selectedUser: any;
  setSelectedUser: (v: any) => void;

  startTime: string;
  setStartTime: (v: string) => void;
  endTime: string;
  setEndTime: (v: string) => void;

  onSave: () => void;
};

type Location = {
  id: string;
  location: string;
};

export function EditDialog({
  open,
  onOpenChange,
  selectedUser,
  setSelectedUser,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  onSave,
}: Props) {
  
  const [loc, setLoc] = useState<Location[]>([]);
    useEffect(() => {
      const fetchLocations = async () => {
        const res = await getLocation();
        setLoc(res.locations);
      };
      fetchLocations();
    }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="box-design max-w-md w-fit text-black-text">
        <DialogHeader className="border-b-1 border-primary pb-2">
          <DialogTitle>Update Record Information</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col w-full gap-1">
            <label htmlFor="workOrder" className="font-bold">
              Work Order
            </label>
            <Input
              id="workOrder"
              className="border-gray-700 text-sm bg-gray-100"
              value={selectedUser?.workOrder ?? ""}
              disabled
            />
          </div>

          <div className="flex flex-row gap-3">
            <div className="flex flex-col w-full gap-1">
              <label htmlFor="date" className="font-bold">
                Date
              </label>
              <Input
                id="date"
                type="date"
                className="border-gray-300 text-sm"
                value={selectedUser?.date ?? ""}
                onChange={(e) =>
                  setSelectedUser((prev: any) =>
                    prev ? { ...prev, date: e.target.value } : prev
                  )
                }
              />
            </div>

            <div className="flex flex-col w-full gap-1">
              <label htmlFor="startTime" className="font-bold">
                Start Time
              </label>
              <Input
                id="startTime"
                type="datetime-local"
                className="border-gray-300 text-sm"
                value={startTime ?? ""}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row gap-3">
            <div className="flex flex-col w-full gap-1">
              <label htmlFor="endTime" className="font-bold">
                End Time
              </label>
              <Input
                id="endTime"
                type="datetime-local"
                className="border-gray-300 text-sm"
                value={endTime ?? ""}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div className="flex flex-col w-full gap-1">
              <label htmlFor="type" className="font-bold">
                Type
              </label>
              <Select
                value={selectedUser?.type ?? ""}
                onValueChange={(value: "Inspection" | "Receiving") =>
                  setSelectedUser((prev: any) =>
                    prev ? { ...prev, type: value } : prev
                  )
                }
              >
                <SelectTrigger className="border-1 border-gray-300 rounded-md text-black-text px-3 py-5 w-full data-[state=open]:ring-2 data-[state=open]:ring-primary data-[state=open]:border-transparent">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black-text border-gray-300">
                  <SelectItem value="Inspection" className="selection-hover">
                    Inspection
                  </SelectItem>
                  <SelectItem value="Receiving" className="selection-hover">
                    Receiving
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col w-full gap-1">
            <label htmlFor="location" className="font-bold">
              Location
            </label>
            <Select
              value={selectedUser?.location ?? ""}
              onValueChange={(value: "Warehouse A" | "Warehouse B") =>
                setSelectedUser((prev: any) =>
                  prev ? { ...prev, location: value } : prev
                )
              }
            >
              <SelectTrigger className="border-1 border-gray-300 rounded-md text-black-text px-3 py-5 w-full data-[state=open]:ring-2 data-[state=open]:ring-primary data-[state=open]:border-transparent">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black-text border-gray-300">
              {loc.map((location: Location) => (
                <SelectItem key={location.id} value={location.location} className="selection-hover">
                  {location.location}
                </SelectItem>
              ))}
              </SelectContent>
              {/* <SelectContent className="bg-white text-black-text border-gray-300">
                <SelectItem value="Warehouse A" className="selection-hover">
                  Warehouse A
                </SelectItem>
                <SelectItem value="Warehouse B" className="selection-hover">
                  Warehouse B
                </SelectItem>
              </SelectContent> */}
            </Select>
          </div>
        </div>

        {/* show duration calculation if both start and end are set */}
        {startTime && endTime && (
          <div className="mt-4 text-sm">
            <strong>Duration:</strong> {(() => {
              const s = new Date(startTime).getTime();
              const e = new Date(endTime).getTime();
              if (!isNaN(s) && !isNaN(e) && e >= s) {
                const diff = e - s;
                const h = Math.floor(diff / 3600000);
                const m = Math.floor((diff % 3600000) / 60000);
                return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`;
              }
              return "";
            })()}
          </div>
        )}

        <DialogFooter>
          <Button className="cancel-btn" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="gradient-bg text-white px-5 py-2" onClick={onSave}>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
