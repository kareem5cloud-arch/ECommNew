export interface addVarinetPayload {
  invoiceNo: string;
  supplierID: string;
  purchaseDate: string;
  totalBill: number;
  amountPaid: number;
  adjustments: number;
  totalStock: number;
  listVarient: Varient[];
}
export interface modifyVarinetPayload {
   varientValue :string
   qty :number 
   costPrice :number 
   salePrice :number 
   barcode :string
}
export interface Varient {
  varientName: string;
  varientAttributes: VarientAttribute[];
}
export interface VarientAttribute {
  varientValue: string;
  qty: number;
  barcode:string;
  costPrice: number;
  salePrice: number;
}
export interface ResponseModifyProductData {
  status: string;
  message?: string;
}
