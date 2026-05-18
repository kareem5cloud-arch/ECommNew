"use client";
import CustoemrStats from "@/api/lib/CustomerAuthentication/CustomerStats.ts/CustomerStats";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Wallet,
  Star,
  Heart,
  MessageSquare,
  Calendar,
  ShoppingCart,
} from "lucide-react";
import { useEffect, useState } from "react";
interface response {
  totalOrders: number;
  totalPendingOrders: number;
  totalCompletedOrders: number;
  totalCartItem: number;
  totalWishList: number;
}
export default function Overview() {
  const [totalOrder, setTotalOrder] = useState(0);
  const [CompletedOrder, setCompletedOrder] = useState(0);
  const [PendingOrder, setPendingOrder] = useState(0);
  const [cartItem, setcartItem] = useState(0);
  const [WishList, setWishList] = useState(0);
  const stats = [
    {
      id: 1,
      title: "Total Orders",
      value: totalOrder,
      icon: ShoppingBag,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 2,
      title: "Pending Orders",
      value: PendingOrder,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      id: 3,
      title: "Completed Orders",
      value: CompletedOrder,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },

    {
      id: 5,
      title: "My Reviews",
      value: "14",
      icon: Star,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: 6,
      title: "Wishlist Items",
      value: WishList,
      icon: Heart,
      color: "bg-pink-100 text-pink-600",
    },
    {
      id: 7,
      title: "Cart Items",
      value: cartItem,
      icon: ShoppingCart,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  const getStats = async () => {
    const token = localStorage.getItem("token1");
    const response = await CustoemrStats(String(token));
    if (response.status === 200 || response.status == 201) {
      const data = response.data as response;
      console.log(data);
      setTotalOrder(data.totalOrders);
      setPendingOrder(data.totalPendingOrders);
      setCompletedOrder(data.totalCompletedOrders);
      setWishList(data.totalWishList);
      setcartItem(data.totalCartItem);
    } else {
      console.log();
    }
  };

  useEffect(() => {
    getStats();
  }, []);
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Dashboard Overview
      </h1>

      {/* === STAT CARDS GRID === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5"
          >
            <div>
              <p className="text-sm text-gray-500 font-medium">{item.title}</p>
              <h2 className="text-2xl font-bold text-gray-900 mt-2">
                {item.value}
              </h2>
            </div>
            <div
              className={`p-3 rounded-full ${item.color} flex items-center justify-center`}
            >
              <item.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* === RECENT ORDERS SECTION === */}
      <div className="mt-10 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-t border-gray-100 text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: "#4587",
                  product: "Beige Trouser",
                  status: "Delivered",
                  amount: "Rs. 1500",
                  date: "Oct 25, 2025",
                },
                {
                  id: "#4586",
                  product: "Casual Shirt",
                  status: "Pending",
                  amount: "Rs. 1200",
                  date: "Oct 28, 2025",
                },
                {
                  id: "#4585",
                  product: "Denim Jacket",
                  status: "Processing",
                  amount: "Rs. 2500",
                  date: "Oct 21, 2025",
                },
              ].map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-medium text-gray-700">
                    {order.id}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{order.product}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-md font-semibold ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{order.amount}</td>
                  <td className="py-3 px-4 text-gray-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
