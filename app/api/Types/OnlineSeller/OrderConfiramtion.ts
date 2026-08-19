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
  bags: number;
  qty: number;
  status: string;
  url: string;
  varintValue: varintValue[];
}
interface varintValue {
  value: string;
}

export interface OnlineOrderApproveAddRequest {
  orderNo: string;
  detailID: string;
  status: string;
  shippingCharges: number;
  bags: number;
}

export interface ApproveOrderStatus {
  ledgerID: string;
  orderNo: string;
  status: string;
  shippingCharges: number;
  bags: number;
  assignBags: assignBags[];
}
interface assignBags {
  detailID: string;
  getQtyBag: getQtyBag[];
}
interface getQtyBag {
  qty: number;
  bagNo: string;
}
