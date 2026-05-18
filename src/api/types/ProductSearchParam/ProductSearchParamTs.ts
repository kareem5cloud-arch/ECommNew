export interface ProductFetchRepsonse {
  message: string;
  totalCount: number;
  productList: productList[];
}
export interface productList {
  storeID: string;
  storeName: string;
  totalCount: number;
  productID: string;
  storeSale: string;
  categoryID: string;
  subCategoryID: string;
  subCategoryName: string;
  subCategoryDetailID: string;
  unitID: string;
  productName: string;
  description: string;
  discount: number;
  threshold: number;
  width: number;
  height: number;
  depth: number;
  weight: number;
  showinAllCountry: boolean;
  showinCountry: boolean;
  notShowinCountry: boolean;
  //countryList: countryList[];
  images: Image[];
  variants: Variant[];
}
export type Image = {
  urlID: string;
  url: string;
};

export type Variant = {
  varientID: string;
  variantName: string;
  variantValues: VariantValue[];
};
export type VariantValue = {
  attributeID: string;
  varientValue: string;
  costPrice: number;
  salePrice: number;
  qty: number;
  barcode: string;
};
export type countryList = {
  countryID: string;
  countryName: string;
};