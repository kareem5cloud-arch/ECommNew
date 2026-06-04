// app/product/[id]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Check,
  Share2,
  AlertCircle,
  Clock,
  Package,
  Award,
  MessageCircle,
} from "lucide-react";

// Types
interface ProductVariant {
  id: string;
  name: string;
  color: string;
  image: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviews: Review[];
  brand: string;
  category: string;
  subcategory?: string;
  inStock: boolean;
  sku: string;
  discount?: number;
  isNew?: boolean;
  features?: string[];
  specifications?: Record<string, string>;
  variants?: ProductVariant[];
  sizes?: string[];
  colors?: string[];
  shipping?: {
    weight: string;
    dimensions: string;
    estimatedDelivery: string;
  };
  warranty?: string;
  returnPolicy?: string;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
}

// Sample product data
const sampleProduct: Product = {
  id: "1",
  name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
  description:
    "Premium noise cancellation with exceptional sound quality and 30-hour battery life.",
  longDescription: `Experience the ultimate in noise cancellation with the Sony WH-1000XM5 headphones. 
    These premium headphones feature Sony's industry-leading noise cancellation technology, 
    delivering an immersive audio experience that adapts to your environment.
    
    The newly developed driver unit and improved noise isolation ensure that every note is heard with 
    crystal clarity, while the lightweight design provides all-day comfort. With up to 30 hours of 
    battery life and quick charging capabilities, you'll never miss a beat.
    
    Whether you're a frequent traveler, remote worker, or music enthusiast, the WH-1000XM5 offers 
    the perfect blend of performance, comfort, and style.`,
  price: 399.99,
  originalPrice: 499.99,
  images: [
    "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop&1",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
  ],
  rating: 4.9,
  reviews: [
    {
      id: "1",
      userName: "Michael Chen",
      rating: 5,
      title: "Best headphones I've ever owned!",
      comment:
        "The noise cancellation is absolutely incredible. I use them on my daily commute and flights, and they completely block out all ambient noise. Sound quality is superb with rich bass and clear highs. Battery life lasts me a full week of heavy use.",
      date: "2024-01-15",
      verified: true,
      helpful: 45,
    },
    {
      id: "2",
      userName: "Sarah Johnson",
      rating: 5,
      title: "Worth every penny",
      comment:
        "Comfortable for all-day wear, amazing sound quality, and the battery life is impressive. The touch controls work flawlessly. Highly recommend!",
      date: "2024-01-10",
      verified: true,
      helpful: 32,
    },
    {
      id: "3",
      userName: "David Kim",
      rating: 4,
      title: "Great sound, premium build",
      comment:
        "Sound quality is fantastic and the build feels premium. The only downside is the price, but you get what you pay for. Noise cancellation is top-tier.",
      date: "2024-01-05",
      verified: true,
      helpful: 28,
    },
  ],
  brand: "Sony",
  category: "Electronics",
  subcategory: "Headphones",
  inStock: true,
  sku: "WH-1000XM5-BLK",
  discount: 20,
  features: [
    "Industry-leading noise cancellation with Dual Noise Sensor technology",
    "30-hour battery life with quick charging (3 minutes charge for 3 hours playback)",
    "Lightweight design with soft fit leather for all-day comfort",
    "Multipoint connection to pair with two devices simultaneously",
    "HD Noise Cancelling Processor QN1 and Integrated Processor V1",
    "Speak-to-chat technology automatically pauses music when you speak",
  ],
  specifications: {
    Brand: "Sony",
    Model: "WH-1000XM5",
    Color: "Black",
    Connectivity: "Bluetooth 5.2, 3.5mm Jack",
    "Battery Life": "Up to 30 hours",
    "Charging Time": "3 hours",
    "Driver Unit": "30mm",
    "Frequency Response": "4Hz - 40kHz",
    Impedance: "48 ohms",
    Weight: "250g",
  },
  variants: [
    {
      id: "v1",
      name: "Black",
      color: "#000000",
      image:
        "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop",
      stock: 15,
    },
    {
      id: "v2",
      name: "Silver",
      color: "#C0C0C0",
      image:
        "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop",
      stock: 8,
    },
    {
      id: "v3",
      name: "Blue",
      color: "#0000FF",
      image:
        "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop",
      stock: 3,
    },
  ],
  shipping: {
    weight: "0.5 kg",
    dimensions: "20 x 15 x 10 cm",
    estimatedDelivery: "2-4 business days",
  },
  warranty: "1 year manufacturer warranty",
  returnPolicy: "30-day easy returns",
};

