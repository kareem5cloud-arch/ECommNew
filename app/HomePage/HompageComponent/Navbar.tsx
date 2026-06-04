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
} from "lucide-react";
import CartSidebar from "../useFullComponent/cartSideBar";
import AuthModal from "./LoginSignUp";
import WishlistSidebar from "../useFullComponent/wishListSideBar";

interface SubSubcategory {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  image?: string;
  subcategories?: SubSubcategory[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  subcategories: Subcategory[];
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(
    null,
  );
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sample categories data with 3 levels
  const categories: Category[] = [
    {
      id: "1",
      name: "Electronics",
      slug: "electronics",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop",
      subcategories: [
        {
          id: "1-1",
          name: "Smartphones",
          slug: "smartphones",
          image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=150&fit=crop",
          subcategories: [
            {
              id: "1-1-1",
              name: "Apple",
              slug: "apple",
              image:
                "https://images.unsplash.com/photo-1591332936887-76c0a0b98de3?w=200&h=150&fit=crop",
            },
            {
              id: "1-1-2",
              name: "Samsung",
              slug: "samsung",
              image:
                "https://images.unsplash.com/photo-1610945264803-c22e62d2a7b3?w=200&h=150&fit=crop",
            },
            {
              id: "1-1-3",
              name: "Xiaomi",
              slug: "xiaomi",
              image:
                "https://images.unsplash.com/photo-1592899677977-9e10cb588be2?w=200&h=150&fit=crop",
            },
            {
              id: "1-1-4",
              name: "Google Pixel",
              slug: "google-pixel",
              image:
                "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&h=150&fit=crop",
            },
          ],
        },
        {
          id: "1-2",
          name: "Laptops",
          slug: "laptops",
          image:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=150&fit=crop",
          subcategories: [
            {
              id: "1-2-1",
              name: "Gaming Laptops",
              slug: "gaming-laptops",
              image:
                "https://images.unsplash.com/photo-1593642702821-c8da6771f0c4?w=200&h=150&fit=crop",
            },
            {
              id: "1-2-2",
              name: "Business Laptops",
              slug: "business-laptops",
              image:
                "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=150&fit=crop",
            },
            {
              id: "1-2-3",
              name: "Ultrabooks",
              slug: "ultrabooks",
              image:
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=150&fit=crop",
            },
          ],
        },
        {
          id: "1-3",
          name: "Headphones",
          slug: "headphones",
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=150&fit=crop",
          subcategories: [
            {
              id: "1-3-1",
              name: "Wireless",
              slug: "wireless-headphones",
              image:
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=150&fit=crop",
            },
            {
              id: "1-3-2",
              name: "Noise Cancelling",
              slug: "noise-cancelling",
              image:
                "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&h=150&fit=crop",
            },
            {
              id: "1-3-3",
              name: "Gaming Headsets",
              slug: "gaming-headsets",
              image:
                "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=200&h=150&fit=crop",
            },
          ],
        },
        {
          id: "1-4",
          name: "Cameras",
          slug: "cameras",
          image:
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&h=150&fit=crop",
        },
        {
          id: "1-5",
          name: "Smart Watches",
          slug: "smart-watches",
          image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=150&fit=crop",
        },
      ],
    },
    {
      id: "2",
      name: "Fashion",
      slug: "fashion",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop",
      subcategories: [
        {
          id: "2-1",
          name: "Men's Clothing",
          slug: "mens-clothing",
          image:
            "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&h=150&fit=crop",
          subcategories: [
            {
              id: "2-1-1",
              name: "Shirts",
              slug: "shirts",
              image:
                "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=200&h=150&fit=crop",
            },
            {
              id: "2-1-2",
              name: "T-Shirts",
              slug: "t-shirts",
              image:
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=150&fit=crop",
            },
            {
              id: "2-1-3",
              name: "Jeans",
              slug: "jeans",
              image:
                "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&h=150&fit=crop",
            },
            {
              id: "2-1-4",
              name: "Suits",
              slug: "suits",
              image:
                "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&h=150&fit=crop",
            },
          ],
        },
        {
          id: "2-2",
          name: "Women's Clothing",
          slug: "womens-clothing",
          image:
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=150&fit=crop",
          subcategories: [
            {
              id: "2-2-1",
              name: "Dresses",
              slug: "dresses",
              image:
                "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=200&h=150&fit=crop",
            },
            {
              id: "2-2-2",
              name: "Tops",
              slug: "tops",
              image:
                "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=200&h=150&fit=crop",
            },
            {
              id: "2-2-3",
              name: "Skirts",
              slug: "skirts",
              image:
                "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=200&h=150&fit=crop",
            },
          ],
        },
        {
          id: "2-3",
          name: "Shoes",
          slug: "shoes",
          image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=150&fit=crop",
          subcategories: [
            {
              id: "2-3-1",
              name: "Sports Shoes",
              slug: "sports-shoes",
              image:
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=150&fit=crop",
            },
            {
              id: "2-3-2",
              name: "Formal Shoes",
              slug: "formal-shoes",
              image:
                "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=200&h=150&fit=crop",
            },
            {
              id: "2-3-3",
              name: "Casual Shoes",
              slug: "casual-shoes",
              image:
                "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=200&h=150&fit=crop",
            },
          ],
        },
        {
          id: "2-4",
          name: "Accessories",
          slug: "accessories",
          image:
            "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&h=150&fit=crop",
        },
      ],
    },
    {
      id: "3",
      name: "Home & Living",
      slug: "home-living",
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop",
      subcategories: [
        {
          id: "3-1",
          name: "Furniture",
          slug: "furniture",
          image:
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=150&fit=crop",
          subcategories: [
            {
              id: "3-1-1",
              name: "Sofas",
              slug: "sofas",
              image:
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=150&fit=crop",
            },
            {
              id: "3-1-2",
              name: "Beds",
              slug: "beds",
              image:
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=200&h=150&fit=crop",
            },
            {
              id: "3-1-3",
              name: "Tables",
              slug: "tables",
              image:
                "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=200&h=150&fit=crop",
            },
          ],
        },
        {
          id: "3-2",
          name: "Decor",
          slug: "decor",
          image:
            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&h=150&fit=crop",
        },
        {
          id: "3-3",
          name: "Kitchen",
          slug: "kitchen",
          image:
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=150&fit=crop",
        },
      ],
    },
    {
      id: "4",
      name: "Beauty",
      slug: "beauty",
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop",
      subcategories: [
        {
          id: "4-1",
          name: "Skincare",
          slug: "skincare",
          image:
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=150&fit=crop",
          subcategories: [
            {
              id: "4-1-1",
              name: "Moisturizers",
              slug: "moisturizers",
              image:
                "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=150&fit=crop",
            },
            {
              id: "4-1-2",
              name: "Serums",
              slug: "serums",
              image:
                "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=200&h=150&fit=crop",
            },
          ],
        },
        {
          id: "4-2",
          name: "Makeup",
          slug: "makeup",
          image:
            "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200&h=150&fit=crop",
        },
      ],
    },
    {
      id: "5",
      name: "Sports",
      slug: "sports",
      image:
        "https://images.unsplash.com/photo-1461896836934-ffe807baa8b8?w=600&h=400&fit=crop",
      subcategories: [
        {
          id: "5-1",
          name: "Running",
          slug: "running",
          image:
            "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=200&h=150&fit=crop",
        },
        {
          id: "5-2",
          name: "Gym",
          slug: "gym",
          image:
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=150&fit=crop",
        },
      ],
    },
  ];

  const activeCategoryData = categories.find((c) => c.id === activeCategory);

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

  return (
    <>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultMode={authMode}
      />
      <WishlistSidebar
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onAddToCart={handleAddToCart}
      />
      <nav
        className={`bg-white transition-all duration-300 sticky top-0 z-10 ${scrolled ? "shadow-lg" : "shadow-md"}`}
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top bar */}
          <div className="flex items-center justify-between h-16 lg:h-20">
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
                <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ShopHub
                </span>
              </div>
            </div>

            {/* Search bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  className={`w-full px-5 py-2.5 border rounded-full focus:outline-none focus:ring-2 transition-all duration-200
                  ${
                    searchFocused
                      ? "border-purple-500 ring-2 ring-purple-200 bg-white"
                      : "border-gray-300 bg-gray-50 hover:bg-white"
                  }
                `}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <Search className="absolute right-4 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Right icons */}
            <div className="flex items-center space-x-3 lg:space-x-5">
              <button className="hidden lg:flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                <Heart
                  onClick={() => setIsWishlistOpen(true)}
                  className="h-5 w-5"
                />
                <span className="text-sm font-medium">Wishlist</span>
              </button>
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
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-600 hover:text-purple-600 transition-colors"
              >
                <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6" />
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  3
                </span>
              </button>
            </div>
          </div>

          {/* Categories - Desktop */}
          <div className="hidden lg:block border-t border-gray-100">
            <div className="flex justify-center space-x-1 xl:space-x-8">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(category.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`px-4 xl:px-6 py-4 text-sm font-medium transition-all duration-200 flex items-center space-x-1 relative
                    ${
                      activeCategory === category.id
                        ? "text-purple-600"
                        : "text-gray-700 hover:text-purple-600"
                    }
                  `}
                  >
                    <span>{category.name}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200
                    ${activeCategory === category.id ? "rotate-180" : ""}
                  `}
                    />
                    {activeCategory === category.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full"></div>
                    )}
                  </button>

                  {/* Dropdown menu - 3 Level */}
                  {activeCategory === category.id && (
                    <div className="absolute left-0 mt-0 w-screen max-w-6xl bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                      <div className="flex">
                        {/* Level 1 & 2 - Subcategories */}
                        <div className="w-2/3 p-6 border-r border-gray-100">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                            <span>{category.name}</span>
                            <a
                              href={`/category/${category.slug}`}
                              className="text-xs text-purple-600 hover:underline"
                            >
                              View All →
                            </a>
                          </h3>
                          <div className="grid grid-cols-2 gap-6">
                            {category.subcategories.map((sub) => (
                              <div key={sub.id} className="relative group/sub">
                                <div className="flex items-center justify-between">
                                  <a
                                    href={`/category/${category.slug}/${sub.slug}`}
                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50 transition-colors duration-200 flex-1"
                                  >
                                    {sub.image && (
                                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img
                                          src={sub.image}
                                          alt={sub.name}
                                          className="w-full h-full object-cover group-hover/sub:scale-110 transition-transform duration-200"
                                        />
                                      </div>
                                    )}
                                    <span className="text-gray-700 group-hover/sub:text-purple-600 font-medium text-sm">
                                      {sub.name}
                                    </span>
                                  </a>
                                  {sub.subcategories &&
                                    sub.subcategories.length > 0 && (
                                      <ChevronRight className="h-4 w-4 text-gray-400" />
                                    )}
                                </div>

                                {/* Level 3 - Sub-subcategories */}
                                {sub.subcategories &&
                                  sub.subcategories.length > 0 && (
                                    <div className="ml-12 mt-1 space-y-1">
                                      {sub.subcategories
                                        .slice(0, 3)
                                        .map((subsub) => (
                                          <a
                                            key={subsub.id}
                                            href={`/category/${category.slug}/${sub.slug}/${subsub.slug}`}
                                            className="block text-xs text-gray-500 hover:text-purple-600 py-1 transition-colors"
                                          >
                                            {subsub.name}
                                          </a>
                                        ))}
                                      {sub.subcategories.length > 3 && (
                                        <a
                                          href="#"
                                          className="block text-xs text-purple-600 hover:underline mt-1"
                                        >
                                          +{sub.subcategories.length - 3} more
                                        </a>
                                      )}
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Category Image & Promo */}
                        <div className="w-1/3 bg-gradient-to-br from-purple-50 to-pink-50 p-6 flex flex-col">
                          <div className="rounded-xl overflow-hidden shadow-lg mb-4">
                            <img
                              src={activeCategoryData?.image}
                              alt={activeCategoryData?.name}
                              className="w-full h-56 object-cover transform hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <p className="text-sm text-gray-600 text-center mb-3">
                            Explore our {category.name} collection
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
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile menu with 3 levels */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-white pt-16 overflow-y-auto">
            <div className="px-4 py-4 space-y-4">
              {/* Search bar - Mobile */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>

              {/* Mobile categories with 3 levels */}
              {categories.map((category) => (
                <div key={category.id} className="space-y-2">
                  <button
                    onClick={() =>
                      setActiveCategory(
                        activeCategory === category.id ? null : category.id,
                      )
                    }
                    className="w-full flex items-center justify-between px-3 py-3 text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <span className="font-semibold">{category.name}</span>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-200
                    ${activeCategory === category.id ? "rotate-180" : ""}
                  `}
                    />
                  </button>

