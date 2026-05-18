"use server";

import { getRequest, postRequest } from "@/api/authentication/main";
import { RequestAddRegion } from "@/api/types/Shippment/Region/Region";

export default async function GetRegion(ID: string, token: string) {
  try {
    const customHeader: Record<string, string> = {};
    if (token) customHeader.Authorization = `Bearer ${token}`;

    const response = await getRequest(
      `/api/Shippment/admin/GetRegion/${ID}`,
      null,
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
