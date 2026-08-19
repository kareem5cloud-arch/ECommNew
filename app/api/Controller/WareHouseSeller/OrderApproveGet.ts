"use client";
import { getRequest, postRequest } from "../MainController/main";

export default async function WareHouseOrderApproveGet(
  storeID: string,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await getRequest(
    `/api/OrderManagement/WareHouseSeller/GetProdut?storeID=${storeID}`,
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
