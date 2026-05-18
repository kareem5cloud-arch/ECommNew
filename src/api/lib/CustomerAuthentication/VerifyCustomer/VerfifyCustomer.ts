// "use server";

import { postRequest } from "@/api/authentication/main";
import { RequestVerifiData } from "@/api/types/verifiType";

export default async function VerfiedCustomer(
  email: string,
  data: RequestVerifiData,
  token?: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/CustomerAuthentication/Customer/EmailVerfication/${email}`,
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
