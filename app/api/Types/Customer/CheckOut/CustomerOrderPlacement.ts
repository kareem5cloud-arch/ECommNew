export interface AddOrderRequest {
  shippingDetailID: string;
  deliveryTypeID: string;
  paymentMethod: string;
  paymentStatus: string;
  additionalCharges: number;
  shippingCharges: number;
  orderDate: string;
  totalBill: number;
  promoID: string;
  amountPaid: number;
  description?: string;

  orderDetail: orderDetailCustomer[];
}
interface orderDetailCustomer {
  varientID: string;
  qty: number;
  rate: number;
}
