"use client";

import {
  RequestAddProduct,
  RequestModifyProduct,
} from "@/app/api/Types/OnlineSetting/Product/Product";
import { requestAddCategory } from "@/app/api/Types/OnlineSetting/Category/Category";
import { postRequest } from "../../../MainController/main";

export default async function ProductModifyApi(
  data: RequestModifyProduct,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/ProductManagment/OnlineSeller/ModifyProduct/BasicInfo`,
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
