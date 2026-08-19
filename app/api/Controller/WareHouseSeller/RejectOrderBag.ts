"use client";
import { postRequest } from "../MainController/main";

interface Data {
  bagsNo: string;
  description: string;
  lists: lists[];
}
interface lists {
  detailID: string;
  qty: number;
}
export default async function WareHouseRejectBag(data: Data, token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/OrderManagement/WareHouseSeller/RejectBag`,
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
