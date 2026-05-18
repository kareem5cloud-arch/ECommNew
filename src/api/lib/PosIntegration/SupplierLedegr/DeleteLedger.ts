"use server";

import { getRequest, postRequest } from "@/api/authentication/main";
import { ResponseSupplierAddDataLedger } from "@/api/types/PosIntegration/SupplierLedger/SupplierLedger";

export default async function Deleteledger(token: string, ledgerID: string) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  try {
    const response = await getRequest(
      `/api/Supplier/seller/posIntegration/DeleteSupplierLedger/${ledgerID}`,
      null,
      customHeader
    );

    // Success case
    if (response.success) {
      return {
        data: response.data as ResponseSupplierAddDataLedger,
        status: response.status,
        message: response.message || "Supplier Deleted successfully",
      };
    }
    return {
      data: response.data as ResponseSupplierAddDataLedger,
      status: response.status,
      message: response.message || "An unexpected error occurred",
    };
  } catch (error: any) {
    return {
      data: error.data as ResponseSupplierAddDataLedger,
      status: 500,
      message: error?.message || "Server error",
    };
  }
}
