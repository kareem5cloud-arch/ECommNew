"use server";

import { getRequest } from "@/api/authentication/main";
import { ProductFetchRepsonse } from "@/api/types/ProductSearchParam/ProductSearchParamTs";


export default async function ProductSearchParam(token: string, word: string) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  try {
    const customHeader: Record<string, string> = {};
    if (token) customHeader.Authorization = `Bearer ${token}`;

    const response = await getRequest(
      `/api/Product/Seller/SearchGetProduct/${word}`,
      {},
      customHeader,
    );

    if (response.success) {
      return {
        data: response.data as ProductFetchRepsonse,
      };
    }

    return {
      data: response.data as ProductFetchRepsonse,
    };
  } catch (error: any) {
    return {
      data: error.data as ProductFetchRepsonse,
    };
  }
}