export interface RequestSubCatUpdateData {
  subCategoryID: string;
  storeID: string;
  categoryID: string;
  subCategoryName: string;
  description: string;
}
export interface ResponseSubCatUpdateData {
  status: string;
  message?: string;
}
