"use client";

import { postRequest } from "../../../../MainController/main";

interface AddVaraints {
  supplierID: string;
  productID: string;
  totalBill: number;
  amountPaid: number;
  listVarient: listVarient[];
}
interface listVarient {
  qty: number;
  costPrice: number;
  salePrice: number;
  barcode: string;
  attributeList: attributeList[];
  imageUrl: listImage[];
}
export interface listImage {
  url: string;
  urlID?: string;
}
export interface attributeList {
  attributeID: string;
}
export default async function ProductAddVariantsApi(
  data: AddVaraints,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/ProductManagment/PurcahserLogin/ModifyProduct/VariantsAdd`,
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
