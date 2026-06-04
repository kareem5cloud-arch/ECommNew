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

// Types
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  rating: number;
  reviews: number;
  brand: string;
  category: string;
  subcategory?: string;
  inStock: boolean;
  discount?: number;
  isNew?: boolean;
  colors?: string[];
  sizes?: string[];
}

// Sample Products Data
const products: Product[] = [
  {
    id: "1",
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    description:
      "Premium noise cancellation with exceptional sound quality and 30-hour battery life.",
    price: 399.99,
    originalPrice: 499.99,
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 128,
    brand: "Sony",
    category: "Electronics",
    subcategory: "Headphones",
    inStock: true,
    discount: 20,
    colors: ["Black", "Silver", "Blue"],
  },
  {
    id: "2",
    name: "Apple iPhone 15 Pro Max",
    description:
      "A17 Pro chip, titanium design, 48MP main camera with 5x optical zoom.",
    price: 1199.99,
    originalPrice: 1299.99,
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 245,
    brand: "Apple",
    category: "Electronics",
    subcategory: "Smartphones",
    inStock: true,
    discount: 8,
    colors: ["Natural Titanium", "Blue Titanium", "White Titanium"],
  },
  {
    id: "3",
    name: "Nike Air Max 270 Next Nature",
    description:
      "Sustainable design with responsive cushioning and breathable mesh upper.",
    price: 149.99,
    originalPrice: 189.99,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 89,
    brand: "Nike",
    category: "Fashion",
    subcategory: "Shoes",
    inStock: true,
    discount: 21,
    sizes: ["US 7", "US 8", "US 9", "US 10"],
    colors: ["Black/White", "Red/Black"],
  },
  {
    id: "4",
    name: "Dyson V15 Detect Absolute Vacuum",
    description:
      "Intelligent cordless vacuum with laser detection and powerful suction.",
    price: 699.99,
    originalPrice: 799.99,
    image:
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 56,
    brand: "Dyson",
    category: "Home & Living",
    subcategory: "Appliances",
    inStock: false,
    discount: 12,
  },
  {
    id: "5",
    name: "Samsung 65 QN900C Neo QLED 8K TV",
    description: "Groundbreaking 8K resolution with Neo Quantum processor.",
    price: 3299.99,
    originalPrice: 3999.99,
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 34,
    brand: "Samsung",
    category: "Electronics",
    subcategory: "TVs",
    inStock: true,
    discount: 17,
  },
  {
    id: "6",
    name: "Lululemon Align High-Rise Pant",
    description: "Buttery-soft Nulu fabric for ultimate comfort during yoga.",
    price: 98.99,
    originalPrice: 128.99,
    image:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 167,
    brand: "Lululemon",
    category: "Fashion",
    subcategory: "Activewear",
    inStock: true,
    discount: 23,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Dark Olive"],
  },
  {
    id: "7",
    name: "LEGO Star Wars Millennium Falcon",
    description: "Ultimate Collector Series with 7,500+ pieces.",
    price: 849.99,
    image:
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 234,
    brand: "LEGO",
    category: "Toys",
    subcategory: "Building Sets",
    inStock: true,
    isNew: true,
  },
  {
    id: "8",
    name: "KitchenAid Artisan Stand Mixer",
    description: "5-quart capacity with 10-speed settings for perfect results.",
    price: 449.99,
    originalPrice: 549.99,
    image:
      "https://images.unsplash.com/photo-1585515325310-5b6bafb30b0d?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 445,
    brand: "KitchenAid",
    category: "Home & Living",
    subcategory: "Kitchen",
    inStock: true,
    discount: 18,
    colors: ["Empire Red", "Matte Black", "Silver"],
  },
  {
    id: "9",
    name: "Apple MacBook Pro 16 M3 Max",
    description:
      "Powerful performance for professionals with up to 22-hour battery life.",
    price: 3499.99,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 89,
    brand: "Apple",
    category: "Electronics",
    subcategory: "Laptops",
    inStock: true,
    isNew: true,
  },
  {
    id: "10",
    name: "Adidas Ultraboost 22 Running Shoes",
    description:
      "Responsive cushioning and energy return for ultimate comfort.",
    price: 179.99,
    originalPrice: 229.99,
    image:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 156,
    brand: "Adidas",
    category: "Fashion",
    subcategory: "Shoes",
    inStock: true,
    discount: 22,
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"],
  },
  {
    id: "11",
    name: "Bose QuietComfort Ultra Headphones",
    description: "Immersive audio with world-class noise cancellation.",
    price: 429.99,
    originalPrice: 499.99,
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 67,
    brand: "Bose",
    category: "Electronics",
    subcategory: "Headphones",
    inStock: true,
    discount: 14,
  },
  {
    id: "12",
    name: "The North Face ThermoBall Jacket",
    description: "Lightweight insulation that stays warm even when wet.",
    price: 249.99,
    image:
      "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 112,
    brand: "The North Face",
    category: "Fashion",
    subcategory: "Jackets",
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Olive"],
  },
];

