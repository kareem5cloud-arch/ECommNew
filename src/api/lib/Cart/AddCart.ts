"use server";

import { getRequest, postRequest } from "@/api/authentication/main";
import { CartData, CartData2 } from "@/api/types/Cart/CartData";
import { cookies } from "next/headers";

export async function addToServerCart(item: CartData[]) {
  const cookieStore = await cookies();
  cookieStore.set("cart", JSON.stringify(item), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return { success: true };
}

export async function AddToCart(data: CartData2, token?: string) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/customerProduct/Customer/AddCart`,
    data,
    customHeader
  );
  if (response.success) {
    return {
      data: response.data,
      status: response.status,
      message: "Add To Cart successful",
    };
  }

  const status = response.status;

  if (status === 400 || status === 401) {
    return {
      data: null,
      message: "Invalid credentials",
      status,
    };
  }

  return {
    data: null,
    message:
      response.message || "Record Added failed due to an unexpected error.",
    status: response.status,
  };
}

export async function getServerCart() {
  const cookieStore = await cookies();
  const cart = cookieStore.get("cart")?.value;
  return cart ? JSON.parse(cart) : [];
}

export async function clearServerCart() {
  const cookieStore = await cookies();
  cookieStore.set("cart", "", {
    path: "/",
    maxAge: 0,
  });
  return [];
}

export async function removeItemFromServerCart(productID: string) {
  const cookieStore = await cookies();
  const cart = cookieStore.get("cart")?.value;

  if (!cart) return [];

  const cartItems: CartData[] = JSON.parse(cart);

  const updatedCart = cartItems.filter((item) => item.productID !== productID);

  cookieStore.set("cart", JSON.stringify(updatedCart), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return updatedCart;
}

export async function RemoveFromCart(data: string, token?: string) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await getRequest(
    `/api/customerProduct/Customer/DeleteCart/${data}`,
    null,
    customHeader
  );
  if (response.success) {
    return {
      data: response.data,
      status: response.status,
      message: "Item Deleted successfully",
    };
  }

  const status = response.status;

  if (status === 400 || status === 401) {
    return {
      data: null,
      message: "Invalid credentials",
      status,
    };
  }

  return {
    data: null,
    message:
      response.message || "Record Deleted failed due to an unexpected error.",
    status: response.status,
  };
}

export async function modifyCartServer(productID: string, qty: number) {
  const cookieStore = await cookies();
  const cart = cookieStore.get("cart")?.value;

  if (!cart) return [];

  const cartItems: CartData[] = JSON.parse(cart);

  const updatedCart = cartItems.map((item) => {
    if (item.productID === productID) {
      return {
        ...item,
        quantity: qty,
      };
    }
    return item;
  });
  const finalCart = updatedCart.filter((item) => item.quantity > 0);

  cookieStore.set("cart", JSON.stringify(finalCart), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return finalCart;
}

export async function ModifyFromCart(
  data: string,
  qty: number,
  token?: string
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/customerProduct/Customer/ModifyCart/${data}/${qty}`,
    null,
    customHeader
  );
  if (response.success) {
    return {
      data: response.data,
      status: response.status,
      message: "Item Updated successfully",
    };
  }

  const status = response.status;

  if (status === 400 || status === 401) {
    return {
      data: null,
      message: "Invalid credentials",
      status,
    };
  }

  return {
    data: null,
    message:
      response.message || "Record Deleted failed due to an unexpected error.",
    status: response.status,
  };
}
