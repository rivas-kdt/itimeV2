/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  RecordsDTO,
  UpdateRecordsPayload,
} from "../types"

function qs(params: Record<string, any>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) {
      v.forEach((x) => sp.append(k, String(x)));
    } else {
      sp.set(k, String(v));
    }
  });
  return sp.toString();
}

export async function updateInspection(
  id: string,
  payload: UpdateRecordsPayload
): Promise<RecordsDTO> {
  const res = await fetch(`/api/v2/Records/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }
  return data;
}

export async function updateWorkOrder(
  payload: any
): Promise<RecordsDTO> {
  const params = new URLSearchParams();
  if (payload.inspectionId) params.append('id', String(payload.inspectionId));
  if (payload.workOrderId) params.append('wo', String(payload.workOrderId));
  if (payload.constructionId) params.append('ci', String(payload.constructionId));
  if (payload.workCodeId) params.append('wc', String(payload.workCodeId));
  if (payload.othersId) params.append('o', String(payload.othersId));

  const res = await fetch(`/api/v2/inspections?${params.toString()}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Failed to update inspection");
  }
  return data;
}

type DropdownOption = { id: string; value: string } | { id: string; [key: string]: any };

export async function getConstructionItems(): Promise<DropdownOption[]> {
  const res = await fetch('/api/v2/construction-item', {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json().catch(() => []);
  if (!res.ok) {
    throw new Error("Failed to fetch construction items");
  }
  return data;
}

export async function getWorkCodes(): Promise<DropdownOption[]> {
  const res = await fetch('/api/v2/work-code', {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json().catch(() => []);
  if (!res.ok) {
    throw new Error("Failed to fetch work codes");
  }
  return data;
}

export async function getOthers(): Promise<DropdownOption[]> {
  const res = await fetch('/api/v2/others', {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json().catch(() => []);
  if (!res.ok) {
    throw new Error("Failed to fetch others");
  }
  return data;
}

export async function createConstructionItem(value: string): Promise<DropdownOption> {
  const res = await fetch('/api/v2/construction-item', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ construction_item: value })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Failed to create construction item");
  }
  return data;
}

export async function createWorkCode(value: string): Promise<DropdownOption> {
  const res = await fetch('/api/v2/work-code', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ work_code: value })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Failed to create work code");
  }
  return data;
}

export async function createOther(value: string): Promise<DropdownOption> {
  const res = await fetch('/api/v2/others', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ others: value })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Failed to create other");
  }
  return data;
}
