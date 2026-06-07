"use client";

import { SignupRequest } from "@/app/api/Types/Authentication/login";
import { postRequest } from "../../MainController/main";

export default async function CustomerSignupApi(
  data: SignupRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/Authentication/Customer/SignUp`,
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
