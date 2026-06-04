export interface ResponseHomePageStoreSetting {
  message: string;
  error: string;
  storeList: ResposneStoreListHomePage[];
}
export interface ResposneStoreListHomePage {
  userID: string;
  logoUrl: string;
  twitter: string;
  address: string;
  email: string;
  phoneNo: string;
  instagram: string;
  facebook: string;
  youtube: string;
  linkdin: string;
  imagelist: responseStoreListImageList[];
}
export interface responseStoreListImageList {
  imageID: string;
  url: string;
  headerText: string;
  subHeadingText: string;
}
