export interface RequestAddStore {
  storeName: string;
  logoUrl: string;
  zoneID: string;
  defaultStore: boolean;
  description: string;
}
export interface ResponseGetStore {
  message: string;
  error: string;
  storeList: storeList[];
}
export interface storeList {
  storeID: string;
  storeName: string;
  defaultStore?: boolean;
}
