"use client";
import { postRequest } from "../MainController/main";

interface Data {
  bagsID: string;
  qty: number;
  detailID: string;
  description: string;
}
export default async function WareHouseRejectItem(data: Data, token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/OrderManagement/WareHouseSeller/RejectItem`,
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
