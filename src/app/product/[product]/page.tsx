"use client";
import { useEffect, useRef, useState } from "react";
import { Star, Send, UserCircle } from "lucide-react";
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  CreditCard,
  Heart,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import Footer from "@/component/Footer/page";
import Navbar from "@/component/Navbar/page";
import { useParams } from "next/navigation";
import { CartData } from "@/api/types/Cart/CartData";
import {
  addToServerCart,
  clearServerCart,
  getServerCart,
} from "@/api/lib/Cart/AddCart";
import {
  GetProductHomeApiResponse,
  ProductHomePage,
} from "@/api/types/HomePage/Product/product";
import GetProductHome from "@/api/lib/HomePage/Product/Product";
import CheckAuth from "@/api/authentication/checkAuth";
import Link from "next/link";

export default function ProductPage() {
  const params = useParams();
  const [selectedAttributeID, setSelectedAttributeID] = useState("");
  const [amount, setAmount] = useState("");
  const [cartList, setCartList] = useState<CartData[]>([]);
  const [productPage, setProductPage] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [activeSize, setActiveSize] = useState("");
  const [productID, setProductID] = useState("");
  const [product, setProduct] = useState<ProductHomePage[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [NumberofProduct, setNumberofProduct] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [productList, setProductList] = useState<ProductHomePage[]>([]);
  const [SelectiveproductList, setSelectiveProductList] = useState<
    ProductHomePage[]
  >([]);
  const [OtherproductList, setOtherProductList] = useState<ProductHomePage[]>(
    [],
  );
  const [SuggestedProductList, setSuggestedProductList] = useState<
    ProductHomePage[]
  >([]);
  const [backgroundPosition, setBackgroundPosition] = useState("center");
  const imageRef = useRef<HTMLDivElement | null>(null);
  const [newReview, setNewReview] = useState({
    name: "",
    message: "",
    rating: 0,
  });
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Ali Khan",
      message: "Excellent quality and fast delivery! Totally worth the price.",
      rating: 5,
      date: "2 days ago",
    },
    {
      id: 2,
      name: "Sarah Ahmed",
      message: "Good product but packaging could be improved.",
      rating: 4,
      date: "5 days ago",
    },
    {
      id: 3,
      name: "Sarah Ahmed",
      message: "Good product but packaging could be improved.",
      rating: 4,
      date: "5 days ago",
    },
    {
      id: 4,
      name: "Sarah Ahmed",
      message: "Good product but packaging could be improved.",
      rating: 4,
      date: "5 days ago",
    },
  ]);

  const handleRating = (rating: number) => {
    setNewReview({ ...newReview, rating });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.message || !newReview.rating) return;
    const newEntry = {
      ...newReview,
      id: Date.now(),
      date: "Just now",
    };
    setReviews([newEntry, ...reviews]);
    setNewReview({ name: "", message: "", rating: 0 });
  };
  const images = ["/collection1.jpg", "/collection2.jpg", "/collection3.jpg"];

  const handleMouseMove = (e: any) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect(); // get image position and size

    // Calculate mouse position percentage inside the image
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp the values between 0 and 100
    const posX = Math.min(Math.max(x, 0), 100);
    const posY = Math.min(Math.max(y, 0), 100);

    // Update background position for zoomed image
    setBackgroundPosition(`${posX}% ${posY}%`);
  };

  const getProduct = async (ID: string) => {
    try {
      const token = localStorage.getItem("token") ?? "";
      const response = await GetProductHome(token);

      if (response.status === 200 || response.status === 201) {
        const data = response.data as GetProductHomeApiResponse;

        const selectedProduct = data.productList.find(
          (item) => item.productID === ID,
        );
        if (!selectedProduct) return;

        // Selected product
        //const attribute = selectedProduct.find((item)=>item.)
        setProductList([selectedProduct]);

        const suggested = data.productList.filter(
          (item) =>
            item.subCategoryID === selectedProduct.subCategoryID &&
            item.productID !== selectedProduct.productID,
        );
        setSuggestedProductList(suggested);

        const otherProducts = data.productList.filter(
          (item) => item.subCategoryID !== selectedProduct.subCategoryID,
        );
        setOtherProductList(otherProducts);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const onClear = async () => {
    await clearServerCart();
    const freshCart = await getServerCart();
    setCartList(freshCart);
  };
  const addToCart = async (ID: string) => {
    try {
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

      const updatedCart = [...currentCart, newItem];

      const res = await addToServerCart(updatedCart);
      if (res) {
        CheckAuth(ID);
      }
      serverCartData();
      setCartList(updatedCart);
    } catch (error) {
      console.log(error);
    }
  };
  const serverCartData = async () => {
    const cart = await getServerCart();
    setCartList(cart);
  };

  useEffect(() => {
    if (!productList?.length) return;

    const firstProduct = productList[0];
    const firstVariant = firstProduct.variants?.[0];
    const firstAvailableValue = firstVariant?.variantValues?.find(
      (v) => v.qty > 0,
    );

    if (firstAvailableValue) {
      setSelectedAttributeID(firstAvailableValue.attributeID);
      setAmount(String(firstAvailableValue.salePrice));
    }
  }, [productList]);

  useEffect(() => {
    console.log(params.product);
    if (params && !Array.isArray(params.product)) {
      setProductID(params?.product || "");
      getProduct(params?.product || "");
    } else {
      setProductID("");
    }
  }, [params]);

  useEffect(() => {
    if (!productID) return;
    const data = SuggestedProductList.filter(
      (item) => item.productID === productID,
    );
    if (data && data.length > 0) {
      console.log(data);
      setSelectiveProductList(data);
      const allVariantValues = data.flatMap((product) =>
        product.variants.flatMap((variant) => variant.variantValues),
      );
      if (allVariantValues && allVariantValues.length > 0) {
        setSelectedAttributeID(allVariantValues[0].attributeID);
      } else {
        // Optional: Reset or handle case where no variants exist
        setSelectedAttributeID("");
      }

      const allImages = data.find((item) => item.productID === productID);
      setImageUrl(allImages?.images[0]?.url || "");
      const firstAvailableVariant = allVariantValues.find((v) => v.qty > 0);
      if (firstAvailableVariant) {
        setAmount(String(firstAvailableVariant.salePrice));
      } else {
        setAmount("0"); // fallback if none available
      }
    }
  }, [productID]);

  return (
    <>
      {/* <Navbar onPageChange={handleNavClick} /> */}
      <Navbar
        onPageChange={(page) => console.log("Navigate to:", page)}
        SubCategoryID={(page) => console.log("Navigate to:", page)}
        onCategoriesLoaded={(categories) => categories}
        cartList={cartList}
        setCartList={setCartList}
        onClear={onClear}
      />
      <div className="flex flex-col items-center w-full min-h-[calc(100vh-200px)]  px-4 py-10">
        <h1
          style={{ fontFamily: "var(--font-playfair)" }}
          className="text-4xl font-bold text-gray-800 mb-6"
        >
          Product Information
        </h1>
        <hr className="w-1/2 border-gray-300 mb-10" />

        {/* === PRODUCT SECTION === */}
        {productList.map((item) => {
          const images = item.images.map((img) => img.url);
          return (
            <div
              key={item.productID}
              className="flex flex-col md:flex-row justify-between gap-10 w-full max-w-6xl"
            >
              {/* === IMAGE SECTION === */}
              <div className="relative w-full md:w-1/2 flex flex-col items-center">
                {/* === MAIN IMAGE === */}
                <div
                  ref={imageRef}
                  className="relative w-full h-[400px] sm:h-[500px] md:h-[700px] overflow-hidden rounded-2xl shadow-md"
                  onMouseEnter={() =>
                    window.innerWidth >= 1024 && setZoomVisible(true)
                  }
                  onMouseLeave={() => setZoomVisible(false)}
                  onMouseMove={(e) =>
                    window.innerWidth >= 1024 && handleMouseMove(e)
                  }
                >
                  {item.images.map((src, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        index === currentIndex ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <Image
                        src={src.url}
                        alt={`Product image ${index + 1}`}
                        fill
                        className="object-contain rounded-2xl"
                        priority={index === 0}
                      />
                    </div>
                  ))}

                  {/* === DOTS === */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {item.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          currentIndex === index
                            ? "bg-white scale-110 shadow-md"
                            : "bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* === THUMBNAIL PREVIEWS === */}
                <div className="flex justify-center mt-4 gap-3 flex-wrap">
                  {item.images.map((src, index) => (
                    <div
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`relative w-15 h-20 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                        currentIndex === index
                          ? "border-blue-500 shadow-md scale-105"
                          : "border-gray-200 hover:scale-105"
                      }`}
                    >
                      <Image
                        src={src.url}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>

                {zoomVisible && (
                  <div
                    className="absolute top-0 left-full ml-6 w-[300px] h-[400px] rounded-xl border shadow-lg"
                    style={{
                      backgroundImage: `url(${images[currentIndex]})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: backgroundPosition,
                      backgroundSize: "200%", // zoom scale
                    }}
                  />
                )}
              </div>

              {/* === INFO SECTION === */}
              <div className="flex flex-col justify-center md:w-1/2 space-y-6 text-gray-800">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {item.productName}
                </h1>

                {/* Ratings */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
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

                {/* Price Section */}
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
                      onClick={() => addToCart(item.productID)}
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
          );
        })}
      </div>
      {/* === SUGGESTED PRODUCTS === */}
      <div className="w-full max-w-7xl mx-auto mt-16 px-4">
        <h2
          style={{ fontFamily: "var(--font-playfair)" }}
          className="text-4xl  flex justify-start font-semibold text-gray-900 mb-3 text-center"
        >
          Suggested For You
        </h2>
        {/* <hr className="w-1/2 mb-3 text-gray-400" /> */}

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {SuggestedProductList.map((item) => (
            <div
              key={item.productID}
              className="w-full bg-white border border-gray-200 rounded-lg shadow-sm 
                 transform transition-all duration-300 ease-in-out 
                 hover:scale-[1.02] hover:shadow-lg"
            >
              {/* Product Image */}
              <div className="relative w-full h-[420px] overflow-hidden rounded-t-lg group">
                <Link href={`/product/${item.productID}`}>
                  <Image
                    src={item.images[0].url}
                    alt={item.productName}
                    fill
                    className="object-contain bg-white group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="bg-white p-2 rounded-full shadow hover:bg-red-100 transition">
                    <Heart className="text-gray-700 w-4 h-4" />
                  </button>
                  {/* <button className="bg-white p-2 rounded-full shadow hover:bg-green-100 transition">
                    <ShoppingCart className="text-gray-700 w-4 h-4" />
                  </button> */}
                  {/* <button
                    onClick={() => {
                      setProductID(item.productID);
                      setProductPage(true);
                    }}
                    className="bg-white p-2 rounded-full shadow hover:bg-blue-100 transition"
                  >
                    <Search className="text-gray-700 w-4 h-4" />
                  </button> */}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 space-y-2">
                <h5 className="text-lg font-semibold text-gray-900 truncate">
                  {item.productName}
                </h5>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto mt-16 px-4">
        <h2
          style={{ fontFamily: "var(--font-playfair)" }}
          className="text-4xl  flex justify-start font-semibold text-gray-900 mb-3 text-center"
        >
          You May Also Like
        </h2>
        {/* <hr className="w-1/2 mb-3 text-gray-400" /> */}

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {OtherproductList.map((item) => (
            <div
              key={item.productID}
              className="w-full bg-white border border-gray-200 rounded-lg shadow-sm 
                 transform transition-all duration-300 ease-in-out 
                 hover:scale-[1.02] hover:shadow-lg"
            >
              {/* Product Image */}
              <div className="relative w-full h-[420px] overflow-hidden rounded-t-lg group">
                <Link href={`/product/${item.productID}`}>
                  <Image
                    src={item.images[0].url}
                    alt={item.productName}
                    fill
                    className="object-contain bg-white group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="bg-white p-2 rounded-full shadow hover:bg-red-100 transition">
                    <Heart className="text-gray-700 w-4 h-4" />
                  </button>
                  {/* <button className="bg-white p-2 rounded-full shadow hover:bg-green-100 transition">
                    <ShoppingCart className="text-gray-700 w-4 h-4" />
                  </button> */}
                  {/* <button
                    onClick={() => {
                      setProductID(item.productID);
                      setProductPage(true);
                    }}
                    className="bg-white p-2 rounded-full shadow hover:bg-blue-100 transition"
                  >
                    <Search className="text-gray-700 w-4 h-4" />
                  </button> */}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 space-y-2">
                <h5 className="text-lg font-semibold text-gray-900 truncate">
                  {item.productName}
                </h5>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-6xl mx-auto mt-16 mb-16 px-4">
        <h2 className="text-2xl font-bold flex justify-start text-gray-900 mb-8 text-center">
          Customer Reviews & Ratings
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* === LEFT: Review Form (Fixed) === */}
          <div className="relative">
            <div className="sticky top-24">
              <form
                onSubmit={handleSubmit}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Write a Review
                </h3>

                {/* Name Field */}
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full mb-4 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  value={newReview.name}
                  onChange={(e) =>
                    setNewReview({ ...newReview, name: e.target.value })
                  }
                />

                {/* Message Field */}
                <textarea
                  placeholder="Share your experience..."
                  rows={4}
                  className="w-full mb-4 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  value={newReview.message}
                  onChange={(e) =>
                    setNewReview({ ...newReview, message: e.target.value })
                  }
                ></textarea>

                {/* Star Rating */}
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-gray-700 font-medium mr-2">
                    Your Rating:
                  </span>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      onClick={() => handleRating(i + 1)}
                      className={`w-6 h-6 cursor-pointer transition ${
                        i < newReview.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 hover:text-yellow-400"
                      }`}
                    />
                  ))}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition"
                >
                  <Send className="w-4 h-4" /> Submit Review
                </button>
              </form>
            </div>
          </div>

          {/* === RIGHT: Scrollable Reviews === */}
          <div className="w-full max-h-[600px] overflow-y-auto pr-2 space-y-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  <UserCircle className="w-8 h-8 text-gray-400" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {review.name}
                    </h4>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">
                  {review.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {productPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-3 sm:px-6">
          {SelectiveproductList.map((item) => (
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
      <Footer />
    </>
  );
}
