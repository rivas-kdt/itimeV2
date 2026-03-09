export const recordsService = {
  list: async () => {
    const res = await fetch(`/api/v2/work-orders`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    return res.json();
  },
  create: async (payload: any) => {
    const res = await fetch(`/api/v2/inspections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log(res)
    return res
  },
  getById: async (id: string) => {
    const res = await fetch(`/api/v2/inspections/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    return res.json();
  },
  getActiveInspection: async () => {
    const res = await fetch(`/api/v2/inspections/active`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    return res.json();
  },
};
