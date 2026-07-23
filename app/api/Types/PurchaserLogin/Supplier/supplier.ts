export interface ResponseGetSupplpierlist {
  message: string;
  error: string;
  supplierList: SupplierListReponse[];
}

export interface SupplierListReponse {
  supplierID: string;
  supplierName: string;
  address: string;
  phoneNo: string;
  openingBalance: number;
  email: string;
  description: string;
}

export interface AddSupplierRequest {
  supplierName: string;
  address: string;
  phoneNo: string;
  openingBalance: number;
  email: string;
  description: string;
}
