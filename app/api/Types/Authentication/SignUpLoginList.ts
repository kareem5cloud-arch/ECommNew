import { storeListSellerSignup } from "./login";

export interface ResponseSignUpList {
  message: string;
  error: string;
  signupList: signupList[];
}
export interface signupList {
  sellerID: string;
  userName: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  stores: storeListSellerSignup[];
}
