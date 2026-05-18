"use client";
import { useEffect, useMemo, useState } from "react";

import {
  ShoppingCart,
  Heart,
  ChevronDown,
  CreditCard,
  Minus,
  Plus,
  ChevronRight,
  X,
  ArrowRight,
  FilterIcon,
  Info,
} from "lucide-react";
import Image from "next/image";
import Footer from "@/component/Footer/page";
import Navbar from "@/component/Navbar/page";

import { CartData } from "@/api/types/Cart/CartData";
import {
  GetProductHomeApiResponse,
  ProductHomePage,
} from "@/api/types/HomePage/Product/product";
import GetProductHome from "@/api/lib/HomePage/Product/Product";
import {
  Category,
  NavbarApiResponse,
} from "@/api/types/HomePage/Navbar/Navbar";
import GetNavbar from "@/api/lib/HomePage/Navbar/Navbar";
import Spinner from "@/component/spinner/page";
import ProductSkeleton from "../../Home/reveal";
import { Varient } from "@/api/types/product/AddVarient";
import {
  AddToCart,
  addToServerCart,
  clearServerCart,
  getServerCart,
} from "@/api/lib/Cart/AddCart";
import CheckAuth from "@/api/authentication/checkAuth";
import { useParams } from "next/navigation";
const images = ["/collection1.jpg", "/collection2.jpg", "/collection3.jpg"];

