"use client";

import { AddSupplierRequest } from "@/app/api/Types/PurchaserLogin/Supplier/supplier";
import { getRequest, postRequest } from "../../../MainController/main";

export default async function SupplierAppApi(
  data: AddSupplierRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/PurchaserLogin/Supplier/AddSupplier`,
    data,
    customHeader,
  );

  return {
    data: response.data,
    status: response.status,
    // message: response.message,
    // success: response.success,
    // error: response.error,
  };
}
