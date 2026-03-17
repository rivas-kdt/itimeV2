"use client";
import { useCallback, useState } from "react";
import { updateWorkOrder } from "../services/records.service";
import { RecordsDTO } from "../types";

export type FormData = {
  id?: string;
  work_order?: string;
  constructionItemId?: string;
  constructionItem?: string;
  workCodeId?: string;
  workCode?: string | number;
  othersId?: string;
  others?: string | number;
  inspectionIds?: (string | number)[];
};

export type WorkOrder = {
  workOrderId?: string;
  workOrder: string;
  constructionItemId?: string;
  construction: string;
  workCodeId?: string;
  workCode: string;
  othersId?: string;
  others: string;
};

export function useWorkOrderEdit() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startEdit = useCallback((workOrder: WorkOrder) => {
    console.log("Starting edit for work order:", workOrder);
    setFormData({
      id: workOrder.workOrderId,
      work_order: workOrder.workOrder,
      constructionItemId: workOrder.constructionItemId,
      constructionItem: workOrder.construction,
      workCodeId: workOrder.workCodeId,
      workCode: workOrder.workCode,
      othersId: workOrder.othersId,
      others: workOrder.others,
    });
    setIsEditing(true);
  }, []);

  const updateConstructionItem = useCallback((value: string, id?: string) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return { ...prev, constructionItem: value, constructionItemId: id };
    });
  }, []);

  const updateWorkCode = useCallback((value: string, id?: string) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return { ...prev, workCode: value, workCodeId: id };
    });
  }, []);

  const updateOthers = useCallback((value: string, id?: string) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return { ...prev, others: value, othersId: id };
    });
  }, []);

  const updateField = useCallback((field: keyof FormData, value: any) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  }, []);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setFormData(null);
  }, []);

  const submitEdit = useCallback(async (inspectionIds?: (string | number)[]) => {
    if (!formData || !formData.id) return null;
    setIsSubmitting(true);
    try {
      const ids = inspectionIds || formData.inspectionIds || [];
      
      // Loop through each inspection ID and update
      for (const inspectionId of ids) {
        await updateWorkOrder({
          inspectionId,
          workOrderId: formData.id,
          constructionId: formData.constructionItemId,
          workCodeId: formData.workCodeId,
          othersId: formData.othersId,
        });
      }
      
      setIsEditing(false);
      setFormData(null);
      // Return the updated form data for redirect
      return {
        workOrderId: formData.id,
        workCodeId: formData.workCodeId,
        constructionItemId: formData.constructionItemId,
        othersId: formData.othersId,
      };
    } catch (error) {
      console.error("Failed to update work order:", error);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  return {
    isEditing,
    formData,
    startEdit,
    updateField,
    updateConstructionItem,
    updateWorkCode,
    updateOthers,
    cancelEdit,
    submitEdit,
    isSubmitting,
  };
}
