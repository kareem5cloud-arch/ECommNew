"use client";

import { AddRequestPackageForm } from "@/app/api/Types/AdminSetting/Packages/Packages";
import { postRequest } from "../../MainController/main";

export default async function PackagesDelete(subID: string, token?: string) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/admin/Subscription/DeleteSubscriptionPackage/${subID}`,
    {},
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
