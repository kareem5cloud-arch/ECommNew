"use client";
import { ApproveOrderStatus } from "@/app/api/Types/OnlineSeller/OrderConfiramtion";
import { postRequest } from "../../MainController/main";

export default async function OnlineSellerApproveOrder(
  data: ApproveOrderStatus,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/OrderManagement/OnlineSeller/UpdateOrderStatus`,
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
