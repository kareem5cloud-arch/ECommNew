export interface AddrequestPaymentMethod {
  bankName: string;
  paymentOption: RequestPaymetnOptions[];
}
export interface ModifyrequestPaymentMethod {
  paymentID: string;
  bankName: string;
  paymentOption: RequestPaymetnOptions[];
}

export interface ResposnepaymentMethod {
  message: string;
  error: string;
  paymentMethod: PaymentMethod[];
}
export interface PaymentMethod {
  paymentID: string;
  bankName: string;
  paymentOption: RequestPaymetnOptions[];
}

export interface RequestPaymetnOptions {
  optionID?: string;
  optionName: string;
  iconUrl: string;
  maxThreshold: number;
  percentage: number;
}
