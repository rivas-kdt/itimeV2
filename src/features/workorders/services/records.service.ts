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
  id: string,
  payload: any
): Promise<RecordsDTO> {
  const res = await fetch(`/api/v2/work-orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Failed to update work order");
  }
  return data;
}
