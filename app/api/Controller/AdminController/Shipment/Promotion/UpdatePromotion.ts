"use client";
import { RequestModifyPromotion } from "@/app/api/Types/AdminSetting/Promotion/Promotion";
import { postRequest } from "../../../MainController/main";
export default async function PromotionUpdateApi(
  data: RequestModifyPromotion,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/admin/Promotion/ModifyPromotion`,
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
