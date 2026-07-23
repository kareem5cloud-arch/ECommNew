"use client";

import { postRequest } from "../../../MainController/main";

export default async function FurtherDeleteApi(
  subCategoryDetailID: string,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/ProductCategory/Sub/FurtherSub/DeleteCategory?subCategoryDetailID=${subCategoryDetailID}`,
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
