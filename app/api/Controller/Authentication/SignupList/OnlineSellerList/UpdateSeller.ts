"use client";

import { postRequest } from "../../../MainController/main";
import { SignupRequest } from "@/app/api/Types/Authentication/login";

export default async function ModifySeller(
  sellerID: string,
  data: SignupRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/SellerAuthentication/ModifySignUp?sellerID=${sellerID}`,
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
