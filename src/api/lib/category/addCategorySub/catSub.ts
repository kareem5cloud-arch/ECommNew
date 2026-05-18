"use server";
// import { RequestLoginData, ResponseLoginData } from "../types/login";
import {
  RequestSubCatAddData,
  ResponseSubCatAddData,
} from "@/api/types/categoryTypes/CategorySubAdd";
import { postRequest } from "@/api/authentication/main";

export default async function AddSubCategory(
  data: RequestSubCatAddData,
  token?: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Category/Sub/AddCategory`,
    data,
    customHeader
  );
  if (response.success) {
    return {
      data: response.data as ResponseSubCatAddData,
      status: response.status,
      message: "SubCategory Added successful",
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
