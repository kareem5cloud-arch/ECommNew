"use client";
import { DeleivryStandardModifyRequest } from "@/app/api/Types/Shipment/DelievryStandard";
import { getRequest } from "../../../MainController/main";

export default async function DelievryStandardGetApi(token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await getRequest(
    `/api/DelievryStandard/admin/GetDelievryStandard`,
    null,
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
