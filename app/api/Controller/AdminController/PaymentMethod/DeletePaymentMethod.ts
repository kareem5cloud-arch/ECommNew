"use client";

import { postRequest } from "../../MainController/main";

export default async function PaymentMethodDelete(ID: string, token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/PaymentMethods/DeletePaymnetMethod/${ID}`,
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
