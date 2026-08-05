"use client";
import { postRequest } from "../../MainController/main";
import { ModifyPurcahseRequest } from "@/app/api/Types/PurchaserLogin/Purchase/Purchase";

export default async function PurchaseDeleteApi(
  ledgerID: string,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/PurcahseSupplier/DeletePurchase?ledgerID=${ledgerID}`,
    {},
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
