"use client";

import { getRequest } from "../../MainController/main";

export default async function CheckAuth(token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await getRequest(
    `/api/SellerAuthentication/checkAuth`,
    null,
    customHeader,
  );

  return {
    data: response.data,
    status: response.status,
  };
}
