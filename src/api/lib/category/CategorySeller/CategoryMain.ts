"use server";

import { getRequest } from "@/api/authentication/main";

export default async function GetCategoryMain(token: string) {
  const customHeaders: Record<string, string> = {};
  if (token) customHeaders.Authorization = `Bearer ${token}`;
  const response = await getRequest(
    `/api/Category/Admin/GetCategoryMain`,
    null,
    customHeaders
  );
  if (response.success) {
    return {
      data: response.data,
      status: response.status,
      message: "Authorize User",
    };
  }
  const status = response.status;

  if (status === 400 || status === 401) {
    return {
      data: null,
      message: "UnAuthorize User",
      status,
    };
  }

  if (status === 409) {
    return {
      data: null,
      message: "Conflict Error",
      status,
    };
  }

  return {
    data: null,
    message:
      response.message || "GetCategoryMain failed due to an unexpected error.",
    status: response.status,
  };
}
