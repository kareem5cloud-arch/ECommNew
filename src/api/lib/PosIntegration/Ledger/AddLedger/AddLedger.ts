"use server";

import { postRequest } from "@/api/authentication/main";
import { ledegrCustoemrAdd } from "@/api/types/PosIntegration/ledger/ledger";
import {
  requestAddSale,
  responseAddSale,
} from "@/api/types/PosIntegration/Sale/Sale";

export default async function AddLedgerCustomer(
  data: ledegrCustoemrAdd,
  token: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  try {
    const response = await postRequest(
      `/api/sale/seller/posIntegration/AddLedegr`,
      data,
      customHeader
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
