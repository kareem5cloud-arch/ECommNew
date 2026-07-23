"use client";

import { SupplierListReponse } from "@/app/api/Types/PurchaserLogin/Supplier/supplier";
import { postRequest } from "../../../MainController/main";

export default async function SupplierModifyApi(
  data: SupplierListReponse,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/PurchaserLogin/Supplier/ModifySupplier`,
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
