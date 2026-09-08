"use client";
import { UpdateReview } from "@/app/api/Types/Customer/AddReviewRating";
import { postRequest } from "../../MainController/main";

export default async function UpdateReviewApi(
  data: UpdateReview,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/reviewAndRate/Customer/ModifyReview`,
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
