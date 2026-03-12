import { useEffect, useMemo, useState } from "react";
import { RecordsDTO } from "../types";
import { getRecords, getRecordsInfo } from "../services/workOrder.service";

export function useWorkOrderHooks(
    workOrderId?: string,
    workCodeId?: string,
    constructionItemId?: string,
    othersId?: string) {
    const [records, setRecords] = useState<RecordsDTO[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const [searchWorkOrder, setSearchWorkOrder] = useState("");

    const [recordsInfo, setRecordsInfo] = useState<any[]>([])
    const [recordsTotal, setRecordsTotal] = useState<Number>(0)
    const [recordsInfoLoading, setRecordsInfoLoading] = useState<boolean>(true)
    const [recordsInfoError, setrecordsInfoError] = useState<string | null>(null)

    const fetchRecords = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await getRecords({
                q: searchWorkOrder.trim(),
                own: true
            })
            console.log(res.rows)
            setRecords(res.rows);
        } catch (e: any) {
            setError(e?.message || "failed to load inspections")
        } finally {
            setLoading(false)
        }
    }

    const fetchRecordInfo = async () => {
        setRecordsInfoLoading(true)
        setrecordsInfoError(null)
        try {
            const res = await getRecordsInfo({
                wo: workOrderId,
                wc: workCodeId,
                ci: constructionItemId,
                o: othersId,
                own: true
            })
            setRecordsInfo(res.rows)
            setRecordsTotal(res.total)
        } catch (e: any) {
            console.error(e)
            setrecordsInfoError(e?.message)
        } finally {
            setRecordsInfoLoading(false)
        }
    }

    useEffect(() => {
        fetchRecords()
        fetchRecordInfo()
    }, [searchWorkOrder])

    const filteredRecords = useMemo(() => records, [records]);

    // return {
    //     records: filteredRecords,
    //     recordsInfo,
    //     loading,
    //     error,
    //     recordsInfoLoading,
    //     recordsInfoError,
    //     searchWorkOrder,
    //     setSearchWorkOrder,
    //     refetch: fetchRecords
    // }

    return useMemo(
        () => ({
            records: filteredRecords,
            recordsInfo,
            recordsTotal,
            loading,
            error,
            recordsInfoLoading,
            recordsInfoError,
            searchWorkOrder,
            setSearchWorkOrder,
            refetch: fetchRecords
        }), [filteredRecords,
        recordsInfo,
        recordsTotal,
        loading,
        error,
        recordsInfoLoading,
        recordsInfoError,
        searchWorkOrder,
        setSearchWorkOrder,
        fetchRecords]
    )
}

// export function useRecordsHooks() {
//     const [records, setRecords] = useState<InspectionsDTO[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     const [searchRecord, setSearchRecord] = useState("");
//     const [typeFilter, setTypeFilter] = useState<InspectionType[]>([]);
//     const [locationFilter, setLocationFilter] = useState<LocationName[]>([]);
//     const [selectedIds, setSelectedIds] = useState<string[]>([]);

//     const fetchInspections = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const res = await getInspections({
//                 q: searchRecord.trim() || undefined,
//                 type: typeFilter.length ? typeFilter : undefined,
//                 own: true,
//                 location: locationFilter.length ? locationFilter : undefined,
//                 limit: 500,
//                 offset: 0,
//             });
//             console.log("Fetched inspections:", res);
//             setRecords(res.rows);
//         } catch (e: any) {
//             setError(e?.message || "Failed to load inspections");
//         } finally {
//             setLoading(false);
//         }
//     }

//     useEffect(() => {
//         fetchInspections();
//     }, [searchRecord, typeFilter, locationFilter]);

//     const clearFilters = () => {
//         setSelectedIds([]);
//         setSearchRecord("");
//         setTypeFilter([]);
//         setLocationFilter([]);
//     }

//     const onUpdate = async (id: string, patch: any) => {
//         const updated = await updateInspection(id, patch);
//         fetchInspections();
//         return updated;
//     }

//     const onDelete = async (id: string) => {
//         await deleteInspection(id);
//         setRecords((prev) => prev.filter((r) => r.id !== id));
//         setSelectedIds((prev) => prev.filter((x) => x !== id));
//     }

//     const filteredRecords = useMemo(() => records, [records]);

//     return {
//         records: filteredRecords,
//         loading,
//         error,
//         searchRecord,
//         setSearchRecord,
//         typeFilter,
//         setTypeFilter,
//         locationFilter,
//         setLocationFilter,
//         selectedIds,
//         setSelectedIds,
//         clearFilters,
//         onUpdate,
//         onDelete,
//     };
// }