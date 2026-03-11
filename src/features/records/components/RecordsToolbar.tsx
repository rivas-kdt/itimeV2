"use client";

import {
  Eraser,
  FileDown,
  ListFilter,
  Package2,
  SearchCheck,
  SearchIcon,
  Warehouse,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { useEffect, useState } from "react";
import { getLocation } from "../services/records.service";

type Props = {
  searchRecord: string;
  setSearchRecord: (v: string) => void;

  typeFilter: string[];
  setTypeFilter: (v: string[]) => void;

  locationFilter: string[];
  setLocationFilter: (v: string[]) => void;

  onOpenExport: () => void;
  onClear: () => void;
};

type Location = {
  id: string;
  location: string;
};

function toggle(arr: string[], value: string, checked: boolean) {
  if (checked) return arr.includes(value) ? arr : [...arr, value];
  return arr.filter((x) => x !== value);
}

export function RecordsToolbar({
  searchRecord,
  setSearchRecord,
  typeFilter,
  setTypeFilter,
  locationFilter,
  setLocationFilter,
  onOpenExport,
  onClear,
}: Props) {
  // const loc = ["Warehouse A", "Site B", "Warehouse C"];
  const [loc, setLoc] = useState<Location[]>([]);
  console.log(loc);
  useEffect(() => {
    const fetchLocations = async () => {
      const res = await getLocation();
      setLoc(res.locations);
    };
    fetchLocations();
  }, []);

  return (
    <div className="flex flex-row gap-3">
      <div className="w-full h-full">
        <ButtonGroup className="w-full">
          <ButtonGroupText
            asChild
            className="h-9 w-[40px] border border-primary p-2"
          >
            <SearchIcon
              size={10}
              strokeWidth={2}
              className="bg-primary-op-2 text-primary"
            />
          </ButtonGroupText>
          <InputGroup className=" border border-primary p-0 m-0 focus:outline-none">
            <InputGroupInput
              placeholder="Search..."
              className="text-gray-500 text-lg placeholder:text-lg mt-1"
              value={searchRecord}
              onChange={(e) => setSearchRecord(e.target.value)}
            />
          </InputGroup>
        </ButtonGroup>
      </div>

      <div className="flex flex-row justify-between gap-3 h-[30px]">
        {/* <Popover>
          <PopoverTrigger className="btn-css gradient-bg">
            Filter by Type
            <ListFilter />
          </PopoverTrigger>

          <PopoverContent
            align="center"
            className="popover-design w-[175px] text-black-text"
          >
            <label className="flex items-center p-3 justify-between">
              <div className="flex items-center gap-3">
                <SearchCheck className="text-primary" />
                <span className="text-black-text ">Inspection</span>
              </div>

              <Checkbox
                checked={typeFilter.includes("Inspection")}
                onCheckedChange={(checked) =>
                  setTypeFilter(
                    toggle(typeFilter, "Inspection", Boolean(checked))
                  )
                }
                className="checkbox-css mr-2"
              />
            </label>

            <Separator className="border-1 border-primary-300" />

            <label className="flex items-center p-3 justify-between">
              <div className="flex items-center gap-3">
                <Package2 className="text-primary" />
                <span className="text-black-text">Receiving</span>
              </div>

              <Checkbox
                checked={typeFilter.includes("Receiving")}
                onCheckedChange={(checked) =>
                  setTypeFilter(
                    toggle(typeFilter, "Receiving", Boolean(checked))
                  )
                }
                className="checkbox-css mr-2"
              />
            </label>
          </PopoverContent>
        </Popover> */}

        <Popover>
          <PopoverTrigger className="btn-css gradient-bg">
            Filter by Location
            <ListFilter />
          </PopoverTrigger>

          <PopoverContent
            align="center"
            className="popover-design w-[195px] text-black"
          >
            {loc.map((location, index) => (
              <div key={location.id}>
                <label className="flex items-center p-3 justify-between">
                  <div className="flex items-center gap-3">
                    <Warehouse className="text-primary" />
                    <span className="text-black-text">{location.location}</span>
                  </div>

                  <Checkbox
                    checked={locationFilter.includes(location.location)}
                    onCheckedChange={(checked) =>
                      setLocationFilter(
                        toggle(
                          locationFilter,
                          location.location,
                          Boolean(checked)
                        )
                      )
                    }
                    className="checkbox-css mr-2"
                  />
                </label>

                {/* Separator only if NOT last item */}
                {index < loc.length - 1 && (
                  <Separator className="border-1 border-primary-300" />
                )}
              </div>
            ))}
          </PopoverContent>
        </Popover>

        <Button className="btn-css gradient-bg" onClick={onOpenExport}>
          Export
          <FileDown />
        </Button>

        <Button className="btn-css gradient-bg" onClick={onClear}>
          Clear
          <Eraser />
        </Button>
      </div>
    </div>
  );
}
