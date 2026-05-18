export interface ledegrCustoemrAdd {
  postingDate: string;
  amount: number;
  customerID: string;
  remarks: string;
  remaningAmount: number;
}
export interface ResponseCustomerLedgerGet {
  message: string;
  ledgerList: CustomerLedgerGet[];
}
export interface CustomerLedgerGet {
  ledgerID: string;
  entryType: string;
  postingDate: string;
  debitAmount: number;
  creditAmount: number;
  additionalInfo: string;
}
