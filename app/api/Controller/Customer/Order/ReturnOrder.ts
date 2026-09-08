"use client";

import { AddOrderRequest } from "@/app/api/Types/Customer/CheckOut/CustomerOrderPlacement";
import { getRequest, postRequest } from "../../MainController/main";

export default async function CustomerReturnOrder(
  data: AddOrderRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/OrderManagement/Customer/ReturnOrder`,
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
