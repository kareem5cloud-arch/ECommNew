"use client";
import { postRequest } from "../../MainController/main";
import { ModifyPurcahseRequest } from "@/app/api/Types/PurchaserLogin/Purchase/Purchase";

export default async function PurchaseModifyApi(
  data: ModifyPurcahseRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/PurcahseSupplier/ModifyPurchase`,
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
