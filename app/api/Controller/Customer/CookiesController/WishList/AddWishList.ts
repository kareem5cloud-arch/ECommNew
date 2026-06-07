"use server";

import { CartData } from "@/app/api/Types/Customer/Cookies/Cart";
import { cookies } from "next/headers";

export async function addToServerWishList(newItems: CartData[]) {
  const cookieStore = await cookies();

  const existingCart = cookieStore.get("wishList");

  let wishList: CartData[] = [];

  if (existingCart?.value) {
    wishList = JSON.parse(existingCart.value);
  }

  for (const newItem of newItems) {
    const existingItem = wishList.find(
      (item) => item.attributeID === newItem.attributeID,
    );

    if (existingItem) {
      existingItem.qty += 0;
    } else {
      wishList.push(newItem);
    }
  }

  cookieStore.set("wishList", JSON.stringify(wishList), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return wishList;
}
