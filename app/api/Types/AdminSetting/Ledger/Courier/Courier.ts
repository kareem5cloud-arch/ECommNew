export interface responseCourierLedger {
  message: string;
  error: string;
  arrear?: number;
  remaningOwed?: number;
}
export interface responseGetCourierLedger {
  message: string;
  error: string;
  courierLedgerList: courierLedgerList[];
}
export interface courierLedgerList {
  courierledgerID: string;
  postingDate: string;
  bagNo: string;
  status: string;
  totalBill: number;
  amountPaid: number;
  shippingCharges: number;
  product: productLedgerList[];
}
export interface productLedgerList {
  productName: string;
  rate: number;
  qty: number;
  bagCharges: number;
  values: [
    {
      value: string;
    },
  ];
}
export interface responseGetCourierBag {
  message: string;
  error: string;
  bagList: bagList[];
}
export interface bagList {
  bagNo: string;
  total: number;
}
