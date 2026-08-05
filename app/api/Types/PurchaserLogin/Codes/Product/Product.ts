import { countryList } from "../../../Shipment/Country";

export interface RequestModifyProduct {
  productID: string;
  storeID: string;
  isStock: boolean;
  supplierID: string;
  invoiceNo: string;
  purchaseDate: string;
  totalBill: number;
  amountPaid: number;
  adjustments: number;
  categoryID: string;
  unitID: string;
  productName: string;
  subCategoryDetailID: string;
  subCategoryID: string;
  storeSale: string;
  discount: number;
  threshold: number;
  showinAllCountry: string;
  feturedProduct: boolean;
  showinCountry: string;
  notShowinCountry: string;
  description: string;
  width: number;
  height: number;
  depth: number;
  weight: number;
  listCountry: countryList[];
  listImage: listImage[];
  listVarient: listVarient[];
}
export interface RequestAddProduct {
  storeID: string;
  isStock: boolean;
  supplierID: string;
  invoiceNo: string;
  purchaseDate: string;
  totalBill: number;
  amountPaid: number;
  adjustments: number;
  categoryID: string;
  unitID: string;
  productName: string;
  subCategoryDetailID: string;
  subCategoryID: string;
  storeSale: string;
  discount: number;
  threshold: number;
  showinAllCountry: string;
  feturedProduct: boolean;
  showinCountry: string;
  notShowinCountry: string;
  description: string;
  width: number;
  height: number;
  depth: number;
  weight: number;
  listCountry: countryList[];
  // listImage: listImage[];
  listVarient: listVarient[];
}

export interface listVarient {
  costPrice: number;
  salePrice: number;
  qty: number;
  imageUrl: listImage[];
  attributeList: attributeList[];
}
export interface attributeList {
  attributeID: string;
}
///////////////////////Response Product Interface////////////////////
export interface responseGetProduct {
  message: string;
  error: string;
  productList: productList[];
}
export interface productList {
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
  countriesAllowedList: countriesAllowedList[];
  countriesNotAllowedList: countriesAllowedList[];
  variants: variantsList[];
}
export interface countriesAllowedList {
  countryID: string;
  countryName: string;
}
export interface imagesList {
  urlID: string;
  url: string;
}
export interface variantsList {
  varientID: string;
  qty: number;
  barcode: string;
  costPrice: number;
  salePrice: number;
  values: variantValues[];
  images: listImage[];
}
export interface variantValues {
  attributeID: string;
  variantName: string; //Color , Specfictiopn
  varientValue: string; // Blue or or any other value
}
export interface listImage {
  url: string;
  urlID?: string;
}
