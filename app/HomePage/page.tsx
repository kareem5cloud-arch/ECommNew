"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "../useContext";
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
import Spinner from "../ui/UseFulLComponent/Spinner/Spinner";

export default function HomePage() {
  const [cart, setCart] = useState<CartData[]>([]);
  const [wishList, setWishList] = useState<CartData[]>([]);
  const [categoryID, setCategoryID] = useState("");
  const [changeMade, setChangeMade] = useState("");
  const [showEmptyScreen, setShowEmptyScreen] = useState(false);
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
  useEffect(() => {
    if (changeMade) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      const timer = setTimeout(() => {
        setChangeMade("");
        setShowEmptyScreen(false);
      }, 1500);

      // Cleanup timer
      return () => clearTimeout(timer);
    }
  }, [changeMade]);
  // Add this useEffect to handle scroll locking
  useEffect(() => {
    if (showEmptyScreen) {
      // Hide scrollbar and prevent scrolling
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "15px"; // Prevent layout shift
    } else {
      // Restore scrolling
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }

    // Cleanup
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [showEmptyScreen]);
  return (
    <>
      {showEmptyScreen && (
        <>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/80" />
            <div className="flex gap-2">
              <div
                className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </>
      )}
      <>
        <Navbar
          categoryData={categroyInfo}
          storeInfo={storeInfo[0]}
          cartList={cart}
          setCategoryID={setCategoryID}
          wishList={wishList}
          setChangeMade={setChangeMade}
          onClickCall={onCallFunction}
        />
        {/* <CheckoutPage /> */}
        {/* <ProductDetailPage /> */}
        {/* <ShopPage /> */}
        <BannerSlider storeInfo={storeInfo[0]} />
        <CategoryShowcaseMinimal
          categroyMainInfo={categroyMainInfo}
          ID={categoryID}
        />
        <FeaturedProduct
          ProductData={ProductData}
          loading={productLoading}
          functionCalling={onCallFunction}
          functionCallingWishList={onCallFunctionWishList}
          ID={categoryID}
        />
        <FeaturesSection />
        <MoreDecentProduct
          ProductData={ProductData}
          loading={productLoading}
          functionCalling={onCallFunction}
          ID={categoryID}
        />
        <FooterMinimal
          storeInfo={storeInfo[0]}
          categroyMainInfo={categroyInfo}
        />
      </>
    </>
  );
}
