export interface GetResponseWareHouse {
  error: string;
  message: string;
  order: dataWhole[];
}
export interface dataWhole {
  orderNo: string;
  bags: ModifyOrderWareHouse[];
}
export interface ModifyOrderWareHouse {
  bagsID: string;
  bagNo: string;
  status: string;
  product: product[];
}
interface product {
  detailID: string;
  url: string;
  productName: string;
  qty: number;
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
