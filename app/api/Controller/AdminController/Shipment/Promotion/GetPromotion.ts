"use client";
import { RequestModifyPromotion } from "@/app/api/Types/AdminSetting/Promotion/Promotion";
import { getRequest, postRequest } from "../../../MainController/main";
export default async function PromotionGetApi(token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await getRequest(
    `/api/admin/Promotion/GetPromotion`,
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
