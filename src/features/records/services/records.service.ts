/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  GetInspectionsParams,
  GetInspectionsResponse,
  InspectionsDTO,
  UpdateInspectionPayload,
} from "../types";

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

export async function getInspections(
  params: GetInspectionsParams
): Promise<GetInspectionsResponse> {
  const query = qs({
    q: params.q,
    type: params.type,
    own: params.own,
    location: params.location,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    limit: params.limit ?? 200,
    offset: params.offset ?? 0,
  });

  const res = await fetch(`/api/v2/inspections?${query}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }
  return data;
}

export async function getLocation() {
  const res = await fetch(`/api/v2/locations`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }
  return data;
}

export async function updateInspection(
  id: string,
  payload: UpdateInspectionPayload
): Promise<InspectionsDTO> {
  // Convert snake_case to camelCase for API
  const apiPayload = {
    startTime: payload.start_time,
    endTime: payload.end_time,
    date: payload.date,
    type: payload.type,
    location: payload.location,
  };

  const res = await fetch(`/api/v2/inspections/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apiPayload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }
  return data;
}

export async function deleteInspection(id: string): Promise<{ ok: true }> {
  const res = await fetch(`/api/v2/inspections/${id}`, { method: "DELETE" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }
  return data;
}
