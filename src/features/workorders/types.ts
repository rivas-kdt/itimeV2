export type InspectionType = "Inspection" | "Receiving";
export type LocationName = "Warehouse A" | "Warehouse B";

export type RecordsDTO = {
  id: string;
  workOrder: string;
  constructionItem: string;
  workCode: string;
  others: string;
  workOrderId: string;
  constructionItemId: string;
  workCodeId: string;
  othersId: string;
  date: string;
  type: string;
  location: string;
};

export type GetRecordsParams = {
  q?: string;
  own?: boolean;
};

export type GetRecordsResponse = {
  rows: RecordsDTO[];
  total: number;
};

export type UpdateRecordsPayload = {
  date?: string;
  start_time?: string;
  end_time?: string;
  type?: InspectionType;
  location?: LocationName;
};
