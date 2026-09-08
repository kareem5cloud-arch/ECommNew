export interface RequestAddStore {
  storeName: string;
  logoUrl: string;
  returnThreshold: number;
  zoneID: string;
  email: string;
  phoneNo: string;
  defaultStore: boolean;
  address: string;
}
export interface ResponseGetStore {
  message: string;
  error: string;
  storeList: storeList[];
}
export interface storeList {
  storeID: string;
  storeName: string;
  email: string;
  phoneNo: string;
  defaultStore?: boolean;
}
