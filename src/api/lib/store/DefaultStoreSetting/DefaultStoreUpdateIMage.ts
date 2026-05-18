"use server";

import { postRequest } from "@/api/authentication/main";
import {
  RequestStoreHomepageUpdateData,
  RequestStoreHomepageUpdateDataImage,
  ResponseStoreHomePageData,
} from "@/api/types/Store/StoreHomePageSetting/StoreHomePagesetting";

export default async function StoreHomePageUpdateSettingImage(
  data: RequestStoreHomepageUpdateDataImage,
  userID: string,
  token: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  try {
    const response = await postRequest(
      `/api/Stores/Seller/HomePageSetting/UpdateStoreSettingImage/${userID}`,
      data,
      customHeader
    );

    // Success case
    if (response.success) {
      return {
        data: response.data as ResponseStoreHomePageData,
        status: response.status,
        message: response.message || "Store Updated successfully",
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
