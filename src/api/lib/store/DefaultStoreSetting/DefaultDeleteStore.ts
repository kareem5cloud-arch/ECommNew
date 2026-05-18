"use server";

import { postRequest } from "@/api/authentication/main";

export default async function StoreHomePageSettingDelete(
  userID: string,
  token: string,
  data?: {}
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  try {
    const response = await postRequest(
      `/api/Stores/Seller/HomePageSetting/DeleteStoreSetting/${userID}`,
      null,
      customHeader
    );

    // Success case
    if (response.success) {
      return {
        data: response.data,
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
    // Network / unexpected error
    return {
      data: null,
      status: 500,
      message: error?.message || "Server error",
    };
  }
}
