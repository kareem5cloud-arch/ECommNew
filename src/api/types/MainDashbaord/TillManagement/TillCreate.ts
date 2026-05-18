export interface AddTill {
  tillName: string;
  listProduct: listProduct[];
}
export interface ModifyTill {
  TillID: string;
  tillName: string;
  listProduct: listProduct[];
}
export interface listProduct {
  attributeID: string;
  qty: number;
}

export interface AddLoign {
  email: string;
  password: string;
  tillID: string;
}
