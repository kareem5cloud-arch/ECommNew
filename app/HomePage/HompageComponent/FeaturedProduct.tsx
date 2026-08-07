"use client";
import { addToServerCart } from "@/app/api/Controller/Customer/CookiesController/Cart/AddCart";
import { addToServerWishList } from "@/app/api/Controller/Customer/CookiesController/WishList/AddWishList";
import { CartData } from "@/app/api/Types/Customer/Cookies/Cart";
import { ProductSectionHomePage } from "@/app/api/Types/Customer/ProductSectionHomePage";
import ProductSkeleton from "@/app/ui/UseFulLComponent/SkelatonLoading/SkelatonLoading";
import {
  Heart,
  ShoppingCart,
  Eye,
  Star,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";

interface getPorodcutprops {
  ProductData: ProductSectionHomePage[];
  loading: boolean;
  functionCalling: () => void;
  functionCallingWishList: () => void;
  ID: string;
}

export default function FeaturedProduct({
  ProductData,
  loading,
  functionCalling,
  functionCallingWishList,
  ID,
}: getPorodcutprops) {
  const router = useRouter();
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Show only first 8 items initially
  // const displayedProducts = ProductData?.slice(0, 8) || [];
  const displayedProducts = ProductData.filter(
    (item) => item.feturedProduct === true && item.categoryID === ID,
  ).slice(0, 8);

  // useEffect(() => {
  //   if (!ProductData || ProductData.length === 0) return;

  //   const initialPrices: Record<string, number> = {};
  //   ProductData.forEach((product) => {
  //     const firstVariant = product.variants?.[0];
  //     const firstAttribute = firstVariant?.variantValues?.[0];
  //     if (firstAttribute) {
  //       initialPrices[product.productID] = firstAttribute.salePrice;
  //     }
  //   });
  //   setProductPrices(initialPrices);
  // }, [ProductData]);

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleAddToCart = async (product: ProductSectionHomePage) => {
    const attrId = product.variants[0].varientID;
    if (attrId) {
      const data: CartData[] = [
        {
          attributeID: attrId,
          qty: 1,
        },
      ];
      await addToServerCart(data);
      functionCalling();
    }
  };

  const handleAddToWishlist = async (product: ProductSectionHomePage) => {
    const attrId = product.variants[0].varientID;
    if (attrId) {
      const data: CartData[] = [
        {
          attributeID: attrId,
          qty: 1,
        },
      ];
      await addToServerWishList(data);
      functionCallingWishList();
    }
  };
  if (!ProductData || ProductData.length === 0) {
    return null;
  }

  return (
    <>
      {displayedProducts.length > 0 && (
        <section
          ref={sectionRef}
          className="py-12 md:py-16 bg-gray-50 overflow-hidden"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full mb-3">
                Featured Product
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                New Arrivals
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover the latest products added to our collection
              </p>
              <div className="w-20 h-1 bg-purple-600 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Products Grid */}
            {loading ? (
              // <ProductSkeleton />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array(8)
                  .fill(null)
                  .map((_, index) => (
                    <ProductSkeleton key={`skeleton-${index}`} />
                  ))}
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-700 delay-200 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
              >
                {displayedProducts.map((product, index) => {
                  // const selectedVariantId =
                  //   selectedAttributes[product.productID];
                  // const currentPrice =
                  //   productPrices[product.productID] ||
                  //   product?.variants?.[0]?.variantValues?.[0]?.salePrice;
                  // const discountPrice =
                  //   currentPrice - (currentPrice * product.discount) / 100;
                  return (
                    <div
                      key={product.productID}
                      className="group bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                      style={{ transitionDelay: `${index * 50}ms` }}
                      onMouseEnter={() =>
                        setHoveredProductId(product.productID)
                      }
                      onMouseLeave={() => setHoveredProductId(null)}
                    >
                      {/* Image Section */}
                      <div className="relative overflow-hidden bg-gray-50 aspect-square">
                        <Link href={`/subMenu/Product/${product.productID}`}>
                          <img
                            src={
                              product.variants[0].images[0].url ||
                              "https://t4.ftcdn.net/jpg/06/57/37/01/360_F_657370150_pdNeG5pjI976ZasVbKN9VqH1rfoykdYU.jpg"
                            }
                            alt={product.productName || "Product image"}
                            onClick={() =>
                              router.push(
                                `/Customer/Product/${product.productID}`,
                              )
                            }
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
                          />
                          {product.discount && (
                            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                              -{product.discount}%
                            </span>
                          )}
                        </Link>

                        {/* Hover Icons - Top Right */}
                        <div
                          className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300
                                  ${hoveredProductId === product.productID ? "opacity-100" : "opacity-100"}`}
                        >
                          {/* <button
                                  onClick={() => handleQuickView(product)}
                                  className="bg-white p-2 rounded-full hover:bg-gray-900 hover:text-white transition-all transform hover:scale-110 shadow-md"
                                  title="Quick View"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button> */}
                          <button
                            onClick={() => handleAddToWishlist(product)}
                            className="bg-white p-2 rounded-full hover:bg-red-500 hover:text-white transition-all transform hover:scale-110 shadow-md"
                            title="Add to Wishlist"
                          >
                            <Heart className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="bg-white p-2 rounded-full hover:bg-green-500 hover:text-white transition-all transform hover:scale-110 shadow-md"
                            title="Add to Cart"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* {product.variants && product.variants.length > 0 && (
                          <div
                            className={`absolute inset-x-0 bottom-0 bg-white bg-opacity-95 
                                           transform transition-transform duration-300 ease-out
                                           p-3 border-t border-gray-100
                                           ${hoveredProductId === product.productID ? "translate-y-0" : "translate-y-full"}`}
                          >
                            <div className="flex flex-wrap gap-2 justify-center mb-2">
                              {product.variants.map((variant) => (
                                <button
                                  key={variant.varientID}
                                  onClick={() =>
                                    updatePrice(
                                      product.productID,
                                      variant.varientID,
                                    )
                                  }
                                  className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                                    selectedAttributes[product.productID] ===
                                    variant.varientID
                                      ? "bg-gray-900 text-white"
                                      : "text-gray-600 hover:bg-gray-100"
                                  }`}
                                >
                                  {variant.values
                                    .map((v) => v.varientValue)
                                    .join(" - ")}
                                </button>
                              ))}
                            </div>

                            {product.isStock === false && (
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="w-full py-1.5 text-xs font-medium text-white 
                                             bg-gray-900 hover:bg-gray-800 transition-colors duration-200
                                             rounded flex items-center justify-center gap-2"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                ADD TO BAG
                              </button>
                            )}
                          </div>
                        )} */}
                      </div>
                      <div className="flex justify-between p-2">
                        <h3 className="text-sm text-gray-400  line-clamp-1">
                          {product.categoryName} . {product.subCategoryName} .{" "}
                          {product.furtherSubCategoryName}
                        </h3>
                        <div className="flex items-center justify-between ">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium text-gray-700">
                              {product.rating.toFixed(1)}
                            </span>
                            {/* <span className="text-xs text-gray-400">(128)</span> */}
                          </div>
                        </div>
                      </div>
                      {/* Product Info */}
                      <div className="p-2">
                        <h3 className="text-lg text-gray-900 font-medium">
                          {product.productName}{" "}
                          <span className="uppercase">
                            {product.variants[0].values
                              .map((item) => item.varientValue)
                              .join(" - ")}
                          </span>
                        </h3>
                        <p className="text-xs mt-2 text-gray-500 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Rating */}

                        {/* Price */}
                        <div className="flex items-center ">
                          <span className="text-lg font-bold text-black">
                            {(
                              product.variants[0].salePrice -
                              (product.variants[0].salePrice *
                                product.discount) /
                                100
                            ).toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-400 line-through ml-2">
                            {product.variants[0].salePrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* View All Button - Opens new page with all products */}
            <div className="text-center mt-12">
              <Link
                href="/subMenu/Shop"
                className="inline-flex items-center gap-2 px-8 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 group"
              >
                <span>EXPLORE MORE</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
