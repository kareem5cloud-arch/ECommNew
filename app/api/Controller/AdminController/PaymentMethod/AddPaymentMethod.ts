"use client";

import { postRequest } from "../../MainController/main";
import { AddrequestPaymentMethod } from "@/app/api/Types/AdminSetting/PaymentMethod/paymentMethod";

export default async function PaymentMethodAdd(
  data: AddrequestPaymentMethod,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/PaymentMethods/AddPaymnetMethod`,
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
