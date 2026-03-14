"use client";
import { useCallback, useState } from "react";
import { updateWorkOrder } from "../services/records.service";
import { RecordsDTO } from "../types";

type FormData = {
  id?: string;
  work_order?: string;
  constructionItem?: string;
  workCode?: string | number;
  others?: string | number;
};

export function useWorkOrderEdit() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startEdit = useCallback((workOrder: RecordsDTO) => {
    setFormData({
      id: workOrder.id || workOrder.workOrder,
      work_order: workOrder.workOrder,
      constructionItem: workOrder.constructionItem,
      workCode: workOrder.workCode,
      others: workOrder.others,
    });
    setIsEditing(true);
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

  const submitEdit = useCallback(async () => {
    if (!formData || !formData.id) return false;
    setIsSubmitting(true);
    try {
      await updateWorkOrder({
        workOrderId: formData.id,
        constructionId: formData.constructionItem,
        workCodeId: formData.workCode,
        othersId: formData.others,
      });
      setIsEditing(false);
      setFormData(null);
      return true;
    } catch (error) {
      console.error("Failed to update work order:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  return {
    isEditing,
    formData,
    startEdit,
    updateField,
    cancelEdit,
    submitEdit,
    isSubmitting,
  };
}
