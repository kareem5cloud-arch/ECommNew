"use client";
import { postRequest } from "../MainController/main";
import { UpdateOrderStratusWareHouse } from "../../Types/WareHouse/OrderConfimration";

interface Data {
  details: details[];
}
interface details {
  bagsNo: string;
  status: string;
  detailID: string;
  videoUrl: string;
}
export default async function WareHouseOrderConfirmation(
  data: Data,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/OrderManagement/WareHouseSeller/Approvebag`,
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
