export interface RequestPaymentUpdateData {
  paymentID: string;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
}
export interface ResponsePaymentUpdateData {
  status: string;
  message?: string;
}
