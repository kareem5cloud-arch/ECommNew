"use client";

import { getRequest } from "@/app/api/Controller/MainController/main";
import { RegionAddRequest } from "@/app/api/Types/Shipment/Region";

export default async function LocalShippingRateGetApi(token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await getRequest(
    `/api/admin/Shipment/admin/GetShippingZoneRate`,
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
