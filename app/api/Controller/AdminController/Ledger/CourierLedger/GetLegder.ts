"use client";
import { postRequest } from "../../../MainController/main";

interface AddRequestFrom {
  courierID: string;
  dateTo: string;
  dateFrom: string;
}

export default async function GetCourierLedgerApi(
  data: AddRequestFrom,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/admin/CourierService/Ledger/GetCourierLedger?courierID=${data.courierID}&dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`,
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
