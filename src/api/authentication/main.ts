import axios from "axios";

const api = axios.create({
  baseURL: "https://sonuspk.premiermegamall.com/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});
import { ApiResponse } from "../types/apiResponse";

async function getRequest<T>(
  url: string,
  params?: any,
  headers?: Record<string, string>,
): Promise<ApiResponse<T>> {
  try {
    const response = await api.get<T>(url, {
      params,
      headers: {
        ...headers,
      },
    });
    return {
      success: true,
      data: response.data,
      status: response.status,
      message: "Request successful",
    };
  } catch (error: any) {
    console.error("GET request error:", error);
    console.log(url);
    console.log(params);
    console.log(headers);
    return {
      success: false,
      error: error?.response?.data || error.message,
      status: error?.response?.status,
      message: "Request failed",
    };
  }
}

async function postRequest<T>(
  url: string,
  data: any,
  headers?: Record<string, string>,
): Promise<ApiResponse<T>> {
  try {
    const response = await api.post<T>(url, data, { headers });
    return {
      success: true,
      data: response.data,
      status: response.status,
      message: "Request successful",
    };
  } catch (error: any) {
    console.error("Post request error:", error);

    return {
      success: false,
      error: error?.response?.data || error.message,
      status: error?.response?.status,
      message: "Request failed",
    };
  }
}

export default api;
export { getRequest, postRequest };
