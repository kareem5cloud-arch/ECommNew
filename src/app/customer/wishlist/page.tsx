"use client";
import { useState } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: "Beige Trouser",
      price: "Rs. 1500",
      stock: "Available",
      image: "/collection1.jpg",
    },
    {
      id: 2,
      name: "Casual Shirt",
      price: "Rs. 1200",
      image: "/collection2.jpg",
      stock: "Out of Stock",
    },
    {
      id: 3,
      name: "Denim Jacket",
      price: "Rs. 2500",
      image: "/collection3.jpg",
      stock: "Available",
    },
  ]);

  const handleRemove = (id: number) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const handleAddToCart = (id: number) => {
    alert(`Item with ID ${id} added to cart!`);
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <Heart className="w-7 h-7 text-pink-500" /> My Wishlist
      </h1>

      {wishlist.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-gray-600 text-sm border-b border-gray-200">
                  <th className="py-3 px-4 font-medium">Product</th>
                  <th className="py-3 px-4 font-medium">Price</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {wishlist.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-all border-b border-gray-100 last:border-none"
                  >
                    {/* === Product Info === */}
                    <td className="py-4 px-4 flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">#{item.id}</p>
                      </div>
                    </td>

                    {/* === Price === */}
                    <td className="py-4 px-4 text-gray-800 font-medium">
                      {item.price}
                    </td>
                    <td className="py-4 px-4 text-gray-800 font-medium">
                      <span
                        className={`text-sm py-2 px-1 rounded-full ${
                          item.stock === "Available"
                            ? `bg-green-100 text-green-500`
                            : `bg-red-100 text-red-500`
                        }`}
                      >
                        {item.stock}
                      </span>
                    </td>

                    {/* === Actions === */}
                    <td className="py-4 px-4">
                      <div className="flex justify-center items-center gap-3">
                        {item.stock === "Out of Stock" ? (
                          <button
                            onClick={() => handleAddToCart(item.id)}
                            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition"
                            disabled
                          >
                            <ShoppingCart size={16} /> Add to Cart
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(item.id)}
                            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition"
                          >
                            <ShoppingCart size={16} /> Add to Cart
                          </button>
                        )}
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-2.5 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-lg transition"
                          title="Remove"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
          <Heart className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            Your wishlist is empty. Start adding products you love!
          </p>
        </div>
      )}
    </div>
  );
}
