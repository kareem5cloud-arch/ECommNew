"use client";
import { postRequest } from "../MainController/main";

interface Data {
  courierID: string;
  bagNo: string;
  shippingCharges: number;
  totalBill: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
}
export default async function WareHouseShipOrder(data: Data, token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/OrderManagement/WareHouseSeller/ShippedBag`,
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