// Categories for filter
const categories = ["All", "Electronics", "Fashion", "Home & Living", "Toys"];
const brands = [
  "All",
  "Apple",
  "Sony",
  "Samsung",
  "Nike",
  "Adidas",
  "Dyson",
  "Lululemon",
];
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Rating" },
];

export default function ShopPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showStockOnly, setShowStockOnly] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const itemsPerPage = 12;

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesBrand =
      selectedBrand === "All" || product.brand === selectedBrand;
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock = !showStockOnly || product.inStock;
    return (
      matchesCategory &&
      matchesBrand &&
      matchesPrice &&
      matchesSearch &&
      matchesStock
    );
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategory,
    selectedBrand,
    priceRange,
    sortBy,
    searchQuery,
    showStockOnly,
  ]);

  // Product Card Component
  const ProductCard = ({ product }: { product: Product }) => (
    <div
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setHoveredProduct(product.id)}
      onMouseLeave={() => setHoveredProduct(null)}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden bg-gray-100 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{product.discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              New
            </span>
          )}
        </div>

        {/* Hover Icons */}
        <div
          className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-3 transition-all duration-300
          ${hoveredProduct === product.id ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <button className="bg-white p-2.5 rounded-full hover:bg-gray-900 hover:text-white transition">
            <Heart className="w-4 h-4" />
          </button>
          <button className="bg-white p-2.5 rounded-full hover:bg-gray-900 hover:text-white transition">
            <Eye className="w-4 h-4" />
          </button>
          <button className="bg-gray-900 text-white p-2.5 rounded-full hover:bg-gray-800 transition">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold text-sm px-3 py-1 bg-black/50 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {product.brand}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm hover:text-gray-700 transition cursor-pointer">
          {product.name}
        </h3>

        <p className="text-gray-500 text-xs mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  // List View Component
  const ProductListItem = ({ product }: { product: Product }) => (
    <div className="flex gap-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4">
      <div className="relative w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
            -{product.discount}%
          </span>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs text-gray-500 uppercase">
              {product.brand}
            </span>
            <h3 className="font-semibold text-gray-900 hover:text-gray-700 transition">
              {product.name}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-xl font-bold text-gray-900">
              ${product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <Heart className="w-4 h-4" />
            </button>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedBrand("All");
                    setPriceRange([0, 5000]);
                    setShowStockOnly(false);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Reset All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-5">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Category
                </h4>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center justify-between w-full text-sm py-1.5 px-2 rounded-lg transition ${
                        selectedCategory === cat
                          ? "bg-gray-100 text-gray-900 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && (
                        <Check className="w-3 h-3" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-5">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Brand
                </h4>
                <div className="space-y-1">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`flex items-center justify-between w-full text-sm py-1.5 px-2 rounded-lg transition ${
                        selectedBrand === brand
                          ? "bg-gray-100 text-gray-900 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span>{brand}</span>
                      {selectedBrand === brand && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-5">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Price Range
                </h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}+</span>
                  </div>
                </div>
              </div>

              {/* In Stock Only */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showStockOnly}
                  onChange={(e) => setShowStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
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

                  <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 px-3 ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400"}`}
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 px-3 ${viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-400"}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

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
                Showing {paginatedProducts.length} of {sortedProducts.length}{" "}
                products
              </p>
            </div>

            {/* Products Grid/List */}
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No products found. Try adjusting your filters.
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedProducts.map((product) => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-2 rounded-lg text-sm transition ${
                      currentPage === i + 1
                        ? "bg-gray-900 text-white"
                        : "border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      {isFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-xl p-5 overflow-y-auto lg:hidden">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button onClick={() => setIsFilterOpen(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile filters content (same as desktop) */}
            <div className="mb-5">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Category
              </h4>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center justify-between w-full text-sm py-2 px-2 rounded-lg ${
                      selectedCategory === cat ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    {cat}
                    {selectedCategory === cat && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Brand</h4>
              <div className="space-y-1">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`flex items-center justify-between w-full text-sm py-2 px-2 rounded-lg ${
                      selectedBrand === brand ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    {brand}
                    {selectedBrand === brand && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsFilterOpen(false)}
              className="w-full mt-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium"
            >
              Apply Filters
            </button>
          </div>
        </>
      )}
    </div>
  );
}
