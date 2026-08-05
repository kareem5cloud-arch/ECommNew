"use client";

import { postRequest } from "../../../MainController/main";
import { requestModifyCategory } from "@/app/api/Types/PurchaserLogin/Codes/Category/Category";

export default async function CategoryModifyApi(
  data: requestModifyCategory,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/ProductCategory/Main/ModifyCategory`,
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
