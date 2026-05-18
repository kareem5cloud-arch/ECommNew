export interface RequestLoginDataCustomer {
  userName: string;
  email: string;
  password: string;
  phoneNo: string;
  address: string;
}
export interface RequestLoginDataCustomer2 {
  email: string;
  password: string;
}
export interface ResponseLoginDataCustomer {
  data?: {
    message?: string;
  };
  message: string;
  status: number;
  success: boolean;
}
