// Response Type
export interface StoreHomeSettingGetApiResponse {
  message: string;
  storeList: StoreHomeGet[];
}

// A single FurtherSub record
export type StoreHomeGet = {
  userID: string;
  headerText: string;
  subHeadingText: string;
  otherText: string;
  logoUrl: string;
  imagelist: list[];
};

// Unit inside FurtherSub
export type list = {
  imageID: string;
  imageUrl: string;
};
