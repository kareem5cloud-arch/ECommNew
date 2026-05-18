export interface RequestSubAddData {
  name: string;
  units: { unitID: string }[];
  subCategoryID: string;
}
export interface ResponseSubAddData {
  status: string;
  message?: string;
}