interface ImagesList {
  listImage: urlTypes[];
}
type urlTypes = {
  urlID?: string;
  url: string;
};
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
export default function Shop() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [productID, setProductID] = useState("");
  const [product, setProduct] = useState<ProductHomePage[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [attributeID, setAttributeID] = useState("");
  const [sortType, setSortType] = useState<string | null>(null);
  const [uploading, setUplaoding] = useState(false);
  const [NumberofProduct, setNumberofProduct] = useState(0);
  const [Filter, setFilters] = useState(false);
  const [Open, setOpen] = useState(false);
  const [activePage, setActivePage] = useState("login");
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [productPage, setProductPage] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cartList, setCartList] = useState<CartData[]>([]);
  const [productList, setProductList] = useState<ProductHomePage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productName, setProductName] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [listVarient, setListVarient] = useState<Varient[]>([]);
  const [listImages, setListImages] = useState<ImagesList>({ listImage: [] });
  const [loading1, setLoading1] = useState(false);
  const [selectedAttributeID, setSelectedAttributeID] = useState("");
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    [],
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const getProduct = async () => {
    if (loading1) return;

    try {
      setLoading1(true);

      const token = localStorage.getItem("token") ?? "";
      const response = await GetProductHome(token);

      if (response.status === 200 || response.status === 201) {
        const data = response.data as GetProductHomeApiResponse;
        console.log(data);
        setProductList(data.productList);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading1(false);
    }
  };
  useEffect(() => {
    handleShowCategories();
    getProduct();
  }, []);

  useEffect(() => {
    const qid = searchParams.get("qID");
    if (qid) {
      setSelectedSubCategories((prev) => {
        if (!prev.includes(qid)) {
          return [...prev, qid];
        }
        return prev;
      });
    }
    if (params && !Array.isArray(params.Shop)) {
      setSelectedCategoryId(params.Shop || null);
    } else {
      setSelectedCategoryId(null);
    }
  }, [params, searchParams]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategoryId) return [];
    return productList
      .filter((product) => {
        if (product.storeSale === "OfflineStore") return false;
        if (product.subCategoryID !== selectedCategoryId) return false;

        if (
          selectedSubCategories.length > 0 &&
          !selectedSubCategories.includes(product.subCategoryDetailID)
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (!sortType) return 0;

        const priceA = Number(a.variants[0]?.variantValues[0]?.salePrice || 0);
        const priceB = Number(b.variants[0]?.variantValues[0]?.salePrice || 0);

        switch (sortType) {
          case "Price: High to Low":
            return priceB - priceA;
          case "Price: Low to High":
            return priceA - priceB;
          case "Alphabetic: A-Z":
            return a.productName.localeCompare(b.productName);
          case "Alphabetic: Z-A":
            return b.productName.localeCompare(a.productName);
          default:
            return 0;
        }
      });
  }, [productList, selectedCategoryId, selectedSubCategories, sortType]);

  const handleSubCategoryChange = (id: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };
  const handleShowCategories = async () => {
    const token = localStorage.getItem("token");
    const response = await GetNavbar(token || "");
    const data = response.data as NavbarApiResponse;
    if (response.status === 200 || response.status === 201) {
      setCategories(data?.categoryList ?? []);
    } else {
      setCategories([]);
    }
  };

  const handleSort = (type: string) => {
    setSortType(type);
    setOpen(false);
  };

  useEffect(() => {
    if (!productID) return;
    const data = productList.filter((item) => item.productID === productID);
    if (data) {
      console.log(data);
      setProduct(data);
      const allVariantValues = data.flatMap((product) =>
        product.variants.flatMap((variant) => variant.variantValues),
      );
      if (allVariantValues) {
        setSelectedAttributeID(allVariantValues[0].attributeID);
      }

      const allImages = data.find((item) => item.productID === productID);
      setImageUrl(allImages?.images[0].url || "");
      const firstAvailableVariant = allVariantValues.find((v) => v.qty > 0);
      if (firstAvailableVariant) {
        setAmount(String(firstAvailableVariant.salePrice));
      } else {
        setAmount("0"); // fallback if none available
      }
    }
  }, [productID]);

  // const fetchData = (productID: string) => {
  //   const data = productList.filter((item) => item.productID === productID);
  //   if (data) {
  //     console.log(data);
  //     setProduct(data);
  //   }
  // };

  const checkAuth = async (ID: string) => {
    const token1 = localStorage.getItem("token1");
    console.log(token1);
    const response = await CheckAuth(token1 as string);
    // console.log(token1);
    console.log("Response from CheckAuth API:", response);
    if (response?.status === 200 || response?.status === 201) {
      const data = response.data as any;
      if (data.loggedBy === "Customer") {
        setUplaoding(true);
        const data = productList.find((item) => item.productID === ID);
        const token = localStorage.getItem("token1");
        if (data) {
          const formData = {
            productID: data.productID,
            qty: 1,
          };
          await AddToCart(formData, String(token));
        }
      } else {
        setUplaoding(false);
      }
    }
  };
  const addToCart = async (ID: string) => {
    try {
      setUplaoding(true);
      setProductID(ID);
      const data = productList.find((item) => item.productID === ID);
      if (!data) return;

      // Find the selected variant attribute based on attributeID in state
      let selectedVariantAttribute = null;
      let varientValue = "";
      for (const variant of data.variants) {
        const foundAttr = variant.variantValues.find(
          (attr) => attr.attributeID === selectedAttributeID,
        );
        if (foundAttr) {
          selectedVariantAttribute = foundAttr;
          varientValue = foundAttr.varientValue;
          break;
        }
      }

      // Fallback price if attribute not found
      const price = selectedVariantAttribute
        ? selectedVariantAttribute.salePrice
        : data.variants[0].variantValues[0].salePrice;

      const newItem: CartData = {
        productID: data.productID,
        productName: data.productName,
        weight: data.weight,
        storeID: data.storeID,
        storeName: data.storeName,
        description: data.description,
        quantity: NumberofProduct,
        varinetID: selectedAttributeID,
        varinetName: varientValue,
        discount: data.discount,
        salePrice: price,
        image: data.images?.[0]?.url,
      };

      const currentCart = await getServerCart();
      setUplaoding(false);
      const updatedCart = [...currentCart, newItem];

      const res = await addToServerCart(updatedCart);
      if (res) {
        checkAuth(ID);
      }
      serverCartData();
      setCartList(updatedCart);
    } catch (error) {
      setUplaoding(false);
      console.log(error);
    } finally {
      setUplaoding(false);
    }
  };

  const serverCartData = async () => {
    const cart = await getServerCart();
    setCartList(cart);
  };

  const onClear = async () => {
    await clearServerCart();
    const freshCart = await getServerCart();
    setCartList(freshCart);
  };
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar
          onPageChange={(page) => console.log("Navigate to:", page)}
          SubCategoryID={(page) => console.log("Navigate to:", page)}
          onCategoriesLoaded={(categories) => categories}
          cartList={cartList}
          setCartList={setCartList}
          onClear={onClear}
        />

        {/* MAIN CONTENT */}
        <div className="flex flex-col items-center w-full   px-4 py-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              Shop Our Collection
            </h1>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Discover high-quality products carefully selected for you
            </p>
          </div>

          <div className="">
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4 mb-6">
              {/* LEFT: Filters */}
              <div className="flex items-center gap-3">
                <button
                  title="filter"
                  onClick={() => setFilters(true)}
                  className="
                  flex items-center justify-center gap-2
                  px-3 py-2 rounded-md font-bold
                  bg-gray-100 text-gray-700
                  hover:bg-green-50 hover:text-green-600
                  shadow-sm transition-all duration-300
                "
                >
                  <FilterIcon className="w-5 h-5" />
                  Filters
                </button>
              </div>

              {/* RIGHT: Sort Dropdown */}
              <div className="relative inline-block z-30">
                <button
                  type="button"
                  onClick={() => setOpen(!Open)}
                  className="
                  flex items-center justify-center gap-2
                  px-3 py-2 rounded-md font-bold
                  bg-gray-100 text-gray-700
                  hover:bg-blue-50 hover:text-blue-600
                  shadow-sm transition-all duration-300
                "
                >
                  {sortType || "Sort By"}

                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      Open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {Open && (
                  <div
                    className="
                      absolute right-0 mt-2 w-44 p-2
                      z-50
                      bg-white
                      border border-gray-200
                      rounded-lg shadow-xl
                    "
                  >
                    <ul className="p-1 text-sm text-gray-700 font-medium ">
                      {[
                        "Price: High to Low",
                        "Price: Low to High ",
                        "Alphabetic: A-Z",
                        "Alphabetic:  Z-A",
                        // "Date: old to new",
                        // "Date: new to old",
                      ].map((item) => (
                        <li key={item}>
                          <button
                            // onClick={() => setOpen(false)}
                            onClick={() => {
                              handleSort(item);
                              setOpen(false);
                            }}
                            className="
                              w-full text-left px-3 py-2 rounded-md font-bold
                              hover:bg-gray-100 hover:text-gray-900
                              transition
                            "
                          >
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* PRODUCT GRID */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {loading1 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((item) => (
                    <div
                      key={item.productID}
                      className="
                    group bg-white rounded-2xl border border-gray-200
                    overflow-hidden flex flex-col cursor-pointer
                    transition-all duration-300
                    hover:shadow-xl hover:-translate-y-1
                  "
                    >
                      {/* IMAGE */}
                      <div className="relative w-full aspect-[3/4] overflow-hidden">
                        <Link href={`/product/${item.productID}`}>
                          <Image
                            src={item.images[0]?.url || "/placeholder.png"}
                            alt={item.productName}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>
                        {/* ACTION BUTTONS */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          <button className="bg-white/80 p-2 rounded-full shadow hover:bg-red-100">
                            <Heart className="w-5 h-5 text-gray-700" />
                          </button>

                          <button
                            onClick={() => {
                              setProductPage(true);
                              setProductID(item.productID);
                            }}
                            className="
                bg-white/80 p-2 rounded-full shadow hover:bg-blue-100
                opacity-0 translate-y-2
                group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-300
              "
                          >
                            <Info className="w-5 h-5 text-gray-700" />
                          </button>
                        </div>
                      </div>

                      {/* CONTENT */}
                      <div className="px-5 py-4 flex flex-col flex-1">
                        <h5 className="text-lg font-semibold text-gray-900 line-clamp-1">
                          {item.productName}
                        </h5>

                        <p className="text-gray-500 text-sm line-clamp-2 mt-1 flex-1">
                          {item.description}
                        </p>

                        <p className="text-lg font-semibold mt-3 text-gray-900">
                          Rs.{" "}
                          {Number(item.variants[0].variantValues[0].salePrice) -
                            (Number(
                              item.variants[0].variantValues[0].salePrice,
                            ) *
                              Number(item.discount)) /
                              100}
                          <del className="text-gray-500 ml-2 text-base font-normal">
                            Rs. {item.variants[0].variantValues[0].salePrice}
                          </del>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-20">
                  No products found for selected filters.
                </p>
              )}
            </div>
          </div>
        </div>
        {productPage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-3 sm:px-6">
            {product.map((item) => (
              <div
                key={item.productID}
                className="relative bg-white rounded-xl p-4 sm:p-6 w-full max-w-4xl flex flex-col md:flex-row gap-6 max-h-[95vh] shadow-xl overflow-y-auto animate-slideUp"
              >
                <button
                  className="absolute top-3 right-1 z-50 p-2 text-gray-600 hover:text-red-500 bg-gray-100 rounded-full transition"
                  onClick={() => {
                    setProductPage(false);
                    setAmount("");
                    setNumberofProduct(0);
                  }}
                >
                  <X size={20} />
                </button>

                <div className="relative w-full md:w-1/2 flex flex-col items-center justify-center gap-3">
                  {/* Main Image Container */}
                  <>
                    <div className="relative w-full h-80 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center shadow-sm">
                      <img
                        src={imageUrl} // Current main image URL from state
                        alt="Product Main"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>

                    {/* Thumbnails */}

                    <div className="flex gap-3 overflow-x-auto max-w-full px-2">
                      {item.images.map((img, idx) => (
                        <button
                          key={img.urlID || idx}
                          onClick={() => setImageUrl(img.url)} // Update main image on click
                          className={`border rounded-lg p-1 flex-shrink-0 hover:border-blue-500 transition ${
                            imageUrl === img.url
                              ? "border-blue-600"
                              : "border-gray-300"
                          }`} // Highlight selected thumbnail
                        >
                          <img
                            src={img.url}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-16 h-16 object-contain rounded"
                          />
                        </button>
                      ))}
                    </div>
                  </>
                </div>

                <div className="flex flex-col justify-center md:w-1/2 space-y-4 text-gray-800">
                  <h1 className="text-xl sm:text-2xl font-semibold leading-tight">
                    {item.productName}
                  </h1>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            i < 4 ? "text-yellow-400" : "text-gray-300"
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                      ))}
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                      4.8
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold">
                      MRP:{" "}
                      <span className="text-gray-900">
                        Rs.{" "}
                        {Number(amount) -
                          (Number(amount) * Number(item.discount)) / 100}{" "}
                        <del className="text-gray-500 ml-2 text-base font-normal">
                          Rs. {amount}
                        </del>
                      </span>
                      <span className="ml-3 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-md font-semibold">
                        {item.discount}% OFF
                      </span>
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Inclusive of all taxes
                    </p>
                  </div>

                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex flex-col gap-3">
                    {item.variants.map((variant) => (
                      <div key={variant.varientID}>
                        <h1 className="text-md font-bold mb-2">
                          {variant.variantName}
                        </h1>

                        <div className="flex flex-wrap gap-2">
                          {variant.variantValues.map((attr) => (
                            <button
                              key={attr.attributeID}
                              disabled={attr.qty === 0}
                              onClick={() => {
                                setSelectedAttributeID(attr.attributeID || ""); // UNIQUE selection
                                setAmount(String(attr.salePrice));
                              }}
                              className={`
                              min-w-[40px] h-10 px-3 rounded-full text-sm font-semibold
                              border shadow-sm flex items-center justify-center
                              transition-all duration-200
                              ${
                                attr.qty === 0
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : selectedAttributeID === attr.attributeID
                                    ? "bg-gray-800 text-white border-gray-800"
                                    : "bg-white text-gray-800 hover:border-gray-500"
                              }
                            `}
                            >
                              {attr.varientValue}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between w-32 border border-gray-300 rounded-md shadow-sm bg-gray-200 px-3 py-2">
                    {NumberofProduct === 0 ? (
                      <button
                        onClick={() => setNumberofProduct(NumberofProduct)}
                        className="p-1  bg-white  shadow-sm rounded"
                      >
                        <Minus size={16} color="gray" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setNumberofProduct(NumberofProduct - 1)}
                        className="p-1  bg-white hover:bg-gray-200 shadow-sm rounded"
                      >
                        <Minus size={16} color="black" />
                      </button>
                    )}
                    <p className="text-lg font-medium">{NumberofProduct}</p>
                    <button
                      onClick={() => setNumberofProduct(NumberofProduct + 1)}
                      className="p-1 bg-white hover:bg-gray-100 shadow-sm rounded"
                    >
                      <Plus size={16} color="black" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button className="w-full md:w-3/5 bg-black border border-black-400 text-white py-3 rounded hover:bg-white hover:text-black transition-all duration-300">
                      <div
                        onClick={() => addToCart(productID)}
                        className="flex justify-center items-center gap-2"
                      >
                        <ShoppingCart />
                        Add to Cart
                      </div>
                    </button>
                    <button className="w-full md:w-3/5 bg-black border border-black-400 text-white py-3 rounded hover:bg-white hover:text-black transition-all duration-300">
                      <div className="flex justify-center items-center gap-2">
                        <CreditCard />
                        <span>Buy Now</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <Footer />
      </div>
      {Filter && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-500"
            onClick={() => setFilters(false)}
          ></div>

          {/* Drawer */}
          <div
            className={`
                        fixed top-0 left-0 z-50 h-full 
                        bg-white shadow-xl transform transition-transform duration-500 ease-in-out
                        w-[80vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] xl:w-[25vw]
                        flex flex-col
                      `}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              <button
                title="Close"
                className="text-gray-500 hover:text-red-500 transition"
                onClick={() => setFilters(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="w-full h-[100vh] flex flex-col p-5 rounded-2xl">
                <h1 className="text-3xl font-bold mb-4 text-gray-900">
                  Filter & Sorting
                </h1>

                <div className="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
                  {/* === Main Categories Accordion === */}
                  <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
                    <button
                      type="button"
                      onClick={() => toggleAccordion(0)}
                      className="flex items-center justify-between w-full p-4 font-semibold text-gray-800 hover:bg-gray-50 transition-all"
                    >
                      Categories
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${
                          activeIndex === 0 ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {activeIndex === 0 && (
                      <div className="p-4 border-t border-gray-100">
                        {categories.map((cat) => (
                          <label
                            key={cat.subCategoryID}
                            className="flex items-center gap-3 mb-2"
                          >
                            <input
                              type="radio"
                              name="category"
                              checked={selectedCategoryId === cat.subCategoryID}
                              onChange={() =>
                                setSelectedCategoryId(cat.subCategoryID)
                              }
                              className="w-5 h-5 rounded accent-gray-900"
                            />
                            <span className="text-lg">
                              {cat.subCategoryName}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* === Subcategories Accordion === */}
                  {/* {selectedSubCategories.length > 0 && ( */}
                  <>
                    {selectedCategoryId &&
                      (() => {
                        const selectedCategory = categories.find(
                          (cat) => cat.subCategoryID === selectedCategoryId,
                        );

                        if (
                          !selectedCategory ||
                          selectedCategory.subCategory.length === 0
                        ) {
                          return null; // don't render if no subcategories
                        }

                        return (
                          <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
                            <button
                              type="button"
                              onClick={() => toggleAccordion(1)}
                              className="flex items-center justify-between w-full p-4 font-semibold text-gray-800 hover:bg-gray-50 transition-all"
                            >
                              Sub Categories
                              <ChevronDown
                                className={`w-5 h-5 transition-transform duration-300 ${
                                  activeIndex === 1 ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {activeIndex === 1 && (
                              <div className="p-4 border-t border-gray-100 grid grid-cols-2 gap-2">
                                {selectedCategory.subCategory.map((sub) => (
                                  <label
                                    key={sub.subCategoryDetailID}
                                    className="flex items-center gap-3"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedSubCategories.includes(
                                        sub.subCategoryDetailID,
                                      )}
                                      onChange={() =>
                                        handleSubCategoryChange(
                                          sub.subCategoryDetailID,
                                        )
                                      }
                                      className="w-5 h-5 rounded accent-gray-900"
                                    />
                                    <span className="text-lg">{sub.name}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                  </>

                  {/* )} */}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
