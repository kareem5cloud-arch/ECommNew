"use client";

import { postRequest } from "../../MainController/main";
import { requestAddCategory } from "@/app/api/Types/OnlineSetting/Category/Category";
import { RequestAddFurtherSub } from "@/app/api/Types/OnlineSetting/FurtherCategory/FurtherCategory";

export default async function FurtherAddApi(
  data: RequestAddFurtherSub,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/ProductCategory/Sub/FurtherSub/AddCategory`,
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
