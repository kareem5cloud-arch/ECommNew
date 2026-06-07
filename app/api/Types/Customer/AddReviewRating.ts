export interface AddReviewRequest {
  productID: string;
  messagentext: string;
  rating: number;
  dataList: dataList[];
}
export interface dataList {
  data: string;
}
