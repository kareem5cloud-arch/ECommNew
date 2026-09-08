"use client";

import { getRequest, postRequest } from "../../MainController/main";

interface Data {
  bagNo: string;
  description: string;
  promoCode: string;
  startDate: string;
  expiryDate: string;
  amount: number;
  orderType: string;
  customerID: string;
  status: string;
  orderDetail: orderDetail;
}
interface orderDetail {
  varientID: string;
  qty: number;
  rate: number;
}

export default async function AddOrderExchangeCouponAPi(
  data: Data,
  token?: string,
) {
  const customHeader: Record<string, string> = {};

  if (token) {
    customHeader.Authorization = `Bearer ${token}`;
  }

  const response = await postRequest(
    `/api/OrderManagement/OnlineSeller/ReturnExchangeCoupon`,
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
