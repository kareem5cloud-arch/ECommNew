"use client";
import { getRequest, postRequest } from "../../../MainController/main";
import { RegionAddRequest } from "@/app/api/Types/Shipment/Region";

export default async function RegionGetApi(countryID: string, token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await getRequest(
    `/api/admin/Shipment/admin/GetRegion/${countryID}`,
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
