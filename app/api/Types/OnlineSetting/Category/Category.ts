export interface requestAddCategory {
  categoryName: string;
  description: string;
}

export interface requestModifyCategory {
  categoryID: string;
  categoryName: string;
  description: string;
}

export interface ResponseCategory {
  message: string;
  error: string;
  categoryList: CategoryList[];
}
export interface CategoryList {
  categoryID: string;
  storeID: string;
  storeName: string;
  categoryName: string;
  description: string;
}
