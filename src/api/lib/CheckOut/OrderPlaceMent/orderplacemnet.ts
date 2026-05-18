"use server";

import { postRequest } from "@/api/authentication/main";
import { RequestAddOrder } from "@/api/types/orderplacemnet/placement";

export default async function AddOrder(data: RequestAddOrder, token?: string) {
  try {
    const customHeader: Record<string, string> = {};
    if (token) customHeader.Authorization = `Bearer ${token}`;

    const response = await postRequest(
      `/api/OrderManagment/customer/AddOrder`,
      data,
      customHeader
    );

    if (response.success) {
      return {
        data: response.data,
        status: response.status,
        message: response.message || "Order Placed Successfully",
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
