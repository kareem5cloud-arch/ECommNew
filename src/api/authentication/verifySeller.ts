// "use server";

import { RequestVerifiData } from "../types/verifiType";
import { postRequest } from "./main";

export default async function VerfiedSeller(
  data: RequestVerifiData,
  token?: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Seller/EmailVerfication`,
    data,
    customHeader
  );
  if (response.success) {
    return {
      data: response.data,
      status: response.status,
      message: "Email Verified successful",
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
      response.message || "Verification failed due to an unexpected error.",
    status: response.status,
  };
}
