export interface ResponseCustomerOrder {
  message: string;
  error: string;
  orderList: CustomerOrderList[];
}
export interface CustomerOrderList {
  ledgerID: string;
  deliveryTypeID: string;
  shippingDetailID: string;
  postingDate: string;
  address: string;
  orderNo: string;
  email: string;
  phoneNo: string;
  returnThreshold: number;
  deliverAt: string;
  orderDetail: orderDetailCustomer[];
}
export interface orderDetailCustomer {
  bagsID: string;
  detailID: string;
  detailType: string;
  status: string;
  bagNo: string;
  deliveryDate: string;
  serviceName: string;
  trackingID: string;
  videoUrl: string;
  product: productCustomer[];
}
export interface productCustomer {
  url: string;
  varientID: string;
  productName: string;
  qty: number;
  rate: number;
  values: values[];
}
interface values {
  value: string;
}
