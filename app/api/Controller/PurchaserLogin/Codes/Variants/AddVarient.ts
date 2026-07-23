"use client";
import { postRequest } from "../../../MainController/main";
import { RequestAddVariants } from "@/app/api/Types/PurchaserLogin/Codes/Variants/Varints";

export default async function VarientsAddApi(
  data: RequestAddVariants,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Variants/AddVariants`,
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
