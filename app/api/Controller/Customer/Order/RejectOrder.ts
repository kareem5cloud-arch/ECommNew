"use client";

import { postRequest } from "../../MainController/main";

interface Data {
  bagNo: string;
  orderID: string;
  description: string;
}

export default async function CustomerRejectBag(data: Data, token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/OrderManagement/Customer/RejectBag`,
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
