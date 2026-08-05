export interface AddPurrchaseRequest {
  postingDate: string;
  remarks: string;
  totalBill: number;
  amountPaid: number;
  supplierID: string;
  productList: productListData[];
}
interface productListData {
  varientID: string;
  costPrice: number;
  salePrice: number;
  qty: number;
}
export interface ModifyPurcahseRequest {
  ledgerID: string;
  postingDate: string;
  remarks: string;
  totalBill: number;
  amountPaid: number;
  supplierID: string;
  productList: productListData[];
}
export interface ResponsePurchaseList {
  message: string;
  error: string;
  data: GetPurchaseList[];
}
export interface GetPurchaseList {
  ledgerID: string;
  postingDate: string;
  supplierName: string;
  supplierID: string;
  invoiceNo: string;
  totalBill: number;
  amountPaid: number;
  remarks: string;
  detailList: detailList[];
}
interface detailList {
  value: string;
  varientID: string;
  productID: string;
  productName: string;
  qty: number;
  costPrice: number;
  salePrice: number;
  attributeValues: list[];
}
interface list {
  value: string;
}
