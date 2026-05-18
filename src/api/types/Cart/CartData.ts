export interface cartList {
  cartlist: CartData[];
}
export interface CartData {
  storeID: string;
  productID: string;
  weight: number;
  varinetID: string;
  varinetName: string;
  storeName: string;
  productName: string;
  description: string;
  salePrice: number;
  quantity: number;
  image?: string;
  discount: number;
}
export interface CartData2 {
  productID: string;
  qty: number;
}
