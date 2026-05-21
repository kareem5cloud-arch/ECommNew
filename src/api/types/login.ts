export interface RequestLoginData {
  email: string;
  password: string;
}
export interface ResponseLoginData {
  token: string;
  sellerID: string;
  message?: string;
}
