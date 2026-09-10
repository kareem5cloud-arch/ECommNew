"use client";
import { postRequest } from "../../MainController/main";

interface AddDamage {
  dID: string;
  varientID: string;
  qty: number;
  remarks: string;
  postingDate: string;
}
export default async function ModifyDamageProductApi(
  data: AddDamage,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/DamageProduct/ModifyDamageProduct`,
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
