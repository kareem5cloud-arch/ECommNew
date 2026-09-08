"use client";
import { RequestAddPromotion } from "@/app/api/Types/AdminSetting/Promotion/Promotion";
import { postRequest } from "../../../MainController/main";
export default async function PromotionAddApi(
  data: RequestAddPromotion,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/admin/Promotion/AddPromotion`,
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
