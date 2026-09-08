"use client";

import { RequestAddProduct } from "@/app/api/Types/PurchaserLogin/Codes/Product/Product";
import { getRequest, postRequest } from "../../../MainController/main";
import { requestAddCategory } from "@/app/api/Types/PurchaserLogin/Codes/Category/Category";

export default async function ProductDeleteApi(
  data: { productID: string },
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await getRequest(
    `/api/ProductManagment/PurcahserLogin/DeleteProduct?productID=${data.productID}`,
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
