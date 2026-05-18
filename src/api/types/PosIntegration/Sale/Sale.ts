export interface requestAddSale {
  customerID: string;
  postingDate: string;
  totalBill: number;
  amountPaid: number;
  adjustment: number;
  remarks: string;
  list: ListItem[];
}
export interface ListItem {
  attributeID: string;
  qty: number;
  amount: number;
  remakrs: string;
}

export interface responseAddSale {
  message: string;
}

export interface responseGetSale {
  message: string;
  saleList: Sale[];
}

export interface Sale {
  saleID: string;
  invoiceNo: number;
  customer: string;
  saleDate: string;
  totalBill: number;
  amountPaid: number;
  adjustment: number;
  remarks: string;
  itemList: SaleItem[];
}
export interface SaleItem {
  barcode: string;
  attributeID: string;
  productName: string;
  varinet: string;
  qty: number;
  price: number;
  remarks: string;
}
