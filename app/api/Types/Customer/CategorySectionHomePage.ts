export interface resposneGetHomePageCategroy {
  message: string;
  error: string;
  categoryList: categoryListHomePageCategroyImages[];
}
export interface categoryListHomePageCategroyImages {
  categoryID: string;
  categoryName: string;
  subCategoryDetail: subCategoryDetailHomePage[];
}
interface subCategoryDetailHomePage {
  subCategoryID: string;
  subCategoryName: string;
  url: string;
}
