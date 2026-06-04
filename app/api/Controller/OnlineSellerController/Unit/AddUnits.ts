"use client";

import { RequestAddUnit } from "@/app/api/Types/OnlineSetting/Unit/Unit";
import { postRequest } from "../../MainController/main";
import { requestAddCategory } from "@/app/api/Types/OnlineSetting/Category/Category";

export default async function UnitAddApi(data: RequestAddUnit, token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/ProductCategory/Units/AddUnit`,
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
