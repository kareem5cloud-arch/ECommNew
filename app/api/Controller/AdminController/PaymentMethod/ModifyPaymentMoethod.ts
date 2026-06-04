"use client";

import { postRequest } from "../../MainController/main";
import { ModifyrequestPaymentMethod } from "@/app/api/Types/AdminSetting/PaymentMethod/paymentMethod";

export default async function PaymentMethodModify(
  data: ModifyrequestPaymentMethod,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/PaymentMethods/ModifyPaymnetMethod`,
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
