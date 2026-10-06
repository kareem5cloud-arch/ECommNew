"use client";
import { postRequest } from "../../MainController/main";

interface AddDamage {
  expenseID: string;
}
export default async function DeleteGeneralExpenseApi(
  data: AddDamage,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/GeneralExpense/DeleteGeneralExpense?expenseID=${data.expenseID}`,
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
