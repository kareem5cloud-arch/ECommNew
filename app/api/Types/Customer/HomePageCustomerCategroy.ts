export interface resposneGetHomePageCustomerCategroy {
  message: string;
  error: string;
  categoryList: categoryListHomePageCustomerCategroy[];
}
export interface categoryListHomePageCustomerCategroy {
  categoryID: string;
  categoryName: string;
  url: string;
  subCategoryList: subCategoryListHomePageCustomerCategroy[];
}
export interface subCategoryListHomePageCustomerCategroy {
  subCategoryID: string;
  subCategoryName: string;
  subCategoryDetailList: subCategoryDetailListHomePageCustomerCategroy[];
}
export interface subCategoryDetailListHomePageCustomerCategroy {
  subCategoryDetailID: string;
  name: string;
}
