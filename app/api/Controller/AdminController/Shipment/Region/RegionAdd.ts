"use client";
import { postRequest } from "../../../MainController/main";
import { RegionAddRequest } from "@/app/api/Types/Shipment/Region";

export default async function RegionAddApi(
  data: RegionAddRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/admin/Shipment/admin/AddRegion`,
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
