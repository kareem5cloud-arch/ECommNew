"use server";
import { cookies } from "next/headers";

export async function getServerCart() {
  const cookieStore = await cookies();
  const cart = cookieStore.get("cart")?.value;
  return cart ? JSON.parse(cart) : [];
}
