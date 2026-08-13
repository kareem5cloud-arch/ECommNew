"use client";

import { postRequest } from "../../MainController/main";
import { AddOrderRequest } from "@/app/api/Types/Customer/CheckOut/CustomerOrderPlacement";

export default async function CustomerOrderAdd(
  data: AddOrderRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/OrderManagement/Customer/AddOrder`,
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
