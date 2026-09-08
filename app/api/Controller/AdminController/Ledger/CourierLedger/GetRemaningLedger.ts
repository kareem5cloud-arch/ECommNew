"use client";
import { postRequest } from "../../../MainController/main";

interface AddRequestFrom {
  courierID: string;
}

export default async function GetCourierLedgerRemainingAmountApi(
  data: AddRequestFrom,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/admin/CourierService/Ledger/GetCourierLedgerRemaning?courierID=${data.courierID}`,
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
