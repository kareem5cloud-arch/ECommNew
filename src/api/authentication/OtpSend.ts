"use server";

import { getRequest } from "./main";

export default async function OtpSend(token: string) {
  const customHeaders: Record<string, string> = {};
  if (token) customHeaders.Authorization = `Bearer ${token}`;
  const response = await getRequest(
    `/api/Seller/OTPSendViaEmail`,
    null,
    customHeaders
  );
  if (response.success) {
    return {
      data: response.data,
      status: response.status,
    };
  }
  const status = response.status;

  if (status === 400 || status === 401) {
    return {
      data: null,
      message: "Coyld Not Send OTP",
      status,
    };
  }

  if (status === 409) {
    return {
      data: null,
      message: "Account already exists",
      status,
    };
  }

  return {
    data: null,
    message:
      response.message || "Authentaction failed due to an unexpected error.",
    status: response.status,
  };
}
