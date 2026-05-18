export interface RequestSubModifyData {
  subCategoryDetailID: string;
  name: string;
  units: { unitID: string }[];
  // subCategoryID: string;
}
export interface ResponseSubModifyData {
  status: string;
  message?: string;
}
