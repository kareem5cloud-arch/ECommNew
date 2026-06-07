"use server";
import { cookies } from "next/headers";

export async function getServerWishList() {
  const cookieStore = await cookies();
  const cart = cookieStore.get("wishList")?.value;
  return cart ? JSON.parse(cart) : [];
}
