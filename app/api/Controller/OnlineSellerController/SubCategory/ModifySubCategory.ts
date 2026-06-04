"use client";

import { requestModifySubCategory } from "@/app/api/Types/OnlineSetting/SubCategory/SubCategory";
import { postRequest } from "../../MainController/main";

export default async function CategorySubModifyApi(
  data: requestModifySubCategory,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/ProductCategory/Sub/ModifyCategory`,
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
