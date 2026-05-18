"use server";

import { postRequest } from "@/api/authentication/main";
import {
  AddTill,
  ModifyTill,
} from "@/api/types/MainDashbaord/TillManagement/TillCreate";

export default async function DeleteTillForPos(
  data: { TillID: string },
  token?: string,
) {
  try {
    const customHeader: Record<string, string> = {};
    if (token) customHeader.Authorization = `Bearer ${token}`;

    const response = await postRequest(
      `/api/TillManagement/DeleteTill`,
      data,
      customHeader,
    );

    if (response.success) {
      return {
        data: response.data,
        status: response.status,
        message: response.message || "Record Added Successfully",
      };
    }

    return {
      data: response.data,
      status: response.status,
      message: response.message || "An unexpected error occurred",
    };
  } catch (error: any) {
    return {
      data: error.data,
      status: 500,
      message: error?.message || "Server error",
      success: false,
    };
  }
}
