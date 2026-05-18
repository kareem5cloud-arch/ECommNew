"use server";

import {
  RequestSubAddData,
  ResponseSubAddData,
} from "@/api/types/subCategory/addSub";
import { postRequest } from "@/api/authentication/main";

export default async function FurterSub(
  data: RequestSubAddData,
  token?: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Category/Sub/FurtherSub/AddCategory`,
    data,
    customHeader
  );
  if (response.success) {
    return {
      data: response.data as ResponseSubAddData,
      status: response.status,
      message: "Sub Category Added successfully",
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
