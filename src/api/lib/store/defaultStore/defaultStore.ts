"use server";

import { postRequest } from "@/api/authentication/main";

export default async function StoreDefaultSet(data: string, token?: string) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Stores/Seller/DefaultStore/${data}`,
    null,
    customHeader
  );
  if (response.success) {
    return {
      data: response.data,
      status: response.status,
      message: "Store Default successfully",
    };
  }

  const status = response.status;

  if (status === 400 || status === 401) {
    return {
      data: null,
      message: "Invalid credentials",
      status,
    };
  }

  return {
    data: null,
    message:
      response.message || "Record Added failed due to an unexpected error.",
    status: response.status,
  };
}
