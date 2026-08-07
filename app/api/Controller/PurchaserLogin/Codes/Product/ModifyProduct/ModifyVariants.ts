"use client";

import { postRequest } from "@/app/api/Controller/MainController/main";

export default async function ProductMOdifyVariantsApi(
  data: {
    variantID: string;
    barcode: string;
    salePrice: number;
  },
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/ProductManagment/PurcahserLogin/ModifyProduct/VariantsModify?varientID=${data.variantID}&salePrice=${data.salePrice}&barcode=${data.barcode}`,
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
