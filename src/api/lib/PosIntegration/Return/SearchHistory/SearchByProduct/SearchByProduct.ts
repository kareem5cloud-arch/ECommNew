"use server";

import { getRequest, postRequest } from "@/api/authentication/main";

export default async function SearchByProduct(
  token: string,
  productID: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  try {
    const response = await getRequest(
      `/api/sale/seller/posIntegration/GetProductInfo/${productID}`,
      null,
      customHeader,
    );

    // Success case
    if (response.success) {
      return {
        data: response.data,
        status: response.status,
        message: response.message || "History Fetched successfully",
      };
    }
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
