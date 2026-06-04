// components/WishlistSidebar.tsx
"use client";
import { useState, useEffect } from "react";
import {
  X,
  Heart,
  ShoppingBag,
  Trash2,
  ShoppingCart,
  MoveRight,
  AlertCircle,
  Star,
} from "lucide-react";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  discount?: number;
}

interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (item: WishlistItem) => void;
}

// Sample wishlist data
const sampleWishlistItems: WishlistItem[] = [
  {
    id: "1",
    name: "Sony WH-1000XM5 Wireless Headphones",
    price: 399.99,
    originalPrice: 499.99,
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&h=200&fit=crop",
    rating: 4.9,
    reviews: 128,
    inStock: true,
    discount: 20,
  },
  {
    id: "2",
    name: "Apple iPhone 15 Pro Max",
    price: 1199.99,
    originalPrice: 1299.99,
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&h=200&fit=crop",
    rating: 4.8,
    reviews: 245,
    inStock: true,
    discount: 8,
  },
  {
    id: "3",
    name: "Dyson V15 Detect Absolute Vacuum",
    price: 699.99,
    originalPrice: 799.99,
    image:
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=200&h=200&fit=crop",
    rating: 4.9,
    reviews: 56,
    inStock: false,
    discount: 12,
  },
  {
    id: "4",
    name: "Nike Air Max 270",
    price: 149.99,
    originalPrice: 189.99,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
    rating: 4.7,
    reviews: 89,
    inStock: true,
    discount: 21,
  },
];

export default function WishlistSidebar({
  isOpen,
  onClose,
  onAddToCart,
}: WishlistSidebarProps) {
  const [wishlistItems, setWishlistItems] =
    useState<WishlistItem[]>(sampleWishlistItems);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const removeFromWishlist = (id: string) => {
    setWishlistItems((items) => items.filter((item) => item.id !== id));
  };

  const handleAddToCart = (item: WishlistItem) => {
    setAddingToCart(item.id);
    setTimeout(() => {
      if (onAddToCart) {
        onAddToCart(item);
      }
      setAddingToCart(null);
      // Optional: remove from wishlist after adding to cart
      // removeFromWishlist(item.id);
    }, 800);
  };

  const moveAllToCart = () => {
    const inStockItems = wishlistItems.filter((item) => item.inStock);
    inStockItems.forEach((item) => {
      if (onAddToCart) {
        onAddToCart(item);
      }
    });
    // Optional: clear wishlist after moving all
    // setWishlistItems([]);
  };

  const totalSavings = wishlistItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price);
    }
    return sum;
  }, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Heart className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {wishlistItems.length}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Wishlist</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Savings Banner */}
        {totalSavings > 0 && wishlistItems.length > 0 && (
          <div className="mx-4 mt-4 p-3 bg-green-50 border border-green-100 rounded-lg">
            <p className="text-sm text-green-700 flex items-center gap-2">
              <span className="text-lg">💸</span>
              You're saving ${totalSavings.toFixed(2)} on your wishlist!
            </p>
          </div>
        )}

        {/* Wishlist Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Save items you love to your wishlist
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Move All Button */}
              <button
                onClick={moveAllToCart}
                className="w-full py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Move all to cart
                <MoveRight className="w-4 h-4" />
              </button>

              {/* Items List */}
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:shadow-md transition-all group"
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {item.discount && (
                      <div className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                        -{item.discount}%
                      </div>
                    )}
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          Out of stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {item.name}
                        </h4>
                        {/* Rating */}
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex items-center">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium text-gray-700 ml-0.5">
                              {item.rating}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">
                            ({item.reviews})
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-red-100 rounded-full"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">
                          ${item.price.toLocaleString()}
                        </span>
                        {item.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            ${item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.inStock || addingToCart === item.id}
                      className={`mt-2 w-full py-1.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                        item.inStock
                          ? "bg-gray-900 text-white hover:bg-gray-800"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {addingToCart === item.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          {item.inStock ? "Add to Cart" : "Out of Stock"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer with Recommendations */}
        {wishlistItems.length > 0 && (
          <div className="border-t border-gray-100 p-4 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              You might also like
            </h4>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[
                {
                  id: "rec1",
                  name: "Samsung Galaxy Buds2 Pro",
                  price: 229.99,
                  image:
                    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop",
                },
                {
                  id: "rec2",
                  name: "Apple Watch Series 9",
                  price: 399.99,
                  image:
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
                },
                {
                  id: "rec3",
                  name: "Logitech MX Master 3S",
                  price: 99.99,
                  image:
                    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=100&h=100&fit=crop",
                },
              ].map((rec) => (
                <div
                  key={rec.id}
                  className="flex-shrink-0 w-24 bg-white rounded-lg p-2 text-center cursor-pointer hover:shadow-md transition"
                >
                  <img
                    src={rec.image}
                    alt={rec.name}
                    className="w-full h-16 object-cover rounded-md mb-1"
                  />
                  <p className="text-xs text-gray-700 line-clamp-2">
                    {rec.name}
                  </p>
                  <p className="text-xs font-semibold text-gray-900 mt-1">
                    ${rec.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
