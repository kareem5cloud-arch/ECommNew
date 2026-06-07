"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "../useContext";
import CheckoutPage from "./CheckOut/page";
import BannerSlider from "./HompageComponent/CarasoulBanner";
import CategoryShowcaseMinimal from "./HompageComponent/CategroyShowCase";
import FeaturesSection from "./HompageComponent/PlatformFeatured";
import FooterMinimal from "./HompageComponent/Footer";
import MoreDecentProduct from "./HompageComponent/MoreProductYouLike";
import Navbar from "./HompageComponent/Navbar";

import { getServerCart } from "../api/Controller/Customer/CookiesController/Cart/GetCart";
import { CartData } from "../api/Types/Customer/Cookies/Cart";
import { getServerWishList } from "../api/Controller/Customer/CookiesController/WishList/GetWishList";
import FeaturedProduct from "./HompageComponent/FeaturedProduct";

export default function HomePage() {
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
  };
  const onCallFunctionWishList = async () => {
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
      {/* <CheckoutPage /> */}
      {/* <ProductDetailPage /> */}
      {/* <ShopPage /> */}
      <BannerSlider storeInfo={storeInfo[0]} />
      <CategoryShowcaseMinimal categroyMainInfo={categroyMainInfo} />
      <FeaturedProduct
        ProductData={ProductData}
        loading={productLoading}
        functionCalling={onCallFunction}
        functionCallingWishList={onCallFunctionWishList}
      />
      <FeaturesSection />
      <MoreDecentProduct
        ProductData={ProductData}
        loading={productLoading}
        functionCalling={onCallFunction}
      />
      <FooterMinimal storeInfo={storeInfo[0]} categroyMainInfo={categroyInfo} />
    </>
  );
}
