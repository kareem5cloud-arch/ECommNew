"use client";
import {
  ZoneAddRequest,
  ZoneModifyRequest,
} from "@/app/api/Types/Shipment/Zone";
import { postRequest } from "../../../MainController/main";

export default async function ZoneModifyApi(
  data: ZoneModifyRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/admin/Shipment/admin/ModifyZoneRegion`,
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
