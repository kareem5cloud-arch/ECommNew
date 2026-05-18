"use server";

import { postRequest } from "@/api/authentication/main";
import {
  RequestPaymentAddData,
  ResponsePaymentAddData,
} from "@/api/types/payment/addPayment";

export default async function AddPayment(
  data: RequestPaymentAddData,
  token?: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/PaymentMethod/AddPaymnetMethod`,
    data,
    customHeader
  );
  if (response.success) {
    return {
      data: response.data as ResponsePaymentAddData,
      status: response.status,
      message: "Payment Added successfully",
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
      response.message || "Record Added failed due to an unexpected error.",
    status: response.status,
  };
}
