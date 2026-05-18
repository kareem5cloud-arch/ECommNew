export interface requestAddSaleReturn {
  saleID: string;
  customerID: string;
  postingDate: string;
  totalBill: number;
  amountPaid: number;
  adjustment: number;
  RetunrType: string;
  remarks: string;
  listExcahnge: listReturn[];
  listReturn: listReturn[];
}
export interface listReturn {
  attributeID: string;
  productName: string;
  barcode: string;
  qty: number;
  rate: number;
}

export interface ReturnSaleItem {
  detailID: string;
  attributeID: string;
  varinet: string;
  productName: string;
  qty: number;
  barcode: string;
  price: number;
  staus: string;
}

// Main sale return record
export interface ReturnSale {
  saleID: string;
  invoiceNo: number;
  customer: string;
  saleDate: string;
  totalBill: number;
  amountPaid: number;
  adjustments: number;
  returnType: string;
  remarks: string;
  subList: ReturnSaleItem[];
}

// API response
export interface GetReturnResponse {
  message: string;
  mainList: ReturnSale[];
}
