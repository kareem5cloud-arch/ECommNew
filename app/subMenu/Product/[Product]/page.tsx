"use client";
import { getServerCart } from "@/app/api/Controller/Customer/CookiesController/Cart/GetCart";
import { getServerWishList } from "@/app/api/Controller/Customer/CookiesController/WishList/GetWishList";
import { CartData } from "@/app/api/Types/Customer/Cookies/Cart";
import Footer from "@/app/HomePage/HompageComponent/Footer";
import Navbar from "@/app/HomePage/HompageComponent/Navbar";
import { useAppContext } from "@/app/useContext";
import { useEffect, useState } from "react";
import ProductInformation from "./ProductInformation";
import SuggestedForYou from "./SuggestedForYou";
import YouMightLikeThis from "./YouMightLikeThis";

export default function Product() {
  const [cart, setCart] = useState<CartData[]>([]);
  const [wishList, setWishList] = useState<CartData[]>([]);
  const [subcatID, setSubCatID] = useState("");
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
        setCategoryID={() => ""}
        setChangeMade={() => ""}
        //productData={ProductData}
      />
      <ProductInformation
        functionCalling={onCallFunction}
        returnCategroySubID={setSubCatID}
      />
      {/* <YouMightLikeThis
        onClickCall={onCallFunction}
        ProductData={ProductData}
        subID={subcatID}
      />
      <SuggestedForYou onClickCall={onCallFunction} ProductData={ProductData} /> */}
      <Footer storeInfo={storeInfo[0]} categroyMainInfo={categroyInfo} />
    </>
  );
}
