"use client";

import { postRequest } from "../../MainController/main";

export default async function FreeGetStateApi(countryName?: string) {
  const data = {
    country: countryName,
  };
  const customHeader: Record<string, string> = {};

  const response = await postRequest(
    `https://countriesnow.space/api/v0.1/countries/states`,
    data,
    customHeader,
  );

  return {
    data: response.data,
    status: response.status,
  };
}
