"use client";
import { useState } from "react";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function Cart() {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Beige Trouser",
      price: 1500,
      quantity: 1,
      stock: "Available",
      image: "/collection1.jpg",
    },
    {
      id: 2,
      name: "Casual Shirt",
      price: 1200,
      quantity: 2,
      stock: "Out of Stock",
      image: "/collection2.jpg",
    },
    {
      id: 3,
      name: "Denim Jacket",
      price: 2500,
      quantity: 1,
      stock: "Available",
      image: "/collection3.jpg",
    },
  ]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleQuantityChange = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemove = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
    setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
  };

  const handleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cart.length) setSelectedItems([]);
    else setSelectedItems(cart.map((item) => item.id));
  };

  const selectedTotal = cart
    .filter((item) => selectedItems.includes(item.id))
    .reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <ShoppingBag className="w-7 h-7 text-blue-600" /> My Cart
      </h1>

      {cart.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-gray-600 text-sm border-b border-gray-200">
                  <th className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === cart.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 accent-black cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 font-medium">Product</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Price</th>
                  <th className="py-3 px-4 font-medium text-center">
                    Quantity
                  </th>
                  <th className="py-3 px-4 font-medium text-right">Subtotal</th>
                  <th className="py-3 px-4 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition-all border-b border-gray-100 last:border-none ${
                      selectedItems.includes(item.id)
                        ? "bg-gray-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelect(item.id)}
                        className="w-4 h-4 accent-black cursor-pointer"
                      />
                    </td>

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

                    {/* === Stock Status === */}
                    <td className="py-4 px-4">
                      <span
                        className={`text-sm py-1 px-3 rounded-full font-medium ${
                          item.stock === "Available"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.stock}
                      </span>
                    </td>

                    {/* === Price === */}
                    <td className="py-4 px-4 text-gray-800 font-medium">
                      Rs. {item.price.toLocaleString()}
                    </td>

                    {/* === Quantity === */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 shadow-sm w-fit mx-auto">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="p-1 hover:bg-gray-100 rounded transition"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-gray-800 font-medium w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="p-1 hover:bg-gray-100 rounded transition"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>

                    {/* === Subtotal === */}
                    <td className="py-4 px-4 text-right text-gray-900 font-semibold">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </td>

                    {/* === Remove Button === */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-2.5 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-lg transition"
                        title="Remove"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* === CART SUMMARY === */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-700 text-lg">
              Selected Items:{" "}
              <span className="font-semibold">{selectedItems.length}</span> /{" "}
              {cart.length}
            </p>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <h3 className="text-xl font-bold text-gray-900">
                Total: Rs. {selectedTotal.toLocaleString()}
              </h3>
              <button
                disabled={selectedItems.length === 0}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  selectedItems.length > 0
                    ? "bg-black text-white hover:bg-gray-900"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
          <ShoppingBag className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            Your cart is empty. Add some items to get started!
          </p>
        </div>
      )}
    </div>
  );
}
