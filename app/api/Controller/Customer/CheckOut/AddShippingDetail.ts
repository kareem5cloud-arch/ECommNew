"use client";

import { AddShippingDetailCustoemr } from "@/app/api/Types/Customer/CheckOut/ShippingDeatail";
import { getRequest, postRequest } from "../../MainController/main";

export default async function CustomerShippingDetailAdd(
  data: AddShippingDetailCustoemr,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/OrderManagement/Customer/AddShippingDetails`,
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
