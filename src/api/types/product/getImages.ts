export interface ImageGetApiResponse {
  imagesList: ImageListID[];
}

export type ImageListID = {
  urlID: string;
  url: string;
};
