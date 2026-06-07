"use server";
import { CartData } from "@/app/api/Types/Customer/Cookies/Cart";
import { cookies } from "next/headers";

export async function removeItemFromServerCart(attributeID: string) {
  const cookieStore = await cookies();
  const cart = cookieStore.get("cart")?.value;

  if (!cart) return [];

  const cartItems: CartData[] = JSON.parse(cart);

  const updatedCart = cartItems.filter(
    (item) => item.attributeID !== attributeID,
  );

  cookieStore.set("cart", JSON.stringify(updatedCart), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return updatedCart;
}
