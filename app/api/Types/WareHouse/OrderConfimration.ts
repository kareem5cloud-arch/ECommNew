export interface GetResponseWareHouse {
  error: string;
  message: string;
  order: dataWhole[];
}
export interface dataWhole {
  orderNo: string;
  ledgerID: string;
  bags: ModifyOrderWareHouse[];
}
export interface ModifyOrderWareHouse {
  bagsID: string;
  sellerID: string;
  email: string;
  orderType: string;
  description: string;
  bagNo: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingCharges: number;
  videoUrl: string;
  status: string;
  product: product[];
}
interface product {
  detailID: string;
  productID: string;
  varientID: string;
  url: string;
  productName: string;
  qty: number;
  rate: number;
  varintValue: varintValue[];
}
interface varintValue {
  value: string;
}

export interface UpdateOrderStratusWareHouse {
  bagsID: string;
  videoUrl: string;
  description: string;
  status: string;
}

export interface fetchCourierResponse {
  message: string;
  error: string;
  courierList: courierList[];
}
export interface courierList {
  courierID: string;
  serviceName: string;
  phoneNo: string;
  email: string;
  bagNo: number;
}

export interface responseGetSticker {
  message: string;
  error: string;
  stickerData: stickerData;
}
export interface stickerData {
  trackingID: string;
  orderNo: string;
  postingDate: string;
  paymentMethod: string;
  paymentStatus: string;
  address: string;
  customerAddress: string;
  deliverAt: string;
  email: string;
  phoneNo: string;
  typeName: string;
  name: string;
  logoUrl: string;
  storeName: string;
  emailStore: string;
  phoneNoStore: string;
  shippingCharges: number;
  totalBill: number;
  weight: number;
  height: number;
  width: number;
  depth: number;
}
