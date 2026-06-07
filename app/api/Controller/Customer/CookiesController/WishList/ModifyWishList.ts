"use server";
import { CartData } from "@/app/api/Types/Customer/Cookies/Cart";
import { cookies } from "next/headers";

export async function modifyCartServer(productID: string, qty: number) {
  const cookieStore = await cookies();
  const wishList = cookieStore.get("wishList")?.value;

  if (!wishList) return [];

  const cartItems: CartData[] = JSON.parse(wishList);

  const updatedwishList = cartItems.map((item) => {
    if (item.attributeID === productID) {
      return {
        ...item,
        qty: qty,
      };
    }
    return item;
  });
  const finalwishList = updatedwishList.filter((item) => item.qty > 0);

  cookieStore.set("wishList", JSON.stringify(finalwishList), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return finalwishList;
}
