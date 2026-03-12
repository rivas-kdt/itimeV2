export const usersService = {
  list: async (params?: { search?: string; role?: any }) => {
    const sp = new URLSearchParams();
    if (params?.search) sp.set("search", params.search);
    if (params?.role && params.role !== "ALL") sp.set("role", params.role);
    const qs = sp.toString();
    const res = await fetch(`/api/v2/users${qs ? `?${qs}` : ""}`);
    return res.json();
  },

  getById: async (id: string) => { 
    const res = await fetch(`/api/v2/users/${id}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || "Failed to fetch user");
    }
    return data; 
  },

  create: async (payload: any) =>
    await fetch(`/api/v2/users`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: async (id: string, payload: any) =>
    await fetch(`/api/v2/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  remove: async (id: string) =>
    await fetch(`/api/v2/users/${id}`, { method: "DELETE" }),
};

export const userInfoService = {
  listInspections: async (
    empID: string,
    params?: { search?: string; type?: string; location?: string }
  ) => {
    const sp = new URLSearchParams();
    if (params?.search) sp.set("search", params.search);
    if (params?.type) sp.set("type", params.type);
    if (params?.location) sp.set("location", params.location);
    const qs = sp.toString();
    const res = await fetch(
      `/api/v2/users/${empID}/inspections${qs ? `?${qs}` : ""}`
    );
    return res.json();
  },
};

export async function getGroup() {
  const res = await fetch(`/api/v2/group`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }
  return data;
}