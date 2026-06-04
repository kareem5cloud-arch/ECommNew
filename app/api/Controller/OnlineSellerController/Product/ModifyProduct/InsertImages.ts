"use client";

import { listImage } from "@/app/api/Types/OnlineSetting/Product/Product";
import { postRequest } from "../../../MainController/main";

export default async function ProductInasertImageApi(
  data: { productID: string; images: listImage[] },
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/ProductManagment/OnlineSeller/ModifyProduct/ImagesAdd/${data.productID}`,
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
