export interface RequestLoginData {
  Email: string;
  password: string;
}
export interface ResponseLoginData {
  token: string;
  sellerID: string;
  message?: string;
}
