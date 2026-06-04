"use client";
import { DeleivryStandardAddRequest } from "@/app/api/Types/Shipment/DelievryStandard";
import { postRequest } from "../../../MainController/main";

export default async function DelievryStandardAddApi(
  data: DeleivryStandardAddRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/DelievryStandard/admin/AddDelievryStandard`,
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
