export interface requestAddSubCategory {
  categoryID: string;
  subCategoryName: string;
  description: string;
}

export interface requestModifySubCategory {
  subCategoryID: string;
  categoryID: string;
  subCategoryName: string;
  description: string;
}

export interface ResponseSubCategory {
  message: string;
  error: string;
  subCategoryList: subCategoryList[];
}
export interface subCategoryList {
  categoryID: string;
  subCategoryID: string;
  subCategoryName: string;
  categoryName: string;
  description: string;
}
