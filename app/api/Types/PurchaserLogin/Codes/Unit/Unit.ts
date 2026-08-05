export interface RequestAddUnit {
  unitName: string;
  storeID: string;
  abbreviation: string;
  description: string;
}
export interface RequestModifyUnit {
  unitID: string;
  unitName: string;
  storeID: string;
  abbreviation: string;
  description: string;
}
export interface RespopnseUInitListGet {
  message: string;
  error: string;
  unitList: unitList[];
}
export interface unitList {
  unitID: string;
  storeID: string;
  storeName: string;
  unitName: string;
  abbreviation: string;
  description: string;
}
