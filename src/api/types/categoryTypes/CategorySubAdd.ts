export interface RequestSubCatAddData {
  categoryID: string;
  storeID: string;
  subCategoryName: string;
  description: string;
}
export interface ResponseSubCatAddData {
  status: string;
  message?: string;
}
