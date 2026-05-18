export interface CustomerDetailResponse {
  message: string;
  customerData: CustomerDetail[];
}

export interface CustomerDetail {
  userID: string;
  customerName: string;
  email: string;
  phoneNo: string;
  isActive: boolean;
  verificationStatus: string;
}
