export interface ResponseGetDefaultStoreget {
  message: string;
  error: string;
  storeList: storeListResponse[];
}

export interface storeListResponse {
  userID?: string;
  logoUrl: string;
  twitter: string;
  address: string;
  email: string;
  phoneNo: string;
  instagram: string;
  linkdin: string;
  facebook: string;
  youtube: string;
  imagelist: imageListResponse[];
}
export interface imageListResponse {
  imageID?: string;
  url: string;
  headerText: string;
  subHeadingText: string;
  otherText: string;
}
