"use server";

import { postRequest } from "@/api/authentication/main";

export default async function DeleteProductApi(data: {}, token?: string) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Product/Seller/DeleteProduct`,
    data,
    customHeader
  );
  if (response.success) {
    return {
      data: response.data,
      status: response.status,
      message: "Product Deleted successfully",
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
