"use server";
import { getRequest } from "./main";

export default async function SellerVerificationApi(token: string) {
  const customHeaders: Record<string, string> = {};
  if (token) customHeaders.Authorization = `Bearer ${token}`;
  const response = await getRequest(
    `/api/Seller/SellerVerification`,
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
      message: "InValid Token User",
      status,
    };
  }

  if (status === 409) {
    return {
      data: null,
      message: "Account already Verified",
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
