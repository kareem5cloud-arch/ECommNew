export interface ResponseOrderConfiramtion {
  message: string;
  error: string;
  order: orderOnlineSeller[];
}
export interface orderOnlineSeller {
  ledgerID: string;
  name: string;
  address: string;
  email: string;
  phoneNo: string;
  orderNo: string;
  postingDate: string;
  totalBill: number;
  shippingCharges: number;
  additionalCharges: number;
  paymentMethod: string;
  orderStatus: string;
  paymentStatus: string;
  orderDetail: orderDetailOnlineSeller[];
}
export interface orderDetailOnlineSeller {
  detailID: string;
  productName: string;
  varientID: string;
  rate: number;
  qty: number;
  status: string;
  url: string;
  varintValue: varintValue[];
}
interface varintValue {
  value: string;
}
