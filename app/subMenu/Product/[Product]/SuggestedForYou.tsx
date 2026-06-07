"use client";
import { addToServerCart } from "@/app/api/Controller/Customer/CookiesController/Cart/AddCart";
import { addToServerWishList } from "@/app/api/Controller/Customer/CookiesController/WishList/AddWishList";
import { CartData } from "@/app/api/Types/Customer/Cookies/Cart";
import { ProductSectionHomePage } from "@/app/api/Types/Customer/ProductSectionHomePage";
import ProductSkeleton from "@/app/ui/UseFulLComponent/SkelatonLoading/SkelatonLoading";
import { ChevronRight, Heart, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

interface NavabarProps {
  onClickCall: () => void;
  ProductData: ProductSectionHomePage[];
}
export default function SuggestedForYou({
  onClickCall,
  ProductData,
}: NavabarProps) {
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [productPrices, setProductPrices] = useState<Record<string, number>>(
    {},
  );
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  const displayedProducts = ProductData.filter(
    (item) => item.isStock === true,
  ).slice(0, 8);

  const updatePrice = (
    productID: string,
    variantID: string,
    attributeID: string,
  ) => {
    if (!ProductData) return;

    const product = ProductData.find((item) => item.productID === productID);
    if (!product) return;

    const variant = product.variants.find(
      (item2) => item2.varientID === variantID,
    );
    if (!variant) return;

    const attribute = variant.variantValues.find(
      (item3) => item3.attributeID === attributeID,
    );
    if (!attribute) return;

    setProductPrices((prev) => ({
      ...prev,
      [productID]: attribute.salePrice,
    }));

    setSelectedAttributes((prev) => ({
      ...prev,
      [productID]: attributeID,
    }));
  };
  const handleAddToCart = async (product: ProductSectionHomePage) => {
    const attrId = selectedAttributes[product.productID];
    if (attrId) {
      const data: CartData[] = [
        {
          attributeID: attrId,
          qty: 1,
        },
      ];
      await addToServerCart(data);
      onClickCall();
    }
  };
  const handleAddToWishlist = async (product: ProductSectionHomePage) => {
    const attrId = selectedAttributes[product.productID];
    if (attrId) {
      const data: CartData[] = [
        {
          attributeID: attrId,
          qty: 1,
        },
      ];
      await addToServerWishList(data);
      onClickCall();
    }
  };
  return (
    <>
      {displayedProducts.length > 0 && (
        <section
          ref={sectionRef}
          className="py-12 md:py-16 bg-gray-50 overflow-hidden"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-start mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Suggested For You
              </h2>
              <div className="w-100 h-1 bg-purple-600 mx-start mt-4 rounded-full"></div>
            </div>

            {/* Products Grid */}

            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-700 delay-200 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              {displayedProducts.map((product, index) => {
                const selectedVariantId = selectedAttributes[product.productID];
                const currentPrice =
                  productPrices[product.productID] ||
                  product?.variants?.[0]?.variantValues?.[0]?.salePrice;
                const discountPrice =
                  currentPrice - (currentPrice * product.discount) / 100;
                return (
                  <div
                    key={product.productID}
                    className="group bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                    style={{ transitionDelay: `${index * 50}ms` }}
                    onMouseEnter={() => setHoveredProductId(product.productID)}
                    onMouseLeave={() => setHoveredProductId(null)}
                  >
                    {/* Image Section */}
                    <div className="relative overflow-hidden bg-gray-50 aspect-square">
                      <Link href={`/subMenu/Product/${product.productID}`}>
                        <img
                          src={
                            product?.images[0]?.url ||
                            "https://t4.ftcdn.net/jpg/06/57/37/01/360_F_657370150_pdNeG5pjI976ZasVbKN9VqH1rfoykdYU.jpg"
                          }
                          alt={product.productName || "Product image"}
                          // onClick={() =>
                          //   router.push(
                          //     `/Customer/Product/${product.productID}`,
                          //   )
                          // }
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
                      </div>

                      {product.variants && product.variants.length > 0 && (
                        <div
                          className={`absolute inset-x-0 bottom-0 bg-white bg-opacity-95 
                                     transform transition-transform duration-300 ease-out
                                     p-3 border-t border-gray-100
                                     ${hoveredProductId === product.productID ? "translate-y-0" : "translate-y-full"}`}
                        >
                          {/* Sizes/Attributes */}
                          <div className="flex flex-wrap gap-2 justify-center mb-2">
                            {product.variants.map((size) => (
                              <div
                                key={size.varientID}
                                className="flex gap-1 flex-wrap justify-center"
                              >
                                {size.variantValues.map((item2, idx) => (
                                  <button
                                    onClick={() =>
                                      updatePrice(
                                        product.productID,
                                        size.varientID,
                                        item2.attributeID,
                                      )
                                    }
                                    key={idx}
                                    className={`${
                                      item2.qty > 0 || product.isStock === true
                                        ? `px-2 py-1 text-xs font-medium rounded transition-all duration-200 ${
                                            selectedAttributes[
                                              product.productID
                                            ] === item2.attributeID
                                              ? "bg-gray-900 text-white"
                                              : "text-gray-600 hover:bg-gray-100"
                                          }`
                                        : "text-gray-300 cursor-not-allowed"
                                    }`}
                                  >
                                    {item2.varientValue?.toUpperCase() || ""}
                                  </button>
                                ))}
                              </div>
                            ))}
                          </div>

                          {/* Add to Cart Button */}
                          {product.isStock === true && (
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
                      )}
                    </div>
                    <div className="flex justify-between p-2">
                      <h3 className="text-sm text-gray-400  line-clamp-1">
                        {product.categoryName} . {product.subCategoryName}
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
                      <h3 className="text-md text-gray-900 line-clamp-1">
                        {product.productName}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Rating */}

                      {/* Price */}
                      <div className="flex items-center ">
                        <span className="text-lg font-bold text-black">
                          {discountPrice?.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400 line-through ml-2">
                          {currentPrice?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

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
