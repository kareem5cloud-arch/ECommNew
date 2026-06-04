"use client";

import { postRequest } from "../../MainController/main";
import { RequestAddStore } from "@/app/api/Types/AdminSetting/Store/Store";

export default async function StoreAddApi(
  data: RequestAddStore,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Store/admin/CreateStore`,
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
