"use server";

import { postRequest } from "@/api/authentication/main";

export default async function AddZone(
  data: { zoneName: string },
  token?: string
) {
  try {
    const customHeader: Record<string, string> = {};
    if (token) customHeader.Authorization = `Bearer ${token}`;

    const response = await postRequest(
      `/api/Shippment/admin/AddShippingZone`,
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
