"use client";
import { ZoneAddRequest } from "@/app/api/Types/Shipment/Zone";
import { postRequest } from "../../../MainController/main";

export default async function ZoneAddApi(data: ZoneAddRequest, token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/admin/Shipment/admin/AddZoneRegion`,
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