// Related products
const relatedProducts = [
  {
    id: "r1",
    name: "Bose QuietComfort Ultra Headphones",
    price: 429.99,
    originalPrice: 499.99,
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&h=200&fit=crop",
    rating: 4.8,
  },
  {
    id: "r2",
    name: "Apple AirPods Max",
    price: 549.99,
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&h=200&fit=crop",
    rating: 4.7,
  },
  {
    id: "r3",
    name: "Sennheiser Momentum 4",
    price: 349.99,
    originalPrice: 399.99,
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&h=200&fit=crop",
    rating: 4.8,
  },
  {
    id: "r4",
    name: "Sony WH-1000XM4",
    price: 299.99,
    originalPrice: 349.99,
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&h=200&fit=crop",
    rating: 4.7,
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "reviews"
  >("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setProduct(sampleProduct);
      setLoading(false);
    }, 500);
  }, [params.id]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (
      newQuantity >= 1 &&
      newQuantity <= (selectedVariant?.stock || product?.inStock ? 10 : 0)
    ) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", {
      product,
      variant: selectedVariant,
      size: selectedSize,
      quantity,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Product not found</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentVariant = selectedVariant || product.variants?.[0];
  const currentImage = currentVariant?.image || product.images[selectedImage];
  const isLowStock = currentVariant?.stock ? currentVariant.stock < 10 : false;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button
            onClick={() => router.push("/")}
            className="hover:text-gray-700"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => router.push("/shop")}
            className="hover:text-gray-700"
          >
            Shop
          </button>
          <span>/</span>
          <span className="text-gray-900">{product.brand}</span>
          <span>/</span>
          <span className="text-gray-900 truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative aspect-square">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.discount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                    -{product.discount}%
                  </div>
                )}
                {product.isNew && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white text-sm font-bold px-2 py-1 rounded">
                    New
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-3 overflow-x-auto">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                        selectedImage === idx
                          ? "border-gray-900"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  {product.variants?.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setSelectedImage(0);
                      }}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                        currentVariant?.id === variant.id
                          ? "border-gray-900"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: variant.color }}
                    >
                      <img
                        src={variant.image}
                        alt={variant.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              {/* Brand */}
              <div className="text-sm text-gray-500 mb-2">{product.brand}</div>

              {/* Title */}
              <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-gray-900">
                    {product.rating}
                  </span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-500">
                  {product.reviews.length} reviews
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-500">
                  SKU: {product.sku}
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-sm text-green-600 font-medium">
                      Save $
                      {(product.originalPrice! - product.price).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Short Description */}
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Color
                  </h3>
                  <div className="flex gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                          currentVariant?.id === variant.id
                            ? "border-gray-900 ring-2 ring-gray-200"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: variant.color }}
                        title={variant.name}
                      >
                        {currentVariant?.id === variant.id && (
                          <Check className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Size
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg text-sm transition ${
                          selectedSize === size
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-5">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Quantity
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-2 hover:bg-gray-50 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 hover:bg-gray-50 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {isLowStock && (
                    <p className="text-sm text-orange-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Only {currentVariant?.stock} left in stock
                    </p>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.inStock ? (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <Check className="w-4 h-4" />
                    In Stock - Ready to Ship
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                  >
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  {/* {showShareMenu && (
                    <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 p-2 z-10">
                      <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded w-full text-sm">
                        <Facebook className="w-4 h-4" /> Facebook
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded w-full text-sm">
                        <Twitter className="w-4 h-4" /> Twitter
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded w-full text-sm">
                        <Instagram className="w-4 h-4" /> Instagram
                      </button>
                    </div>
                  )} */}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Free shipping on orders $50+
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RefreshCw className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">30-day easy returns</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    2-year warranty included
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="border-b border-gray-100">
              <div className="flex gap-6 px-6">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`py-4 text-sm font-medium transition relative ${
                    activeTab === "description"
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Description
                  {activeTab === "description" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("specifications")}
                  className={`py-4 text-sm font-medium transition relative ${
                    activeTab === "specifications"
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Specifications
                  {activeTab === "specifications" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`py-4 text-sm font-medium transition relative ${
                    activeTab === "reviews"
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Reviews ({product.reviews.length})
                  {activeTab === "reviews" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                  )}
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === "description" && (
                <div className="space-y-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {product.longDescription}
                    </p>
                  </div>

                  {product.features && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Key Features
                      </h3>
                      <ul className="space-y-2">
                        {product.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Shipping
                        </p>
                        <p className="text-sm text-gray-500">
                          Weight: {product.shipping?.weight}
                          <br />
                          Dimensions: {product.shipping?.dimensions}
                          <br />
                          Est. delivery: {product.shipping?.estimatedDelivery}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Warranty
                        </p>
                        <p className="text-sm text-gray-500">
                          {product.warranty}
                        </p>
                        <p className="text-sm text-gray-500">
                          {product.returnPolicy}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* {activeTab === "specifications" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between py-2 border-b border-gray-100"
                      >
                        <span className="text-sm text-gray-500">{key}</span>
                        <span className="text-sm text-gray-900 font-medium">
                          {value}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              )} */}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Review Summary */}
                  <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">
                        {product.rating}
                      </div>
                      <div className="flex text-yellow-400 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : ""}`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {product.reviews.length} reviews
                      </div>
                    </div>
                    <div className="flex-1">
                      <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">
                        Write a Review
                      </button>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-5">
                    {product.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100 pb-5"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">
                                {review.userName}
                              </span>
                              {review.verified && (
                                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">
                            {review.date}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {review.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {review.comment}
                        </p>
                        <button className="text-xs text-gray-500 hover:text-gray-700">
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => router.push(`/product/${product.id}`)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 cursor-pointer"
              >
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{product.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
