export interface ResponseProductSectionHomePageByID {
  message: string;
  error: string;
  productList: ProductSectionHomePageByID;
}
export interface ProductSectionHomePageByID {
  productID: string;
  storeID: string;
  storeName: string;
  productName: string;
  categoryID: string;
  categoryName: string;
  subCategoryID: string;
  subCategoryName: string;
  subCategoryDetailID: string;
  furtherSubCategoryName: string;
  unitID: string;
  unitName: string;
  shortCode: string;
  feturedProduct: boolean;
  isStock: boolean;
  description: string;
  discount: number;
  rating: number;
  width: number;
  height: number;
  depth: number;
  weight: number;
  review: ProductSectionHomePageReviewByID[];
  images: ProductSectionHomePageImagesByID[];
  variants: ProductSectionHomePageVarientByID[];
}
export interface ProductSectionHomePageReviewByID {
  replyID: string;
  rating: number;
  date: string;
  messagentext: string;
  email: string;
  fileAttached: ProductSectionHomePagefileAttachedByID[];
}
export interface ProductSectionHomePagefileAttachedByID {
  data: string;
}
export interface ProductSectionHomePageImagesByID {
  urlID: string;
  url: string;
}
export interface ProductSectionHomePageVarientByID {
  varientID: string;
  variantName: string;
  variantValues: ProductSectionHomePageAttributeByID[];
}
export interface ProductSectionHomePageAttributeByID {
  attributeID: string;
  varientValue: string;
  qty: number;
  salePrice: number;
}
