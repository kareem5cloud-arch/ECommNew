"use server";

import { CartData } from "@/app/api/Types/Customer/Cookies/Cart";
import { cookies } from "next/headers";

export async function addToServerCart(newItems: CartData[]) {
  const cookieStore = await cookies();

  const existingCart = cookieStore.get("cart");

  let cart: CartData[] = [];

  if (existingCart?.value) {
    cart = JSON.parse(existingCart.value);
  }

  for (const newItem of newItems) {
    const existingItem = cart.find(
      (item) => item.attributeID === newItem.attributeID,
    );

    if (existingItem) {
      existingItem.qty += newItem.qty; // or += 1
    } else {
      cart.push(newItem);
    }
  }

  cookieStore.set("cart", JSON.stringify(cart), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return cart;
}
