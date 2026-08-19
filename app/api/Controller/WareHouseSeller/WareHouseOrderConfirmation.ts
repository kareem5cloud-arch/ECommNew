"use client";
import { postRequest } from "../MainController/main";
import { UpdateOrderStratusWareHouse } from "../../Types/WareHouse/OrderConfimration";

export default async function WareHouseOrderConfirmation(
  data: UpdateOrderStratusWareHouse,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/OrderManagement/WareHouseSeller/UpdateOrderStatus`,
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
