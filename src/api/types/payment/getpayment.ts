// Response Type
export interface paymentgetApiResponse {
  paymentMethod: paymentget[];
}

// A single paymentget record
export type paymentget = {
  paymentID: string;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
};
