"use server";

import { getRequest, postRequest } from "@/api/authentication/main";
import { requestAddStoreToGetRate } from "@/api/types/Shippment/Rates/rates";

export default async function GetRates(
  cityName: string,
  data: requestAddStoreToGetRate,
  token?: string
) {
  try {
    const customHeader: Record<string, string> = {};
    if (token) customHeader.Authorization = `Bearer ${token}`;

    const response = await postRequest(
      `/api/Shippment/admin/GetShipmentRates/${cityName}`,
      data,
      customHeader
    );

    if (response.success) {
      return {
        data: response.data,
        status: response.status,
        message: response.message,
      };
    }

    return {
      data: response.data,
      status: response.status,
      message: response.message || "An unexpected error occurred",
    };
  } catch (error: any) {
    return {
      data: error.data,
      status: 500,
      message: error?.message || "Server error",
      success: false,
    };
  }
}
