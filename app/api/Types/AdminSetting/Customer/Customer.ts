export interface ResponseGetCustomer {
  message: string;
  error: string;
  cutomerList: cutomerList[];
}
export interface cutomerList {
  sellerID: string;
  email: string;
}
