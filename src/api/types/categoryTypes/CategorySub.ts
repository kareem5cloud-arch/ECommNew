export interface CategorySubApiResponse {
  categoryList: CategorySub[];
}

export type CategorySub = {
  categoryID: string;
  subCategoryID: string;
  subCategoryName: string;
  description: string;
};
