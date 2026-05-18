"use server";

import { getRequest, postRequest } from "@/api/authentication/main";

export default async function GetUnitByID(token: string, data: {}) {
  const customHeaders: Record<string, string> = {};
  if (token) customHeaders.Authorization = `Bearer ${token}`;
  const response = await postRequest(
    `/api/Category/getUnitsByID`,
    data,
    customHeaders
  );
  if (response.success) {
    return {
      data: response.data,
      status: response.status,
      message: "Unit User",
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
    message: response.message || "Unit failed due to an unexpected error.",
    status: response.status,
  };
}
