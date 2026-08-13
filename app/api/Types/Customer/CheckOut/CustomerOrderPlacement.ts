export interface AddOrderRequest {
  shippingDetailID: string;
  deliveryTypeID: string;
  paymentMethod: string;
  paymentStatus: string;
  additionalCharges: number;
  shippingCharges: number;
  orderDate: string;
  totalBill: number;
  amountPaid: number;

  orderDetail: orderDetailCustomer[];
}
interface orderDetailCustomer {
  varientID: string;
  qty: number;
  rate: number;
}
