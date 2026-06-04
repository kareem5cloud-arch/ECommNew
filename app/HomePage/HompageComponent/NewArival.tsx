// components/NewArrivals.tsx
"use client";
import { useState } from "react";
import { Heart, ShoppingCart, Eye, Star, ChevronRight } from "lucide-react";

interface Variant {
  id: string;
  name: string;
  color: string;
  image: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  variants?: Variant[];
}

const newArrivals: Product[] = [
  {
    id: "1",
    name: "Sony WH-1000XM5 Headphones",
    description: "Premium noise cancellation with exceptional sound quality",
    price: 399.99,
    originalPrice: 499.99,
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 128,
    variants: [
      {
        id: "v1",
        name: "Black",
        color: "#000000",
        image:
          "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
      },
      {
        id: "v2",
        name: "Silver",
        color: "#C0C0C0",
        image:
          "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
      },
      {
        id: "v3",
        name: "Blue",
        color: "#0000FF",
        image:
          "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
      },
    ],
  },
  {
    id: "2",
    name: "Apple iPhone 15 Pro Max",
    description: "A17 Pro chip, titanium design, 48MP main camera",
    price: 1199.99,
    originalPrice: 1299.99,
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 245,
    variants: [
      {
        id: "v1",
        name: "Natural Titanium",
        color: "#8B7355",
        image:
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
      },
      {
        id: "v2",
        name: "Blue Titanium",
        color: "#4A7B9D",
        image:
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
      },
    ],
  },
  {
    id: "3",
    name: "Nike Air Max 270",
    description: "Sustainable design with responsive cushioning",
    price: 149.99,
    originalPrice: 189.99,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 89,
    variants: [
      {
        id: "v1",
        name: "Black/White",
        color: "#000000",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      },
      {
        id: "v2",
        name: "Red/Black",
        color: "#FF0000",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      },
      {
        id: "v3",
        name: "Blue/White",
        color: "#0000FF",
        image:
          "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
      },
    ],
  },
  {
    id: "4",
    name: "Dyson V15 Detect Vacuum",
    description: "Intelligent cordless vacuum with laser detection",
    price: 699.99,
    originalPrice: 799.99,
    image:
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 56,
    variants: [
      {
        id: "v1",
        name: "Iron/Gold",
        color: "#8B4513",
        image:
          "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop",
      },
    ],
  },
  {
    id: "5",
    name: "Samsung 65 QN900C 8K TV",
    description: "8K resolution with Neo Quantum processor",
    price: 3299.99,
    originalPrice: 3999.99,
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 34,
  },
  {
    id: "6",
    name: "Lululemon Align Pant",
    description: "Buttery-soft Nulu fabric for ultimate comfort",
    price: 98.99,
    originalPrice: 128.99,
    image:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 167,
    variants: [
      {
        id: "v1",
        name: "Black",
        color: "#000000",
        image:
          "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop",
      },
      {
        id: "v2",
        name: "Navy",
        color: "#000080",
        image:
          "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop",
      },
    ],
  },
  {
    id: "7",
    name: "LEGO Millennium Falcon",
    description: "Ultimate Collector Series with 7,500+ pieces",
    price: 849.99,
    image:
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 234,
  },
  {
    id: "8",
    name: "KitchenAid Stand Mixer",
    description: "5-quart capacity with 10-speed settings",
    price: 449.99,
    originalPrice: 549.99,
    image:
      "https://images.unsplash.com/photo-1585515325310-5b6bafb30b0d?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 445,
    variants: [
      {
        id: "v1",
        name: "Red",
        color: "#FF0000",
        image:
          "https://images.unsplash.com/photo-1585515325310-5b6bafb30b0d?w=400&h=400&fit=crop",
      },
      {
        id: "v2",
        name: "Black",
        color: "#000000",
        image:
          "https://images.unsplash.com/photo-1585515325310-5b6bafb30b0d?w=400&h=400&fit=crop",
      },
    ],
  },
];

export default function NewArrivals() {
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, Variant>
  >({});

  const handleVariantSelect = (productId: string, variant: Variant) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variant,
    }));
  };

  const getCurrentImage = (product: Product) => {
    if (hoveredProductId === product.id && selectedVariants[product.id]) {
      return selectedVariants[product.id].image;
    }
    return product.image;
  };

  const handleAddToCart = (product: Product, variant?: Variant) => {
    console.log("Add to cart:", { product, variant });
  };

  const handleAddToWishlist = (product: Product) => {
    console.log("Add to wishlist:", product);
  };

  const handleQuickView = (product: Product) => {
    console.log("Quick view:", product);
  };

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            New Arrivals
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the latest products added to our collection
          </p>
          <div className="w-20 h-1 bg-purple-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {newArrivals.map((product) => {
            const currentImage = getCurrentImage(product);
            const selectedVariant = selectedVariants[product.id];

            return (
              <div
                key={product.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                onMouseEnter={() => setHoveredProductId(product.id)}
                onMouseLeave={() => setHoveredProductId(null)}
              >
                {/* Image Section */}
                <div className="relative overflow-hidden bg-gray-100 aspect-square">
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Hover Icons */}
                  <div
                    className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-3 transition-all duration-300
                    ${hoveredProductId === product.id ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                  >
                    <button
                      onClick={() => handleQuickView(product)}
                      className="bg-white p-2.5 rounded-full hover:bg-purple-600 hover:text-white transition-all transform hover:scale-110"
                      title="Quick View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleAddToWishlist(product)}
                      className="bg-white p-2.5 rounded-full hover:bg-red-500 hover:text-white transition-all transform hover:scale-110"
                      title="Add to Wishlist"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleAddToCart(product, selectedVariant)}
                      className="bg-purple-600 text-white p-2.5 rounded-full hover:bg-purple-700 transition-all transform hover:scale-110"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Discount Badge */}
                  {product.originalPrice && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      -
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100,
                      )}
                      %
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Product Name */}
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 text-xs mb-2 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-gray-700">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-purple-600">
                      ${product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Variants - Color Swatches (visible on hover) */}
                  {product.variants && product.variants.length > 0 && (
                    <div
                      className={`flex gap-2 transition-all duration-300 overflow-hidden
                      ${hoveredProductId === product.id ? "max-h-12 opacity-100 mt-0" : "max-h-0 opacity-0"}`}
                    >
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() =>
                            handleVariantSelect(product.id, variant)
                          }
                          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110
                            ${
                              selectedVariant?.id === variant.id
                                ? "border-purple-600 ring-2 ring-purple-200 scale-110"
                                : "border-gray-300"
                            }`}
                          style={{ backgroundColor: variant.color }}
                          title={variant.name}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300 group">
            <span>View All New Arrivals</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
