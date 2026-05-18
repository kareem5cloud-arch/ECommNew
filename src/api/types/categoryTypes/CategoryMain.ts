export interface CategoryMainApiResponse {
  categoryList: CategoryMain[];
}

export type CategoryMain = {
  categoryID: string;
  categoryName: string;
  description: string;
};
