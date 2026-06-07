"use client";
import Navbar from "@/app/HomePage/HompageComponent/Navbar";
import ShopPage from "./Shop";
import { useEffect, useState } from "react";
import { getServerWishList } from "@/app/api/Controller/Customer/CookiesController/WishList/GetWishList";
import { getServerCart } from "@/app/api/Controller/Customer/CookiesController/Cart/GetCart";
import { CartData } from "@/app/api/Types/Customer/Cookies/Cart";
import { useAppContext } from "@/app/useContext";
import Footer from "@/app/HomePage/HompageComponent/Footer";

export default function ShopMainComponent() {
  const [cart, setCart] = useState<CartData[]>([]);
  const [wishList, setWishList] = useState<CartData[]>([]);
  const {
    storeInfo,
    categroyInfo,
    categroyMainInfo,
    ProductData,
    productLoading,
  } = useAppContext();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, []);
  const getCartValue = async () => {
    const data = await getServerCart();
    setCart(
      data.map((item: any) => ({
        attributeID: item.attributeID,
        qty: item.qty,
      })),
    );
  };
  const getWishListValue = async () => {
    const data = await getServerWishList();
    setWishList(
      data.map((item: any) => ({
        attributeID: item.attributeID,
        qty: item.qty,
      })),
    );
  };
  useEffect(() => {
    getCartValue();
    getWishListValue();
  }, []);

  const onCallFunction = async () => {
    await getCartValue();
    await getWishListValue();
  };
  return (
    <>
      <Navbar
        categoryData={categroyInfo}
        storeInfo={storeInfo[0]}
        cartList={cart}
        wishList={wishList}
        onClickCall={onCallFunction}
        productData={ProductData}
      />
      <ShopPage functionCalling={onCallFunction} />
      <Footer storeInfo={storeInfo[0]} categroyMainInfo={categroyInfo} />
    </>
  );
}
