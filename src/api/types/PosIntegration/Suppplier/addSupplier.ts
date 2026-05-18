export interface RequestSupplierAddData {
  supplierName: string;
  phoneNo: string;
  email: string;
  description: string;
  openingBalance: number;
  address: string;
}
export interface RequestSupplierModifyData {
  supplierID: string;
  supplierName: string;
  phoneNo: string;
  email: string;
  description: string;
  openingBalance: number;
  address: string;
}
export interface ResponseSupplierAddData {
  status: string;
  message?: string;
}

export interface ResponseSupplierGetData {
  message?: string;
  supplierList: SupplierData[];
}
export interface SupplierData {
  supplierID: string;
  supplierName: string;
  remainingBalance: number;
  address: string;
  phoneNo: string;
  email: string;
  description: string;
}
