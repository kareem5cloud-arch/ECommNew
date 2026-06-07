"use server";
import { CartData } from "@/app/api/Types/Customer/Cookies/Cart";
import { cookies } from "next/headers";

export async function modifyCartServer(productID: string, qty: number) {
  const cookieStore = await cookies();
  const cart = cookieStore.get("cart")?.value;

  if (!cart) return [];

  const cartItems: CartData[] = JSON.parse(cart);

  const updatedCart = cartItems.map((item) => {
    if (item.attributeID === productID) {
      return {
        ...item,
        qty: qty,
      };
    }
    return item;
  });
  const finalCart = updatedCart.filter((item) => item.qty > 0);

  cookieStore.set("cart", JSON.stringify(finalCart), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return finalCart;
}
