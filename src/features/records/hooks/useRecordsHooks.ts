import { useEffect, useMemo, useState } from "react";
import { InspectionsDTO, InspectionType, LocationName } from "../types";
import { deleteInspection, getInspections, updateInspection } from "../services/records.service";
import { addDays } from "date-fns";
import { type DateRange } from "react-day-picker";

export function useRecordsHooks() {
    const [records, setRecords] = useState<InspectionsDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchRecord, setSearchRecord] = useState("");
    const [typeFilter, setTypeFilter] = useState<InspectionType[]>([]);
    const [locationFilter, setLocationFilter] = useState<LocationName[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), 0, 20),
        to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
    });

    const fetchInspections = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getInspections({
                q: searchRecord.trim() || undefined,
                type: typeFilter.length ? typeFilter : undefined,
                own: true,
                location: locationFilter.length ? locationFilter : undefined,
                dateFrom: date?.from ? date.from.toISOString().split('T')[0] : undefined,
                dateTo: date?.to ? date.to.toISOString().split('T')[0] : undefined,
                limit: 500,
                offset: 0,
            });
            console.log("Fetched inspections:", res);
            setRecords(res.rows);
        } catch (e: any) {
            setError(e?.message || "Failed to load inspections");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchInspections();
    }, [searchRecord, typeFilter, locationFilter, date]);

    const clearFilters = () => {
        setSelectedIds([]);
        setSearchRecord("");
        setTypeFilter([]);
        setLocationFilter([]);
        setDate({
            from: new Date(new Date().getFullYear(), 0, 20),
            to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
        });
    }

    const onUpdate = async (id: string, patch: any) => {
        console.log("Updating inspection with id:", id, "and patch:", patch);
        const updated = await updateInspection(id, patch);
        fetchInspections();
        return updated;
    }

    const onDelete = async (id: string) => {
        await deleteInspection(id);
        setRecords((prev) => prev.filter((r) => r.id !== id));
        setSelectedIds((prev) => prev.filter((x) => x !== id));
    }

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