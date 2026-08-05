"use client";

import { RequestAddProduct } from "@/app/api/Types/PurchaserLogin/Codes/Product/Product";
import { postRequest } from "../../../MainController/main";
import { requestAddCategory } from "@/app/api/Types/PurchaserLogin/Codes/Category/Category";

export default async function ProductAddApi(
  data: RequestAddProduct,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/ProductManagment/PurcahserLogin/AddProduct`,
    data,
    customHeader,
  );

  return {
    data: response.data,
    status: response.status,
    // message: response.message,
    // success: response.success,
    // error: response.error,
  };
}
