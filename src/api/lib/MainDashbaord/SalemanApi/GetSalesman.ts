//"use server";
/*
Code by @Adil Dated: 2-2-26

*/
import { getRequest } from "@/api/authentication/main";

export default async function GetSalesman(token: string) {
  const response = await getRequest(
    "/api/sale/MainDashboard/GetSalesman",
    undefined, // 👈 params
    {
      Authorization: `Bearer ${token}`,
    }
  );

  if (response.success) {
    return {
      status: response.status,
      data: response.data,
    };
  }

  return {
    status: response.status || 500,
    data: null,
    message: response.message || "Failed to fetch salesman",
  };
}
