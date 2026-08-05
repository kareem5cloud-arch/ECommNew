"use client";

import { postRequest } from "../../../MainController/main";
import { requestAddCategory } from "@/app/api/Types/PurchaserLogin/Codes/Category/Category";

export default async function CategoryDelete(ID: String, token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/ProductCategory/Main/DeleteCategory?categoryID=${ID}`,
    {},
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
