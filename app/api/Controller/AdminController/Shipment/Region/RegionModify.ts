"use client";
import { postRequest } from "../../../MainController/main";
import { RegionModifyRequest } from "@/app/api/Types/Shipment/Region";

export default async function RegionModifyApi(
  data: RegionModifyRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/admin/Shipment/admin/ModifyRegion`,
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
