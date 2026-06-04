"use client";

import { requestUpdateCourierService } from "@/app/api/Types/AdminSetting/CourierService/CourierService";
import { postRequest } from "../../MainController/main";

export default async function CourierServiceDelete(ID: string, token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/admin/CourierService/DeleteCourierService/${ID}`,
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
