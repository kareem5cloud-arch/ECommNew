"use client";

import { postRequest } from "../../MainController/main";

export default async function FreeGetCityApi(
  countryName?: string,
  stateName?: string,
) {
  const data = {
    country: countryName,
    state: stateName,
  };
  const customHeader: Record<string, string> = {};

  const response = await postRequest(
    `https://countriesnow.space/api/v0.1/countries/state/cities`,
    data,
    customHeader,
  );

  return {
    data: response.data,
    status: response.status,
  };
}
