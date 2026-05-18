"use server";

import { postRequest } from "@/api/authentication/main";
import {
  ImageApiRequest,
  ResponseImageProductData,
} from "@/api/types/product/addImages";

export default async function AddImageProduct(
  data: ImageApiRequest,
  token?: string,
  productID?: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Product/Seller/ModifyProduct/ImagesAdd/${productID}`,
    data,
    customHeader
  );

  if (response.success) {
    return {
      data: response.data as ResponseImageProductData,
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
