"use client";
import { postRequest } from "../../MainController/main";
import { AddPurrchaseRequest } from "@/app/api/Types/PurchaserLogin/Purchase/Purchase";

export default async function PurchaseAddApi(
  data: AddPurrchaseRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/PurcahseSupplier/AddPurchase`,
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
