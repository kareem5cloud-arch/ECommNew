"use client";

import { SupplierListReponse } from "@/app/api/Types/PurchaserLogin/Supplier/supplier";
import { postRequest } from "../../../MainController/main";

export default async function SupplierDeleteApi(
  supplierID: string,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/PurchaserLogin/Supplier/DeleteSupplier?supplierID=${supplierID}`,
    {},
    customHeader,
  );

  return {
    data: response.data,
    status: response.status,
  };
}
