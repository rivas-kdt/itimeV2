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

export async function fetchUserProfile() {
    const res = await fetch(`/api/v2/profile`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        credentials: "include"
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data?.error || "Request failed");
    }
    return data;
}

