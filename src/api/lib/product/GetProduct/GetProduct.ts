"use server";

import { getRequest } from "@/api/authentication/main";

export default async function GetProduct(
  token: string,
  storeID: string,
  pageNumber: number = 1,
) {
  const customHeaders: Record<string, string> = {};
  if (token) customHeaders.Authorization = `Bearer ${token}`;

  const response = await getRequest(
    `/api/Product/Seller/GetProduct/${storeID}?pageNumber=${pageNumber}`,
    null,
    customHeaders,
  );

  if (response.success) {
    return {
      data: response.data,
      status: response.status,
      message: "Product Get",
    };
  }

  const status = response.status;

  if (status === 400 || status === 401) {
    return {
      data: null,
      message: "UnAuthorize User",
      status,
    };
  }

  if (status === 409) {
    return {
      data: null,
      message: "Conflict Error",
      status,
    };
  }

  return {
    data: null,
    message: response.message || "Unexpected error occurred.",
    status: response.status || 500,
  };
}