                  {activeCategory === category.id && (
                    <div className="ml-4 space-y-3">
                      {category.subcategories.map((sub) => (
                        <div key={sub.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <a
                              href={`/category/${category.slug}/${sub.slug}`}
                              className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg flex-1"
                            >
                              {sub.image && (
                                <div className="w-8 h-8 rounded overflow-hidden">
                                  <img
                                    src={sub.image}
                                    alt={sub.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <span>{sub.name}</span>
                            </a>
                            {sub.subcategories &&
                              sub.subcategories.length > 0 && (
                                <button
                                  onClick={() =>
                                    setActiveSubcategory(
                                      activeSubcategory === sub.id
                                        ? null
                                        : sub.id,
                                    )
                                  }
                                  className="p-2"
                                >
                                  <ChevronRight
                                    className={`h-4 w-4 transition-transform duration-200
                                ${activeSubcategory === sub.id ? "rotate-90" : ""}
                              `}
                                  />
                                </button>
                              )}
                          </div>

                          {/* Level 3 on mobile */}
                          {activeSubcategory === sub.id &&
                            sub.subcategories && (
                              <div className="ml-8 space-y-2">
                                {sub.subcategories.map((subsub) => (
                                  <a
                                    key={subsub.id}
                                    href={`/category/${category.slug}/${sub.slug}/${subsub.slug}`}
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

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <button className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-gray-700 hover:bg-purple-50 rounded-lg">
                  <Heart className="h-5 w-5" />
                  <span>Wishlist</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-gray-700 hover:bg-purple-50 rounded-lg">
                  <User className="h-5 w-5" />
                  <span>Account</span>
                </button>
              </div>
            </div>
          </div>
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
