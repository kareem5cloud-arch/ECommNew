export interface RequestCustomerAddData {
  customerName: string;
  phoneNo: string;
  email: string;
  description: string;
  openingBalance: number;
  address: string;
}
export interface ResponseCustomerAddData {
  status: string;
  message?: string;
}
export interface RequestCustomerModifyData {
  customerID: string;
  customerName: string;
  phoneNo: string;
  email: string;
  description: string;
  openingBalance: number;
  address: string;
}

export interface ResponseCustomerGetData {
  message?: string;
  customerList: CustomerData[];
}
export interface CustomerData {
  customerID: string;
  customerName: string;
  remainingBalance: number;
  address: string;
  phoneNo: string;
  email: string;
  description: string;
}
