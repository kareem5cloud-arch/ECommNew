"use client";

import { postRequest } from "../../../MainController/main";
import { requestAddCategory } from "@/app/api/Types/PurchaserLogin/Codes/Category/Category";
import {
  RequestAddFurtherSub,
  RequestModifyFurtherSub,
} from "@/app/api/Types/PurchaserLogin/Codes/FurtherCategory/FurtherCategory";

export default async function FurtherModifyApi(
  data: RequestModifyFurtherSub,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/ProductCategory/Sub/FurtherSub/ModifyCategory`,
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
