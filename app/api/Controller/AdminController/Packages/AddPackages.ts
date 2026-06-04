"use client";

import { AddRequestPackageForm } from "@/app/api/Types/AdminSetting/Packages/Packages";
import { postRequest } from "../../MainController/main";

export default async function PackagesAdd(
  data: AddRequestPackageForm,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/admin/Subscription/AddSubscriptionPackage`,
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
