"use client";

import { requestUpdateCourierService } from "@/app/api/Types/AdminSetting/CourierService/CourierService";
import { postRequest } from "../../MainController/main";

export default async function CourierServiceModify(
  data: requestUpdateCourierService,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/admin/CourierService/ModifyCourierService`,
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
