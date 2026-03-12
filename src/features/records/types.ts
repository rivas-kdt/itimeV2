export type InspectionType = "Inspection" | "Receiving";
export type LocationName = "Warehouse A" | "Warehouse B";

export type InspectionsDTO = {
  id: string;
  workOrder: string;
  date: string; // YYYY-MM-DD
  duration: string; // e.g. "02:30"
  start_time: string;
  end_time: string;
  type: InspectionType;
  location: LocationName;
  construction: string;
  workCode: number;
  others: number;
};

export type GetInspectionsParams = {
  q?: string;
  type?: string[]; // ["Inspection","Receiving"]
  own?: boolean;
  location?: string[]; // ["Warehouse A","Warehouse B"]
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string; // YYYY-MM-DD
  limit?: number;
  offset?: number;
};

export type GetInspectionsResponse = {
  rows: InspectionsDTO[];
  total: number;
};

export type UpdateInspectionPayload = {
  date?: string; // YYYY-MM-DD
  start_time?: string;
  end_time?: string;
  type?: InspectionType;
  location?: LocationName;
};
