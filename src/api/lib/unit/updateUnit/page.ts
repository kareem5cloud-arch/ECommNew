"use server";
// import { RequestLoginData, ResponseLoginData } from "../types/login";
import {
  RequestUnitUpdateData,
  ResponseUnitUpdateData,
} from "@/api/types/unit/updateUnit";
import { postRequest } from "@/api/authentication/main";

export default async function UpdateUnit(
  data: RequestUnitUpdateData,
  token?: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Category/Units/ModifyUnit`,
    data,
    customHeader
  );
  if (response.success) {
    return {
      data: response.data as ResponseUnitUpdateData,
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
