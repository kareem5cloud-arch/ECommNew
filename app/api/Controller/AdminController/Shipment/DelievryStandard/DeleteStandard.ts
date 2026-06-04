"use client";
import { postRequest } from "../../../MainController/main";

export default async function DelievryStandardDeleteApi(
  deliveryTypeID: string,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/DelievryStandard/admin/DeleteDelievryStandard/${deliveryTypeID}`,
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
