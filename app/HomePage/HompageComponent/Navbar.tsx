// components/Navbar.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Heart,
  LayoutDashboard,
} from "lucide-react";
import CartSidebar from "../useFullComponent/cartSideBar";
import AuthModal from "./LoginSignUp";
import WishlistSidebar from "../useFullComponent/wishListSideBar";
import { categoryListHomePageCustomerCategroy } from "@/app/api/Types/Customer/HomePageCustomerCategroy";
import { ResposneStoreListHomePage } from "@/app/api/Types/Customer/HomePageStoreSetting";
import { CartData } from "@/app/api/Types/Customer/Cookies/Cart";
import CheckAuth from "@/app/api/Controller/Authentication/CheckAuth/CheckAuth";
import { ProductSectionHomePage } from "@/app/api/Types/Customer/ProductSectionHomePage";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavabarProps {
  categoryData: categoryListHomePageCustomerCategroy[];
  storeInfo?: ResposneStoreListHomePage;
  cartList: CartData[];
  wishList: CartData[];
  onClickCall: () => void;
  productData: ProductSectionHomePage[];
}
export default function Navbar({
  categoryData,
  storeInfo,
  cartList,
  wishList,
  onClickCall,
  productData,
}: NavabarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(
    null,
  );
  const [searchFocused, setSearchFocused] = useState(false);
  const [tokenExist, settokenExist] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchProduct, setSearchProduct] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sample categories data with 3 levels

  const activeCategoryData = categoryData.find(
    (c) => c.categoryID === activeCategory,
  );

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
      setActiveSubcategory(null);
    }, 100);
  };

  const handleMouseEnter = (categoryId: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setActiveCategory(categoryId);
    setActiveSubcategory(null);
  };
  const handleAddToCart = (item: any) => {
    setIsCartOpen(true);
  };

  const checkAuth = async () => {
    const token = localStorage.getItem("customerToken");
    const response = await CheckAuth(String(token));
    if (response.status === 200) {
      settokenExist(true);
    } else {
      settokenExist(false);
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);

  const filteredOptions = productData.filter((item) =>
    item.productName.toLowerCase().includes(searchProduct.toLowerCase()),
  );
  // SELECT ITEM
  const handleSelect = (item: ProductSectionHomePage) => {
    setOpen(false);
    setSearchProduct(item.productName);
    router.push(`/subMenu/Product/${item.productID}`);
  };

  // KEYBOARD CONTROL
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || filteredOptions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev + 1 >= filteredOptions.length ? 0 : prev + 1,
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev <= 0 ? filteredOptions.length - 1 : prev - 1,
      );
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (highlightIndex >= 0) {
        const selected = filteredOptions[highlightIndex];

        handleSelect(selected);
        router.push(`/subMenu/Product/${selected.productID}`);
      }
    }

    if (e.key === "Escape") {
      setOpen(false);
    }
  };
  return (
    <>
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartData={cartList}
        onClickCall={onClickCall}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultMode={authMode}
      />
      <WishlistSidebar
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishListData={wishList}
        onAddToCart={handleAddToCart}
        onClickCall={onClickCall}
      />
      <nav
        className={`bg-white transition-all duration-300 sticky top-0 z-10 ${scrolled ? "shadow-lg" : "shadow-md"}`}
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top bar */}
          <div
            onClick={() => setOpen(false)}
            className="flex items-center justify-between h-16 lg:h-20"
          >
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <div className="flex-shrink-0 ml-4 lg:ml-0">
                {storeInfo?.logoUrl ? (
                  <img
                    src={storeInfo.logoUrl}
                    alt="Store Logo"
                    className="h-8 lg:h-10 w-auto object-contain"
                  />
                ) : (
                  <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"></span>
                )}
              </div>
            </div>

            {/* Search bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8 relative ">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchProduct}
                  placeholder="Search products, brands, categories..."
                  className={`w-full px-5 py-2.5 border rounded-full focus:outline-none focus:ring-2 transition-all duration-200
                    ${
                      searchFocused
                        ? "border-purple-500 ring-2 ring-purple-200 bg-white"
                        : "border-gray-300 bg-gray-50 hover:bg-white"
                    }
                  `}
                  onFocus={() => setOpen(true)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchProduct(value);
                    setOpen(true);
                    setHighlightIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                />
                <Search className="absolute right-4 top-3 h-5 w-5 text-gray-400" />
              </div>

              {open && (
                <ul className="absolute z-50 w-full bg-white rounded-lg mt-12 shadow-lg max-h-80 overflow-auto border border-gray-200">
                  {filteredOptions.length === 0 ? (
                    <li className="px-4 py-8 text-center text-gray-500">
                      No products found
                    </li>
                  ) : (
                    filteredOptions.map((option, index) => (
                      <li
                        key={option.productID}
                        ref={(el) => {
                          itemRefs.current[index] = el;
                        }}
                        onMouseDown={() => handleSelect(option)}
                        className={`px-3 py-2 cursor-pointer transition-colors flex items-center gap-3 ${
                          index === highlightIndex
                            ? "bg-purple-50"
                            : "hover:bg-gray-50"
                        } ${index !== filteredOptions.length - 1 ? "border-b border-gray-100" : ""}`}
                      >
                        {/* Product Image */}

                        <img
                          src={
                            option.images?.[0]?.url ||
                            "https://t4.ftcdn.net/jpg/06/57/37/01/360_F_657370150_pdNeG5pjI976ZasVbKN9VqH1rfoykdYU.jpg"
                          }
                          alt={option.productName}
                          className="w-10 h-10 object-cover rounded-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://t4.ftcdn.net/jpg/06/57/37/01/360_F_657370150_pdNeG5pjI976ZasVbKN9VqH1rfoykdYU.jpg";
                          }}
                        />

                        {/* Product Name */}
                        <span
                          className={`text-sm flex-1 ${
                            index === highlightIndex
                              ? "text-purple-600 font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {option.productName}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>

            {/* Right icons */}
            <div className="flex items-center space-x-3 lg:space-x-5">
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <Heart className="h-5 w-5" />
                <span className="hidden lg:inline text-sm font-medium">
                  WishList
                </span>
              </button>
              {tokenExist ? (
                <button
                  // onClick={() => {
                  //   setAuthMode("login");
                  //   setIsAuthOpen(true);
                  // }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="hidden lg:inline text-sm font-medium">
                    Dashboard
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setIsAuthOpen(true);
                  }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden lg:inline text-sm font-medium">
                    Account
                  </span>
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-600 hover:text-purple-600 transition-colors"
              >
                <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6" />
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartList.length}
                </span>
              </button>
            </div>
          </div>

          {/* Categories - Desktop */}
          <div className="hidden lg:block border-t border-gray-100 relative">
            <div className="flex justify-start xl:justify-center space-x-1 xl:space-x-8 overflow-x-auto">
              {categoryData.map((category) => (
                <div
                  key={category.categoryID}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(category.categoryID)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href="/subMenu/Shop"
                    className={`px-4 xl:px-6 py-4 text-sm font-medium transition-all duration-200 flex items-center space-x-1 relative whitespace-nowrap
                    ${
                      activeCategory === category.categoryID
                        ? "text-purple-600"
                        : "text-gray-700 hover:text-purple-600"
                    }
                  `}
                  >
                    <span>{category.categoryName}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200
                      ${activeCategory === category.categoryID ? "rotate-180" : ""}
                    `}
                    />
                    {activeCategory === category.categoryID && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full"></div>
                    )}
                  </Link>

                  {/* Dropdown menu - Full width from category position */}
                  {activeCategory === category.categoryID && (
                    <div className="fixed left-0 right-0 w-full bg-white   border-t lg:border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row">
                          {/* Level 1 & 2 - Subcategories */}
                          <div className="w-full lg:w-2/3 p-6 border-r border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                              <span>{category.categoryName}</span>
                              <a
                                href="#"
                                className="text-xs text-purple-600 hover:underline"
                              >
                                View All →
                              </a>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              {category.subCategoryList.map((sub) => (
                                <div
                                  key={sub.subCategoryID}
                                  className="relative group/sub"
                                >
                                  <div className="flex items-center justify-between">
                                    <a
                                      href="#"
                                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50 transition-colors duration-200 flex-1"
                                    >
                                      <span className="text-gray-700 group-hover/sub:text-purple-600 font-medium text-sm">
                                        {sub.subCategoryName}
                                      </span>
                                    </a>
                                    {sub.subCategoryDetailList &&
                                      sub.subCategoryDetailList.length > 0 && (
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                      )}
                                  </div>

                                  {/* Level 3 - Sub-subcategories */}
                                  {sub.subCategoryDetailList &&
                                    sub.subCategoryDetailList.length > 0 && (
                                      <div className="ml-12 mt-1 space-y-1">
                                        {sub.subCategoryDetailList
                                          .slice(0, 3)
                                          .map((subsub) => (
                                            <a
                                              key={subsub.subCategoryDetailID}
                                              href="#"
                                              className="block text-xs text-gray-500 hover:text-purple-600 py-1 transition-colors"
                                            >
                                              {subsub.name}
                                            </a>
                                          ))}
                                        {sub.subCategoryDetailList.length >
                                          3 && (
                                          <a
                                            href="#"
                                            className="block text-xs text-purple-600 hover:underline mt-1"
                                          >
                                            +
                                            {sub.subCategoryDetailList.length -
                                              3}{" "}
                                            more
                                          </a>
                                        )}
                                      </div>
                                    )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Category Image & Promo */}
                          <div className="w-full lg:w-1/3 bg-gradient-to-br from-purple-50 to-pink-50 p-6 flex flex-col">
                            <div className="rounded-xl overflow-hidden shadow-lg mb-4">
                              <img
                                src={category.url}
                                alt={category.categoryName}
                                className="w-full h-48 lg:h-56 object-cover transform hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <p className="text-sm text-gray-600 text-center mb-3">
                              Explore our {category.categoryName} collection
                            </p>
                            <button className="w-full px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition shadow-md">
                              Shop Now →
                            </button>
                            <div className="mt-4 text-center">
                              <p className="text-xs text-gray-500">
                                Free shipping on orders over $50
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile menu with 3 levels */}
        {mobileMenuOpen && (
          <>
            <div className="lg:hidden fixed inset-0 z-40 bg-white pt-16 overflow-y-auto">
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>
              <div className="px-4 py-4 space-y-4">
                <div className="relative ">
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={searchProduct}
                      placeholder="Search products, brands, categories..."
                      className={`w-full px-5 py-2.5 border rounded-full focus:outline-none focus:ring-2 transition-all duration-200
                    ${
                      searchFocused
                        ? "border-purple-500 ring-2 ring-purple-200 bg-white"
                        : "border-gray-300 bg-gray-50 hover:bg-white"
                    }
                  `}
                      onFocus={() => setOpen(true)}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSearchProduct(value);
                        setOpen(true);
                        setHighlightIndex(-1);
                      }}
                      onKeyDown={handleKeyDown}
                    />
                    <Search className="absolute bg-white right-4 top-3 h-5 w-5 text-gray-400" />
                  </div>

                  {open && (
                    <ul className="absolute z-50 w-full bg-white rounded-lg mt-12 shadow-lg max-h-80 overflow-auto border border-gray-200">
                      {filteredOptions.length === 0 ? (
                        <li className="px-4 py-8 text-center text-gray-500">
                          No products found
                        </li>
                      ) : (
                        filteredOptions.map((option, index) => (
                          <li
                            key={option.productID}
                            ref={(el) => {
                              itemRefs.current[index] = el;
                            }}
                            onMouseDown={() => handleSelect(option)}
                            className={`px-3 py-2 cursor-pointer transition-colors flex items-center gap-3 ${
                              index === highlightIndex
                                ? "bg-purple-50"
                                : "hover:bg-gray-50"
                            } ${index !== filteredOptions.length - 1 ? "border-b border-gray-100" : ""}`}
                          >
                            {/* Product Image */}
                            <img
                              src={
                                option.images?.[0]?.url ||
                                "https://t4.ftcdn.net/jpg/06/57/37/01/360_F_657370150_pdNeG5pjI976ZasVbKN9VqH1rfoykdYU.jpg"
                              }
                              alt={option.productName}
                              className="w-10 h-10 object-cover rounded-md"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://t4.ftcdn.net/jpg/06/57/37/01/360_F_657370150_pdNeG5pjI976ZasVbKN9VqH1rfoykdYU.jpg";
                              }}
                            />

                            {/* Product Name */}
                            <span
                              className={`text-sm flex-1 ${
                                index === highlightIndex
                                  ? "text-purple-600 font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              {option.productName}
                            </span>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>

                {/* Mobile categories with 3 levels */}
                {categoryData.map((category) => (
                  <div key={category.categoryID} className="space-y-2">
                    <button
                      onClick={() =>
                        setActiveCategory(
                          activeCategory === category.categoryID
                            ? null
                            : category.categoryID,
                        )
                      }
                      className="w-full flex items-center justify-between px-3 py-3 text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <span className="font-semibold">
                        {category.categoryName}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-200
                    ${activeCategory === category.categoryID ? "rotate-180" : ""}
                  `}
                      />
                    </button>

                    {activeCategory === category.categoryID && (
                      <div className="ml-4 space-y-3">
                        {category.subCategoryList.map((sub) => (
                          <div key={sub.subCategoryID} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <a
                                href=""
                                className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg flex-1"
                              >
                                {/* {sub.image && (
                                <div className="w-8 h-8 rounded overflow-hidden">
                                  <img
                                    src={sub.image}
                                    alt={sub.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )} */}
                                <span>{sub.subCategoryName}</span>
                              </a>
                              {sub.subCategoryDetailList &&
                                sub.subCategoryDetailList.length > 0 && (
                                  <Link
                                    href="/subMenu/Shop"
                                    onClick={() =>
                                      setActiveSubcategory(
                                        activeSubcategory === sub.subCategoryID
                                          ? null
                                          : sub.subCategoryID,
                                      )
                                    }
                                    className="p-2"
                                  >
                                    <ChevronRight
                                      className={`h-4 w-4 transition-transform duration-200
                                ${activeSubcategory === sub.subCategoryID ? "rotate-90" : ""}
                              `}
                                    />
                                  </Link>
                                )}
                            </div>

                            {/* Level 3 on mobile */}
                            {activeSubcategory === sub.subCategoryID &&
                              sub.subCategoryDetailList && (
                                <div className="ml-8 space-y-2">
                                  {sub.subCategoryDetailList.map((subsub) => (
                                    <a
                                      key={subsub.subCategoryDetailID}
                                      href=""
                                      className="block px-3 py-2 text-xs text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                                    >
                                      {subsub.name}
                                    </a>
                                  ))}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Add animation styles */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
        `}</style>
      </nav>
    </>
  );
}
