//"use client";
/*
Code by @Adil Dated: 2-2-26

*/
import { postRequest } from "@/api/authentication/main";

export default async function AddSalesman(
  salesmanName: string,
  token: string
) {
  const response = await postRequest(
    "/api/sale/MainDashboard/AddSalesman",
    JSON.stringify({ salesmanName }),
    {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  );

  if (response.success) {
    return {
      status: response.status,
      message: "Salesman Added Successfully",
    };
  }

  return {
    status: response.status || 500,
    message: response.message || "Failed to add salesman.",
  };
}

