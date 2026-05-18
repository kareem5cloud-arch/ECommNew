"use server";

import { postRequest } from "@/api/authentication/main";
import { deleteVarient } from "@/api/types/product/DeleteVarient";

export default async function DeleteVarinetApi(
  data: deleteVarient,
  token?: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Product/Seller/ModifyProduct/VarientDelete`,
    data,
    customHeader
  );
  if (response.success) {
    return {
      data: response.data,
      status: response.status,
      message: "Varient Deleted successfully",
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
