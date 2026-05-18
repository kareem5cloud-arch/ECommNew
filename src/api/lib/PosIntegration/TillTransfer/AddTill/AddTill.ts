"use server";

import { postRequest } from "@/api/authentication/main";
import {
  requestAddSale,
  responseAddSale,
} from "@/api/types/PosIntegration/Sale/Sale";
import { requestTransferTill } from "@/api/types/PosIntegration/TillTransfer/TillTansfer";

export default async function AddTillTransferPosSale(
  data: requestTransferTill,
  token: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  try {
    const response = await postRequest(
      `/api/TillTransfer/TransferTill/AddTill`,
      data,
      customHeader,
    );

    // Success case
    if (response.success) {
      return {
        data: response.data as responseAddSale,
        status: response.status,
        message: response.message || "Record Added successfully",
      };
    }
    return {
      data: response.data as responseAddSale,
      status: response.status,
      message: response.message || "An unexpected error occurred",
    };
  } catch (error: any) {
    return {
      data: error.data as responseAddSale,
      status: 500,
      message: error?.message || "Server error",
    };
  }
}
