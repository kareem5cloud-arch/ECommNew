"use client";

import { requestAddCourierService } from "@/app/api/Types/AdminSetting/CourierService/CourierService";
import { postRequest } from "../../MainController/main";

export default async function CourierServiceAdd(
  data: requestAddCourierService,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/admin/CourierService/AddCourierService`,
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
