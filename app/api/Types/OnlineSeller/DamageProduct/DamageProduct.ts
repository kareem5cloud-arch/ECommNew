export interface ResponseDamageProduct {
  message: string;
  error: string;
  data: DamageList[];
}
export interface DamageList {
  dID: string;
  storeID: string;
  storeName: string;
  productID: string;
  productName: string;
  varientID: string;
  qty: string;
  remarks: string;
  postingDate: string;
  valuesList: valuesList[];
}
interface valuesList {
  value: string;
}
