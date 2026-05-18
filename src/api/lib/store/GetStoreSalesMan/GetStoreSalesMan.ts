"use server";

import { getRequest } from "@/api/authentication/main";

export default async function GetInitalStoreSalesMan(token: string) {
  const customHeaders: Record<string, string> = {};
  if (token) customHeaders.Authorization = `Bearer ${token}`;
  const response = await getRequest(
    `/api/Stores/SalesMan/GetInitalStore`,
    null,
    customHeaders
  );
  if (response.success) {
    return {
      data: response.data,
      status: response.status,
      message: " Store get",
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
      response.message || "SubGetCategory failed due to an unexpected error.",
    status: response.status,
  };
}
