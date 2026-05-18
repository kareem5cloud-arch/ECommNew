export interface RequestUnitAddData {
  unitName: string;
  storeID: string;
  abbreviation: string;
  description: string;
}
export interface ResponseUnitAddData {
  status: string;
  message?: string;
}
