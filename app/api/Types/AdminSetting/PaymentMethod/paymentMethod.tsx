export interface AddrequestPaymentMethod {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  showCustomer: string;
}
export interface ModifyrequestPaymentMethod {
  paymentID: string;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  showCustomer: string;
}

export interface ResposnepaymentMethod {
  message: string;
  error: string;
  paymentMethod: PaymentMethod[];
}
export interface PaymentMethod {
  paymentID: string;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  showCustomer: string;
}
