"use server";
// import { RequestLoginData, ResponseLoginData } from "../types/login";
import {
  RequestSubCatUpdateData,
  ResponseSubCatUpdateData,
} from "@/api/types/categoryTypes/CategorySubUpdate";
import { postRequest } from "@/api/authentication/main";

export default async function UpdateSubCategory(
  data: RequestSubCatUpdateData,
  token?: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Category/Sub/ModifyCategory`,
    data,
    customHeader
  );
  if (response.success) {
    return {
      data: response.data as ResponseSubCatUpdateData,
      status: response.status,
      message: "SubCategory Modified successful",
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
      response.message || "Record Modified failed due to an unexpected error.",
    status: response.status,
  };
}
