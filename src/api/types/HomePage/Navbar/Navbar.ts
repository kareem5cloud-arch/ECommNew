export interface SubCategoryDetail {
  subCategoryDetailID: string;
  name: string;
  imagelist: imageListCategory[];
}

export interface Category {
  subCategoryID: string;
  subCategoryName: string;
  subCategory: SubCategoryDetail[];
}

export interface NavbarApiResponse {
  message: string;
  categoryList: Category[];
}
export interface imageListCategory {
  url: string;
}
