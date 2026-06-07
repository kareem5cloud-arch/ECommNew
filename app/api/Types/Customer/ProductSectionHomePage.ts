export interface ResponseProductSectionHomePage {
  message: string;
  error: string;
  productList: ProductSectionHomePage[];
}
export interface ProductSectionHomePage {
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
  images: ProductSectionHomePageImages[];
  variants: ProductSectionHomePageVarient[];
}

export interface ProductSectionHomePageImages {
  urlID: string;
  url: string;
}
export interface ProductSectionHomePageVarient {
  varientID: string;
  variantName: string;
  variantValues: ProductSectionHomePageAttribute[];
}
export interface ProductSectionHomePageAttribute {
  attributeID: string;
  varientValue: string;
  qty: number;
  salePrice: number;
}
