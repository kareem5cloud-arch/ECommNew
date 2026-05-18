"use server";

import { postRequest } from "@/api/authentication/main";
import {
  RequestSupplierModifyData,
  ResponseSupplierAddData,
} from "@/api/types/PosIntegration/Suppplier/addSupplier";

export default async function ModifySupplier(
  data: RequestSupplierModifyData,
  token: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  try {
    const response = await postRequest(
      `/api/Supplier/seller/posIntegration/ModifySupplier`,
      data,
      customHeader
    );

    // Success case
    if (response.success) {
      return {
        data: response.data as ResponseSupplierAddData,
        status: response.status,
        message: response.message || "Store Modified successfully",
      };
    }
    return {
      data: response.data as ResponseSupplierAddData,
      status: response.status,
      message: response.message || "An unexpected error occurred",
    };
  } catch (error: any) {
    return {
      data: error.data as ResponseSupplierAddData,
      status: 500,
      message: error?.message || "Server error",
    };
  }
}
