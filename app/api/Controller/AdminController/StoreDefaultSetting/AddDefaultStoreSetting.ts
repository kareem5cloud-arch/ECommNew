"use client";

import { storeListResponse } from "@/app/api/Types/AdminSetting/StoreDefaultSetting/StoreDefaultSetting";
import { postRequest } from "../../MainController/main";
import { RequestAddStore } from "@/app/api/Types/AdminSetting/Store/Store";

export default async function AddDefaultStoreSettingApi(
  storeID: string,
  data: storeListResponse,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Store/admin/HomePageSetting/AddStoreSetting/${storeID}`,
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
