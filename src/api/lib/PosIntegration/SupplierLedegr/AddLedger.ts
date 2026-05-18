"use server";

import { postRequest } from "@/api/authentication/main";
import {
  RequestSupplierAddLedgerData,
  ResponseSupplierAddDataLedger,
} from "@/api/types/PosIntegration/SupplierLedger/SupplierLedger";

export default async function AddLedger(
  data: RequestSupplierAddLedgerData,
  token: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  try {
    const response = await postRequest(
      `/api/Supplier/seller/posIntegration/AddSupplierLedger`,
      data,
      customHeader
    );

    // Success case
    if (response.success) {
      return {
        data: response.data as ResponseSupplierAddDataLedger,
        status: response.status,
        message: response.message || "Record Added successfully",
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
