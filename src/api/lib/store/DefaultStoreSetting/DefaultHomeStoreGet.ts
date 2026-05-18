"use server";

import { getRequest } from "@/api/authentication/main";

import { StoreHomeSettingGetApiResponse } from "@/api/types/Store/StoreHomePageSetting/StoreHomePageSettingGet";

export default async function StoreHomePageGetSetting(
  storeID: string,
  token: string,
  data?: {}
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  try {
    const response = await getRequest(
      `/api/Stores/Seller/HomePageSetting/GetStoreSetting/${storeID}`,
      null,
      customHeader
    );

    // Success case
    if (response.success) {
      return {
        data: response.data as StoreHomeSettingGetApiResponse,
        status: response.status,
        message: response.message || "Store added successfully",
      };
    }

    // Error case: return the message from API response if available
    return {
      data: null,
      status: response.status,
      message: response.message || "An unexpected error occurred",
    };
  } catch (error: any) {
    return {
      data: null,
      status: 500,
      message: error?.message || "Server error",
    };
  }
}
