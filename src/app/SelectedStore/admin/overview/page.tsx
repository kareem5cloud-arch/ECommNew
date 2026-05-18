"use client";
import GetStoreOnBoard from "@/api/lib/MainDashbaord/Overview/OverView";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Wallet,
  Star,
  Package,
  TrendingUp,
  DollarSign,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ResponseData {
  queryTotalProducts: number;
  queryPendingOrders: number;
  queryCompletedOrders: number;
  queryTotalRevenue: number;
  queryTopRating: number;
}

export default function SellerOverview({ storeID }: { storeID: string }) {
  const [totalProduct, setTotalProduct] = useState(0);
  const [pendingOrder, setPendingOrder] = useState(0);
  const [CompleteOrder, setCompleteOrder] = useState(0);
  const [TopRating, setTopRating] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const stats = [
    {
      id: 1,
      title: "Total Products",
      value: totalProduct,
      icon: Package,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 2,
      title: "Pending Orders",
      value: pendingOrder,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      id: 3,
      title: "Completed Orders",
      value: CompleteOrder,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      id: 4,
      title: "Total Revenue",
      value: totalRevenue,
      icon: Wallet,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: 5,
      title: "Top Rating",
      value: TopRating,
      icon: Star,
      color: "bg-orange-100 text-orange-600",
    },
    {
      id: 6,
      title: "Monthly Growth",
      value: "+12%",
      icon: TrendingUp,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  const recentOrders = [
    {
      id: "#1023",
      product: "Denim Jacket",
      buyer: "Ali Khan",
      status: "Delivered",
      amount: "Rs. 3,200",
      date: "Oct 28, 2025",
    },
    {
      id: "#1022",
      product: "Graphic Tee",
      buyer: "Sara Ahmed",
      status: "Processing",
      amount: "Rs. 1,800",
      date: "Oct 27, 2025",
    },
    {
      id: "#1021",
      product: "Hoodie",
      buyer: "Zain Malik",
      status: "Pending",
      amount: "Rs. 2,500",
      date: "Oct 25, 2025",
    },
  ];

  const getData = async () => {
    const token = localStorage.getItem("token");
    const response = await GetStoreOnBoard(String(token), storeID);
    if (response.status === 200) {
      const data = response.data as ResponseData;
      setTotalProduct(data.queryTotalProducts ?? 0);
      setPendingOrder(data.queryPendingOrders ?? 0);
      setCompleteOrder(data.queryCompletedOrders ?? 0);
      setTopRating(data.queryTopRating ?? 0);
      setTotalRevenue(data.queryTotalRevenue ?? 0);
      console.log(response.data);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Seller Dashboard Overview
      </h1>

      {/* === STAT CARDS GRID === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
      {/* <div className="mt-10 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Orders Received
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-t border-gray-100 text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Buyer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-medium text-gray-700">
                    {order.id}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{order.product}</td>
                  <td className="py-3 px-4 text-gray-600">{order.buyer}</td>
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
      </div> */}
    </div>
  );
}
