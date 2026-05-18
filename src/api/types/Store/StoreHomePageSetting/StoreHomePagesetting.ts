export interface RequestStoreHomepageData {
  logoUrl: string;
  OtherText: string;
  HeaderText: string;
  SubHeadingText: string;
  imagelist: list[];
}
export interface list {
  imageUrl: string;
}
export interface ResponseStoreHomePageData {
  status: string;
  message?: string;
}

export interface RequestStoreHomepageUpdateData {
  logoUrl: string;
  OtherText: string;
  HeaderText: string;
  SubHeadingText: string;
}
export interface RequestStoreHomepageUpdateDataImage {
  imagelist: list[];
}
