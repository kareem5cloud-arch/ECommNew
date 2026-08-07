export interface ResponseProductSectionHomePage {
  message: string;
  error: string;
  productList: ProductSectionHomePage[];
}
export interface ProductSectionHomePage {
  productID: string;
  storeName: string;
  shortCode: string;
  storeID: string;
  threshold: number;
  productName: string;
  showinCountry: boolean;
  notShowinCountry: boolean;
  showinAllCountry: boolean;
  categoryID: string;
  categoryName: string;
  subCategoryID: string;
  subCategoryName: string;
  subCategoryDetailID: string;
  furtherSubCategoryName: string;
  unitID: string;
  unitName: string;
  feturedProduct: boolean;
  isStock: boolean;
  storeSale: string;
  description: string;
  discount: number;
  rating: number;
  width: number;
  height: number;
  depth: number;
  weight: number;
  countriesAllowedList: CustomercountriesAllowedList[];
  countriesNotAllowedList: CustomercountriesAllowedList[];
  variants: CustomerVariantsList[];
}

export interface CustomercountriesAllowedList {
  countryID: string;
  countryName: string;
}
export interface CustomerImagesList {
  urlID: string;
  url: string;
}
export interface CustomerVariantsList {
  varientID: string;
  qty: number;
  barcode: string;
  costPrice: number;
  salePrice: number;
  values: CustomerVariantValues[];
  images: CustomerImagesList[];
}
export interface CustomerVariantValues {
  attributeID: string;
  variantName: string; //Color , Specfictiopn
  varientValue: string; // Blue or or any other value
}
