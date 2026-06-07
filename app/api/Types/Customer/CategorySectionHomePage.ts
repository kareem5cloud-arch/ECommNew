export interface resposneGetHomePageCategroy {
  message: string;
  error: string;
  categoryList: categoryListHomePageCategroyImages[];
}
export interface categoryListHomePageCategroyImages {
  subCategoryID: string;
  subCategoryName: string;
  url: string;
}
