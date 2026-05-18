"use server";

import { postRequest } from "@/api/authentication/main";
import { addVarinetPayload } from "@/api/types/product/AddVarient";
import {
  ProductModifyRequest,
  ResponseModifyProductData,
} from "@/api/types/product/modifyBasicInfo";

export default async function ModifyProductVarinet(
  data: addVarinetPayload,
  productID: string,
  token?: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `api/Product/Seller/ModifyProduct/VarientAdd/${productID}`,
    data,
    customHeader
  );

  if (response.success) {
    return {
      data: response.data as ResponseModifyProductData,
      status: response.status,
      message: "Varinet Modified successfully",
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
