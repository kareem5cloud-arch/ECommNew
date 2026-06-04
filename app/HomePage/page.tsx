"use client";

import { useEffect } from "react";
import { useAppContext } from "../useContext";
import CheckoutPage from "./CheckOut/page";
import BannerSlider from "./HompageComponent/CarasoulBanner";
import CategoryShowcaseMinimal from "./HompageComponent/CategroyShowCase";
import FeaturesSection from "./HompageComponent/FeaturedProduct";
import FooterMinimal from "./HompageComponent/Footer";
import MoreDecentProduct from "./HompageComponent/MoreProductYouLike";
import Navbar from "./HompageComponent/Navbar";
import NewArrivals from "./HompageComponent/NewArival";
import ProductDetailPage from "./ProductDetail/page";
import ShopPage from "./Shop/page";

export default function HomePage() {
  const { storeInfo, categroyInfo } = useAppContext();
  // useEffect(() => {
  //   console.log(storeInfo);
  // }, [storeInfo]);
  return (
    <>
      <Navbar categoryData={categroyInfo} storeInfo={storeInfo[0]} />
      {/* <CheckoutPage /> */}
      {/* <ProductDetailPage /> */}
      {/* <ShopPage /> */}
      <BannerSlider storeInfo={storeInfo[0]} />
      {/* <CategoryShowcaseMinimal />
      <NewArrivals />
      <FeaturesSection />
      <MoreDecentProduct /> */}
      <FooterMinimal storeInfo={storeInfo[0]} />
    </>
  );
}
