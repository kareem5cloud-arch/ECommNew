"use server";

import { postRequest } from "@/api/authentication/main";
import {
  RequestCourierAddData,
  RequestCourierModifyData,
} from "@/api/types/Admin/Courier/courier";
import {
  RequestCustomerAddData,
  ResponseCustomerAddData,
} from "@/api/types/PosIntegration/Customer/CustomerType";

export default async function ModifyCourier(
  data: RequestCourierModifyData,
  token: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  try {
    const response = await postRequest(
      `/api/CourierService/Admin/ModifyCourierService`,
      data,
      customHeader
    );

    // Success case
    if (response.success) {
      return {
        data: response.data as ResponseCustomerAddData,
        status: response.status,
        message: response.message || "Record Modified successfully",
      };
    }
    return {
      data: response.data as ResponseCustomerAddData,
      status: response.status,
      message: response.message || "An unexpected error occurred",
    };
  } catch (error: any) {
    return {
      data: error.data as ResponseCustomerAddData,
      status: 500,
      message: error?.message || "Server error",
    };
  }
}
