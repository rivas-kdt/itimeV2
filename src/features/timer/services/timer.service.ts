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

export async function getInspection(id: any) {
    const res = await fetch(`/api/v2/inspections/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data?.error || "Failed to start inspection");
    }
    return data;
}

export async function startInspection(payload: {
    workOrderId: string,
    workCodeId: string,
    constructionItemId: string,
    othersId: string,
    type: string,
    locationId: string,
    startTime: string,
    endTime: string,
    status: "active" | "ended"
}) {
    const res = await fetch(`/api/v2/inspections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data?.error || "Failed to start inspection");
    }
    return data;
}

export async function updateInspection(payload: {
    startTime?: string,
    endTime?: string,
    status?: "active" | "ended"
}, inspectionId: any) {
    const res = await fetch(`/api/v2/inspections/${inspectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data?.error || "Failed to update inspection");
    }
    return data;
}

export async function updateInspectionWorkOrder(payload: {
    workOrderId?: string,
    constructionItemId?: string,
    workCodeId?: string,
    othersId?: string
}, inspectionId: string) {
    const res = await fetch(`/api/v2/inspections?id=${inspectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data?.error || "Failed to update inspection work order");
    }
    return data;
}

export async function createInspectionRecord(payload: {
    workOrderId: string,
    workCodeId: string,
    constructionItemId: string,
    othersId: string,
    date: string,
    type: string,
    locationId: string,
    status: null
}) {
    const res = await fetch(`/api/v2/inspections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data?.error || "Failed to create inspection record");
    }
    return data;
}
