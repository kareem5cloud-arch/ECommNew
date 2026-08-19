"use client";

import { OnlineOrderApproveAddRequest } from "@/app/api/Types/OnlineSeller/OrderConfiramtion";
import { getRequest, postRequest } from "../../MainController/main";

export default async function OnlineSellerRejectOrder(
  detailID: string,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/OrderManagement/OnlineSeller/RejectOrder?detailID=${detailID}`,
    null,
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
