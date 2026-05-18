"use server";

import { getRequest, postRequest } from "@/api/authentication/main";

export default async function GetProductImages(data: string, token?: string) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await getRequest(
    `/api/Product/Seller/ModifyProduct/ImagesGet/${data}`,
    null,
    customHeader
  );

  if (response.success) {
    return {
      data: response.data,
      status: response.status,
      message: "Image fetched successfully",
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
      response.message || "Record Modified failed due to an unexpected error.",
    status: response.status,
  };
}
