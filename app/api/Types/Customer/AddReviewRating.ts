export interface AddReviewRequest {
  varientID: string;
  messagentext: string;
  rating: number;
  dataList: dataList[];
}
export interface dataList {
  data: string;
}
export interface UpdateReview {
  replyID: string;
  varientID: string;
  messagentext: string;
  rating: number;
  dataList: dataList[];
}
