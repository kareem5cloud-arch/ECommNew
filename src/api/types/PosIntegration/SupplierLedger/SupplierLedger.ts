export interface RequestSupplierAddLedgerData {
  supplierID: string;
  postingDate: string;
  debitAmount: number;
  additionalInfo: string;
}
export interface RequestSupplierModifyLedgerData {
  ledgerID: string;
  supplierID: string;
  postingDate: string;
  debitAmount: number;
  additionalInfo: string;
}
export interface ResponseSupplierLedgerGet {
  message: string;
  ledgerList: supplierLedgerGet[];
}
export interface supplierLedgerGet {
  ledgerID: string;
  EntryType: string;
  postingDate: string;
  debitAmount: number;
  creditAmount: number;
  additionalInfo: string;
}
export interface ResponseSupplierAddDataLedger {
  status: string;
  message?: string;
}

export interface ResponseSupplierLedgerGetData {
  dateFrom: string;
  dateTo: string;
}
