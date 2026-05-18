// Main API response interface
export interface VarinetApiResponse {
  message: string;
  vareintList: VariantList[];
}

// Variant sub-type
export type VariantList = {
  varientID: string;
  variantName: string;
  varientAttributes: VariantValue[];
};

// Variant value sub-type
export type VariantValue = {
  billingDetail: billingDetail[];
  barcode:string;
  attributeID: string;
  varientValue: string;
  costPrice: number;
  salePrice: number;
  qty: number;
};
export type billingDetail = {
  adjustments: number;
  amountPaid: number;
  purchaseID: string;
  totalBill: number;
};
