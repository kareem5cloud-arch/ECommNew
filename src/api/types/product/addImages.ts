// Main API response interface
export interface ImageApiRequest {
  imgList: ImagesList[];
}

// A single product record
export type ImagesList = {
  url: string;
};

export interface ResponseImageProductData {
  status: string;
  message?: string;
}
