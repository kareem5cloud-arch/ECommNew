"use client";
import { getServerCart } from "@/app/api/Controller/Customer/CookiesController/Cart/GetCart";
import { getServerWishList } from "@/app/api/Controller/Customer/CookiesController/WishList/GetWishList";
import { CartData } from "@/app/api/Types/Customer/Cookies/Cart";
import Footer from "@/app/HomePage/HompageComponent/Footer";
import Navbar from "@/app/HomePage/HompageComponent/Navbar";
import { useAppContext } from "@/app/useContext";
import { useEffect, useState } from "react";
import MainContentPage from "./MainContentPage";

export default function CheckoutPageComponent() {
  const {
    storeInfo,
    categroyInfo,
    categroyMainInfo,
    ProductData,
    productLoading,
  } = useAppContext();

  const [cart, setCart] = useState<CartData[]>([]);
  const [wishList, setWishList] = useState<CartData[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);

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
  const onCallFunction = async () => {
    await getCartValue();
    await getWishListValue();
  };
  useEffect(() => {
    onCallFunction();
  }, []);
  return (
    <>
      <div>
        <Navbar
          categoryData={categroyInfo}
          storeInfo={storeInfo[0]}
          cartList={cart}
          setCategoryID={() => {}}
          wishList={wishList}
          setChangeMade={() => {}}
          authOn={loggedIn}
          onClickCall={onCallFunction}
        />
        <MainContentPage setLoggedIn={setLoggedIn} />
        <Footer storeInfo={storeInfo[0]} categroyMainInfo={categroyInfo} />
      </div>
    </>
  );
}
