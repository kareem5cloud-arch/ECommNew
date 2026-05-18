"use server";

import { postRequest } from "@/api/authentication/main";
import {
  RequestSupplierAddLedgerData,
  RequestSupplierModifyLedgerData,
  ResponseSupplierAddDataLedger,
} from "@/api/types/PosIntegration/SupplierLedger/SupplierLedger";
import {
  RequestSupplierAddData,
  ResponseSupplierAddData,
} from "@/api/types/PosIntegration/Suppplier/addSupplier";

export default async function ModifyLedger(
  data: RequestSupplierModifyLedgerData,
  token: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  try {
    const response = await postRequest(
      `/api/Supplier/seller/posIntegration/ModifySupplierLedger`,
      data,
      customHeader
    );

    // Success case
    if (response.success) {
      return {
        data: response.data as ResponseSupplierAddDataLedger,
        status: response.status,
        message: response.message || "Record Updated successfully",
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
