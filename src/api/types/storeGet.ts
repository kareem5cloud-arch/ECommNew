// Response Type
export interface StoreApiResponse {
  storeList: storeInital[];
}

// A single FurtherSub record
export type storeInital = {
  storeID: string;
  storeName: string;
  defaultStore: boolean;
};
