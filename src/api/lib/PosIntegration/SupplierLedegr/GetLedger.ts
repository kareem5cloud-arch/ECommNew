"use server";

import { getRequest, postRequest } from "@/api/authentication/main";
import { ResponseSupplierLedgerGetData } from "@/api/types/PosIntegration/SupplierLedger/SupplierLedger";

export default async function Getledger(
  data: ResponseSupplierLedgerGetData,
  token: string,
  supplierID: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  try {
    const response = await postRequest(
      `/api/Supplier/seller/posIntegration/GetSupplierLedger/${supplierID}`,
      data,
      customHeader
    );

    // Success case
    if (response.success) {
      return {
        data: response.data,
        status: response.status,
        message: response.message || "Supplier retrieved successfully",
      };
    }
    return {
      data: null,
      status: response.status,
      message: response.message || "An unexpected error occurred",
    };
  } catch (error: any) {
    return {
      data: null,
      status: 500,
      message: error?.message || "Server error",
    };
  }
}
