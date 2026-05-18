export interface RequestCourierAddData {
  serviceName: string;
  phoneNo: string;
  email: string;
  description: string;
  openingBalance: number;
}
export interface RequestCourierModifyData {
  courierID: string;
  serviceName: string;
  phoneNo: string;
  email: string;
  description: string;
  openingBalance: number;
}
export interface ResponseCustomerAddData {
  status: string;
  message?: string;
}
