"use server";

import { postRequest } from "@/api/authentication/main";
import {
  RequestExpenseModifyData,
  ResponseExpenseAddData,
} from "@/api/types/PosIntegration/Expense/expense";

export default async function ModifyExpense(
  data: RequestExpenseModifyData,
  token: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  try {
    const response = await postRequest(
      `/api/GeneralExpense/seller/posIntegration/ModifyExpense`,
      data,
      customHeader
    );

    // Success case
    if (response.success) {
      return {
        data: response.data as ResponseExpenseAddData,
        status: response.status,
        message: response.message || "Customer Modified successfully",
      };
    }
    return {
      data: response.data as ResponseExpenseAddData,
      status: response.status,
      message: response.message || "An unexpected error occurred",
    };
  } catch (error: any) {
    return {
      data: error.data as ResponseExpenseAddData,
      status: 500,
      message: error?.message || "Server error",
    };
  }
}
