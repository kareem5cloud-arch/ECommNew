"use server";

import { postRequest } from "@/api/authentication/main";
import {
  ProductModifyRequest,
  ResponseModifyProductData,
} from "@/api/types/product/modifyBasicInfo";

export default async function ModifyProductBasicInfo(
  data: ProductModifyRequest,
  token?: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Product/Seller/ModifyProduct/BasicInfo`,
    data,
    customHeader
  );

  if (response.success) {
    return {
      data: response.data as ResponseModifyProductData,
      status: response.status,
      message: "Product Modified successfully",
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
