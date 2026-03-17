import { useCallback, useEffect, useState } from "react";
import { recordsService } from "../tracker.service";
import { useRouter } from "next/navigation";

interface RecordItem {
  id: string;
  workOrder: string;
  constructionItem: string;
  workCode: string;
  others: string;
  workOrderId: string;
  constructionItemId: string;
  workCodeId: string;
  othersId: string;
  date: string;
  type: string;
  location: string;
}

type Record = {
  id: string;
  workOrder: string;
  constructionItem: string;
  workCode: string;
  others: string;
  workOrderId: string;
  construction: string;
  workCodeId: string;
  othersId: string;
  inspection_date: string;
  type: string;
  location: string;
};

export const useRecordTrackerHooks = (id: any) => {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [recordInfo, setRecordInfo] = useState<Record>();
  const router = useRouter();

  const fetchAllRecords = useCallback(async () => {
    try {
      const data = await recordsService.list();
      setRecords(data.rows);
    } catch (error) {
      console.error("Failed to fetch records: ", error);
      setRecords([]);
    } finally {
    }
  }, []);

  // const fetchRecordById = useCallback(async (id: string) => {
  //   try {
  //     const data = await recordsService.getById(id);
  //     setRecordInfo(data.data);
  //     return data;
  //   } catch (error) {
  //     console.error(`Failed to fetch record with id ${id}: `, error);
  //     return null;
  //   }
  // }, []);

  // const createRecord = useCallback(
  //   async (payload: any) => {
  //     try {
  //       const res = await recordsService.create(payload);
  //       const data = await res.json();
  //       const inspectionId = data?.data;
  //       router.push(`/timer/${inspectionId}`);
  //       console.log("Record created successfully: ", data);
  //     } catch (error) {
  //       console.error("Failed to create record: ", error);
  //     }
  //   },
  //   [router],
  // );

  const createRecord = async (payload: any) => {
    try {
      const res = await recordsService.create(payload);
      const data = await res.json();
      const inspectionId = data?.data;
      router.push(`/timer/${inspectionId}`);
    } catch (error) {
      console.error("Failed to create record: ", error);
    }
  };

  const checkAndRedirectActiveInspection = useCallback(async () => {
    try {
      const data = await recordsService.getActiveInspection();
      if (data.data && data.data.inspection_id) {
        router.push(`/timer/${data.data.inspection_id}`);
      }
    } catch (error) {
      console.error("Failed to check for active inspection: ", error);
    }
  }, [router]);

  useEffect(() => {
    checkAndRedirectActiveInspection();
  }, [checkAndRedirectActiveInspection]);

  useEffect(() => {
    fetchAllRecords();
    // fetchRecordById(id); // Example: Fetch record with ID 1 on mount
  }, [fetchAllRecords]);

  return {
    records,
    recordInfo,
    createRecord,
    fetchAllRecords,
    // fetchRecordById,
    checkAndRedirectActiveInspection,
  };
};
