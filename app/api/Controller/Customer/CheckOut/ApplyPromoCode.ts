"use client";

import { getRequest } from "../../MainController/main";

export default async function ApplyPromoCodeApi(
  data: { code: string },
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await getRequest(
    `/api/admin/Promotion/Customer/ApplyCode?code=${data.code}`,
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
