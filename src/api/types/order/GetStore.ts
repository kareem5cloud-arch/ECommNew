export interface SellerStoreListResponse {
  message: string;
  storesMainList: storesListSeller[];
}
export interface storesListSeller {
  orderID: string;
  productName: string;
  bankName: string;
  status: string;
  customerName: string;
  email: string;
  phoneNo: string;
  shippingAddress: string;
  paymentStatus: string;
  orderDate: string;
  totalAmount: number;
  delievryCharges: number;
  storesSubList: storesSubList[];
}
export interface storesSubList {
  orderDetailID: string;
  productID: string;
  productName: string;
  qty: number;
  bags: number;
  salePrice: number;
  discount: number;
  shippingCharges: number;
  status: string;
}
