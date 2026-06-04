"use client";

import { getRequest, postRequest } from "../../MainController/main";

export default async function UnitGetApi(storeID: string, token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await getRequest(
    `/api/ProductCategory/Units/GetUnit/${storeID}`,
    [],
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
