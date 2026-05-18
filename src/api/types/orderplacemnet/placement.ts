export interface RequestAddOrder {
  customerID: string;
  customerName: string;
  phoneNo: string;
  shippingAddress: string;
  email: string;
  city: string;
  country: string;
  postalCode: string;
  orderDate: Date;
  paymentID: string;
  paymentStatus: string;
  delievryCharges: number;
  couponDiscount: number;
  totalBill: number;
  couponNumber: string;
  orderlist: orderSubList[];
}

export interface orderSubList {
  productID: string;
  qty: number;
  amount: number;
}
