"use server";

import { postRequest } from "@/api/authentication/main";
import { RequestAddZone } from "@/api/types/Shippment/City/City";

export default async function AddCity(data: RequestAddZone, token?: string) {
  try {
    const customHeader: Record<string, string> = {};
    if (token) customHeader.Authorization = `Bearer ${token}`;

    const response = await postRequest(
      `/api/Shippment/admin/AddZoneRegion`,
      data,
      customHeader
    );

    if (response.success) {
      return {
        data: response.data,
        status: response.status,
        message: response.message || "Login Successfull",
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
