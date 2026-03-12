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
