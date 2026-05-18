"use server";

import { postRequest } from "@/api/authentication/main";
import {
  RequestSupplierAddData,
  ResponseSupplierAddData,
} from "@/api/types/PosIntegration/Suppplier/addSupplier";

export default async function DeleteSupplier(data: {}, token: string) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  try {
    const response = await postRequest(
      `/api/Supplier/seller/posIntegration/DeleteSupplier`,
      data,
      customHeader
    );

    // Success case
    if (response.success) {
      return {
        data: response.data as ResponseSupplierAddData,
        status: response.status,
        message: response.message || "Supplier Deleted successfully",
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
