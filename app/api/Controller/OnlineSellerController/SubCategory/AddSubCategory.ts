"use client";

import { requestAddSubCategory } from "@/app/api/Types/OnlineSetting/SubCategory/SubCategory";
import { postRequest } from "../../MainController/main";
import { requestAddCategory } from "@/app/api/Types/OnlineSetting/Category/Category";

export default async function SubCategoryAddApi(
  data: requestAddSubCategory,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/ProductCategory/Sub/AddCategory`,
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
