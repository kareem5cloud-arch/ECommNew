"use client";

import { getRequest } from "../../../MainController/main";

export default async function ProductDataByWord(word: string, token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await getRequest(
    `/api/ProductManagment/Customer/SearchGetProduct?word=${word}`,
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
