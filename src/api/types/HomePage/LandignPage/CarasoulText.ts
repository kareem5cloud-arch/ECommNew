export interface ladingPageDetailResponse {
  message: string;
  storeGet: ladingPageDetail[];
}

export interface ladingPageDetail {
  userID: string;
  headerText: string;
  subHeadingText: string;
  logoUrl: string;
  listImg: ladingPageDetailImg[];
}

export interface ladingPageDetailImg {
  imageID: string;
  url: string;
}
