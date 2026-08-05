"use client";

import { getRequest } from "../../../../MainController/main";

export default async function ProductDeleteVariantsApi(
  varientID: string,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await getRequest(
    `/api/ProductManagment/PurcahserLogin/ModifyProduct/VariantsDelete?varientID=${varientID}`,
    null,
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
