"use server";
// import { RequestLoginData, ResponseLoginData } from "../types/login";

import { postRequest } from "@/api/authentication/main";
import {
  RequestPaymentUpdateData,
  ResponsePaymentUpdateData,
} from "@/api/types/payment/updatePayment";

export default async function UpdatePaymentApi(
  data: RequestPaymentUpdateData,
  token?: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/PaymentMethod/ModifyPaymnetMethod`,
    data,
    customHeader
  );
  if (response.success) {
    return {
      data: response.data as ResponsePaymentUpdateData,
      status: response.status,
      message: "Payment Modified successful",
    };
  }

  const status = response.status;

  if (status === 400 || status === 401) {
    return {
      data: null,
      message: "Invalid credentials",
      status,
    };
  }

  return {
    data: null,
    message:
      response.message || "Record Modified failed due to an unexpected error.",
    status: response.status,
  };
}
