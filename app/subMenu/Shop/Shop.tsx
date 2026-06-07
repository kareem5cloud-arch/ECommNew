// app/shop/page.tsx
"use client";
import { useState, useEffect } from "react";
import {
  Grid3x3,
  List,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronRight,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Check,
} from "lucide-react";
import FilterComponent from "./FilterComponent";
import { useAppContext } from "@/app/useContext";
import ProductSkeleton from "@/app/ui/UseFulLComponent/SkelatonLoading/SkelatonLoading";
import Link from "next/link";
import { ProductSectionHomePage } from "@/app/api/Types/Customer/ProductSectionHomePage";
import { CartData } from "@/app/api/Types/Customer/Cookies/Cart";
import { addToServerWishList } from "@/app/api/Controller/Customer/CookiesController/WishList/AddWishList";
import { addToServerCart } from "@/app/api/Controller/Customer/CookiesController/Cart/AddCart";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

interface ShopPageProps {
  functionCalling: () => void;
}

export default function ShopPage({ functionCalling }: ShopPageProps) {
  const { ProductData, categroyInfo } = useAppContext();
  const [categoryID, setCategoryID] = useState("");
  const [SubCategoryID, setSubCategoryID] = useState("");
  const [FurtherCategoryID, setFurtherCategoryID] = useState("");

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setloading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [displayedProducts, setDisplayedProducts] = useState<
    ProductSectionHomePage[]
  >([]);
  const [productPrices, setProductPrices] = useState<Record<string, number>>(
    {},
  );
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 50;

  const filterAndSortProducts = () => {
    let filtered = [...ProductData];

    // Category Filter
    if (categoryID) {
      filtered = filtered.filter((item) => item.categoryID === categoryID);
    }

    // Sub Category Filter
    if (SubCategoryID) {
      filtered = filtered.filter(
        (item) => item.subCategoryID === SubCategoryID,
      );
    }

    // Further Category Filter
    if (FurtherCategoryID) {
      filtered = filtered.filter(
        (item) => item.subCategoryDetailID === FurtherCategoryID,
      );
    }

    // Search
    if (searchQuery.trim()) {
      filtered = filtered.filter((item) =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sort
    switch (sortBy) {
      case "featured":
        filtered = filtered.filter((item) => item.feturedProduct);
        break;

      case "price-asc":
        filtered.sort((a, b) => {
          const priceA = a.variants?.[0]?.variantValues?.[0]?.salePrice ?? 0;

          const priceB = b.variants?.[0]?.variantValues?.[0]?.salePrice ?? 0;

          return priceA - priceB;
        });
        break;

      case "price-desc":
        filtered.sort((a, b) => {
          const priceA = a.variants?.[0]?.variantValues?.[0]?.salePrice ?? 0;

          const priceB = b.variants?.[0]?.variantValues?.[0]?.salePrice ?? 0;

          return priceB - priceA;
        });
        break;

      default:
        break;
    }

    setDisplayedProducts(filtered);
  };
  useEffect(() => {
    setloading(true);

    const timer = setTimeout(() => {
      filterAndSortProducts();
      setloading(false);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [
    ProductData,
    searchQuery,
    sortBy,
    categoryID,
    SubCategoryID,
    FurtherCategoryID,
  ]);
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
  const totalPages = Math.ceil(displayedProducts.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;

  const paginatedProducts = displayedProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  );
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
      functionCalling();
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
      functionCalling();
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">Shop</h1>
          <p className="text-gray-500 mt-1">
            Explore our collection of premium products
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <FilterComponent
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            categroyInfo={categroyInfo}
            categoryID={setCategoryID}
            subCategoryID={setSubCategoryID}
            furtherSubCategoryID={setFurtherCategoryID}
          />

          <div className="flex-1 min-w-0">
            {" "}
            {/* Added min-w-0 to prevent overflow */}
            {/* Search and Sort Bar */}
            <div className="bg-white rounded-xl p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300"
                  />
                </div>

                {/* Sort and View Toggle */}
                <div className="flex gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 text-sm"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                  </button>
                </div>
              </div>
            </div>
            {/* Results Count */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">
                Showing {paginatedProducts.length} of {displayedProducts.length}{" "}
                products
              </p>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array(8)
                  .fill(null)
                  .map((_, index) => (
                    <ProductSkeleton key={`skeleton-${index}`} />
                  ))}
              </div>
            ) : (
              <>
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-700 delay-200 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12"
                  }`}
                >
                  {paginatedProducts.map((product, index) => {
                    const selectedVariantId =
                      selectedAttributes[product.productID];
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
                        onMouseEnter={() =>
                          setHoveredProductId(product.productID)
                        }
                        onMouseLeave={() => setHoveredProductId(null)}
                      >
                        {/* Image Section */}
                        <div className="relative overflow-hidden bg-gray-50 aspect-square">
                          <Link href="">
                            <img
                              src={
                                product?.images[0]?.url ||
                                "https://t4.ftcdn.net/jpg/06/57/37/01/360_F_657370150_pdNeG5pjI976ZasVbKN9VqH1rfoykdYU.jpg"
                              }
                              alt={product.productName || "Product image"}
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
                                          item2.qty > 0 ||
                                          product.isStock === true
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
                                        {item2.varientValue?.toUpperCase() ||
                                          ""}
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
                          <h3 className="text-sm text-gray-400 line-clamp-1">
                            {product.categoryName} . {product.subCategoryName}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium text-gray-700">
                                {product.rating.toFixed(1)}
                              </span>
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

                          {/* Price */}
                          <div className="flex items-center">
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

                {/* Pagination */}
                <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded transition-colors ${
                          currentPage === pageNum
                            ? "bg-black text-white"
                            : "border hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
    </div>
  );
}
