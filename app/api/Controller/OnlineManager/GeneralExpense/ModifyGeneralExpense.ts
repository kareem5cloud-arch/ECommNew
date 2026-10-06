"use client";
import { postRequest } from "../../MainController/main";

interface AddDamage {
  expenseID: string;
  expenseName: string;
  expenseDate: string;
  expenseAmount: number;
  expenseCategory: string;
  remarks: string;
}
export default async function ModifyGeneralExpenseApi(
  data: AddDamage,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/GeneralExpense/ModifyGeneralExpense`,
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
