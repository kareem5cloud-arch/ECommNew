// Define the interface for the product add request payload
export interface ProductModifyRequest {
  storeID: string;
  categoryID: string;
  productName: string;
  subCategoryDetailID: string;
  subCategoryID: string;
  unitID: string;
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
}

export interface ResponseModifyProductData {
  status: string;
  message?: string;
}
