import type {
  GetRecordsParams,
  GetRecordsResponse,
  RecordsDTO,
  UpdateRecordsPayload,
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

export async function getRecords(
  params: GetRecordsParams
): Promise<GetRecordsResponse> {
  const query = qs({
    q: params.q,
    own: params.own,
  });

  const res = await fetch(`/api/v2/work-orders?${query}`, {
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

export async function getRecordsInfo(params: {
  wo?: string | number;
  wc?: string | number;
  ci?: string | number;
  o?: string | number;
  own?: boolean;
}) {
  const query = qs({
    wo: params.wo,
    wc: params.wc,
    ci: params.ci,
    o: params.o,
    own: params.own,
  });
  const res = await fetch(`/api/v2/inspections?${query}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Failed to fetch work order");
  }
  return data;
}
