export interface ResponseCustomerOrderRating {
  message: string;
  error: string;
  orderList: CustomerOrderRatingList[];
}
export interface CustomerOrderRatingList {
  varientID: string;
  productName: string;
  status: string;
  postingDate: string;
  qty: number;
  rate: number;
  shippingCharges: string;
  rating: Customerrating[];
  values: values[];
}

export interface Customerrating {
  replyID: string;
  messagentext: string;
  rating: number;
  imageData: [
    {
      data: string;
    },
  ];
}

interface values {
  value: string;
}

export interface GetResponseForReviewAdded {
  message: string;
  error: string;
  reveiws: reveiwsAdded[];
}

export interface reveiwsAdded {
  replyID: string;
  varientID: string;
  productName: string;
  messagentext: string;
  rating: number;
  values: values[];
  data: data[];
}
interface data {
  id: string;
  url: string;
}
interface values {
  value: string;
}
