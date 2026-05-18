export interface RequestPaymentAddData {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
}
export interface ResponsePaymentAddData {
  status: string;
  message?: string;
}
