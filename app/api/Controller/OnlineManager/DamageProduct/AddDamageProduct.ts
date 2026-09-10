"use client";
import { postRequest } from "../../MainController/main";

interface AddDamage {
  varientID: string;
  qty: number;
  remarks: string;
  postingDate: string;
}
export default async function AddDamageProductApi(
  data: AddDamage,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/DamageProduct/AddDamageProduct`,
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
