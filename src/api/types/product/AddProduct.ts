// Define the interface for the product add request payload
export interface ProductAddRequest {
  storeID: string;
  categoryID: string;
  productName: string;
  unitID: string;
  subCategoryDetailID: string;
  subCategoryID: string;
  discount: number;
  currentStock: number;
  threshold: number;
  percentage: number;
  showinAllCountry: boolean;
  showinCountry: boolean;
  notShowinCountry: boolean;
  description: string;
  width: number;
  height: number;
  depth: number;
  weight: number;
  listCountry: {
    countryID: string;
  }[];
  listImage: {
    url: string;
  }[];
  listVarient: Varient[];
}

export interface Varient {
  varientName: string;
  varientAttributes: VarientAttribute[];
}

export interface VarientAttribute {
  varientValue: string;
  qty: number;
  costPrice: number;
  salePrice: number;
}
export interface ResponseAddProductData {
  status: string;
  message?: string;
}
