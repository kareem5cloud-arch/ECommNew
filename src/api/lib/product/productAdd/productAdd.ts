"use server";

import { postRequest } from "@/api/authentication/main";
import {
  ProductAddRequest,
  ResponseAddProductData,
} from "@/api/types/product/AddProduct";

export default async function AddProduct(
  data: ProductAddRequest,
  token?: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Product/Seller/AddProduct`,
    data,
    customHeader
  );
  if (response.success) {
    return {
      data: response.data as ResponseAddProductData,
      status: response.status,
      message: "Product Added successfully",
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
