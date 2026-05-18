"use server";

import { getRequest, postRequest } from "@/api/authentication/main";

export default async function DeleteImageApi(data: string, token?: string) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await getRequest(
    `/api/Product/Seller/ModifyProduct/ImagesDelete/${data}`,
    null,
    customHeader
  );
  if (response.success) {
    return {
      data: response.data,
      status: response.status,
      message: "Image Deleted successfully",
    };
  }

  const status = response.status;

  if (status === 400 || status === 401) {
    return {
      data: null,
      message: response.message,
      status,
    };
  }

  return {
    data: null,
    message:
      response.message || "Record Deleted failed due to an unexpected error.",
    status: response.status,
  };
}
