"use server";

import { postRequest } from "@/api/authentication/main";
import {
  RequestStoreAddData,
  ResponseStoreAddData,
} from "@/api/types/Store/addStore";

export default async function StoreCreation(
  data: RequestStoreAddData,
  token?: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Stores/CreateStore`,
    data,
    customHeader
  );
  if (response.success) {
    return {
      data: response.data as ResponseStoreAddData,
      status: response.status,
      message: "Store Added successfully",
    };
  }

  const status = response.status;

  if (status === 400 || status === 401) {
    return {
      data: null,
      message: "Invalid credentials",
      status,
    };
  }

  return {
    data: null,
    message:
      response.message || "Record Added failed due to an unexpected error.",
    status: response.status,
  };
}
