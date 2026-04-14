import { useEffect, useMemo, useState } from "react";
import { InspectionsDTO, InspectionType, LocationName } from "../types";
import {
  deleteInspection,
  getInspections,
  updateInspection,
} from "../services/records.service";
import { addDays, format } from "date-fns";
import { type DateRange } from "react-day-picker";
import { formatDateWithTimezone } from "@/lib/timezone";

export function useRecordsHooks() {
  const [records, setRecords] = useState<InspectionsDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchRecord, setSearchRecord] = useState("");
  const [typeFilter, setTypeFilter] = useState<InspectionType[]>([]);
  const [locationFilter, setLocationFilter] = useState<LocationName[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const fetchInspections = async () => {
    setLoading(true);
    setError(null);
    try {
      const dateFromString = date?.from
        ? formatDateWithTimezone(date.from)
        : undefined;
      const dateToString = date?.to
        ? formatDateWithTimezone(date.to)
        : undefined;
      const res = await getInspections({
        q: searchRecord.trim() || undefined,
        type: typeFilter.length ? typeFilter : undefined,
        own: true,
        location: locationFilter.length ? locationFilter : undefined,
        dateFrom: dateFromString,
        dateTo: dateToString,
        limit: 500,
        offset: 0,
      });
      setRecords(res.rows);
    } catch (e: any) {
      setError(e?.message || "Failed to load inspections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, [searchRecord, typeFilter, locationFilter, date]);

  const clearFilters = () => {
    setSelectedIds([]);
    setSearchRecord("");
    setTypeFilter([]);
    setLocationFilter([]);
    setDate({
      from: undefined,
      to: undefined,
    });
  };

  const onUpdate = async (id: string, patch: any) => {
    const updated = await updateInspection(id, patch);
    fetchInspections();
    return updated;
  };

  const onDelete = async (id: string) => {
    await deleteInspection(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const filteredRecords = useMemo(() => records, [records]);

  return {
    records: filteredRecords,
    loading,
    error,
    searchRecord,
    setSearchRecord,
    typeFilter,
    setTypeFilter,
    locationFilter,
    setLocationFilter,
    date,
    setDate,
    selectedIds,
    setSelectedIds,
    clearFilters,
    onUpdate,
    onDelete,
  };
}
