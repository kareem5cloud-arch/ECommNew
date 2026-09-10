// app/admin/page.tsx (Dashboard)
"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Star,
  TrendingUp,
  Eye,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  PackageX,
  PackageSearch,
} from "lucide-react";
import CustoemrDashboardStatsApi from "@/app/api/Controller/Customer/Dashboard/Dashboard";

interface ResponseData {
  message: string;
  error: string;
  stats: {
    totalOrder: number;
    totalBag: number;
    rejectedBag: number;
    pendingOrder: number;
  };
  productList: productList[];
}
interface productList {
  bagNo: string;
  postingDate: string;
  productName: string;
  qty: number;
  status: string;
}

export default function AdminDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [TotalOrder, setTotalOrder] = useState("");
  const [TotalBag, setTotalBag] = useState("");
  const [RejetcedBag, setRejetcedBag] = useState("");
  const [PendingOrder, setPendingOrder] = useState("");
  const [productData, setProductData] = useState<productList[]>([]);

  const getStats = async () => {
    try {
      const token = localStorage.getItem("customerToken");
      const response = await CustoemrDashboardStatsApi(String(token));
      if (response.status === 200) {
        const data = response.data as ResponseData;
        setTotalOrder(String(data.stats.totalOrder));
        setTotalBag(String(data.stats.totalBag));
        setRejetcedBag(String(data.stats.rejectedBag));
        setPendingOrder(String(data.stats.pendingOrder));
        setProductData(data.productList);
      }
    } finally {
    }
  };
  useEffect(() => {
    getStats();
  }, []);
  const stats = [
    {
      title: "Total Order",
      value: TotalOrder,

      icon: ShoppingBag,
      color: "bg-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Rejected Bags",
      value: RejetcedBag,

      icon: PackageX,
      color: "bg-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Pending Bags",
      value: PendingOrder,

      icon: PackageSearch,
      color: "bg-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delieverd":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "approved":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Reclaimed":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "shipped":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header - Responsive */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold sm:text-3xl bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        {/*<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Last 30 days</span>
            <span className="sm:hidden">Filter</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Data</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>*/}
      </div>

      {/* Stats Grid - Responsive cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute right-0 top-0 h-20 w-20 sm:h-24 sm:w-24 translate-x-6 -translate-y-6 transform rounded-full bg-gradient-to-br from-gray-100 to-transparent opacity-50 dark:from-gray-700"></div>
            <div className="relative">
              <div
                className={`mb-3 sm:mb-4 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl ${stat.bgColor} transition-transform group-hover:scale-110`}
              >
                <stat.icon
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color.replace("bg-", "text-")}`}
                />
              </div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </h3>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-2">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section - Responsive grid */}
      {/* <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        
        <div className="lg:col-span-2 rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Overview
            </h3>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 self-end sm:self-auto">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="h-48 sm:h-56 md:h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
            <div className="text-center px-4">
              <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                Chart component would go here
              </p>
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1">
                Integrate your preferred charting library
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Top Products
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {[
              { name: "Premium Hoodie", sales: 234, revenue: "$4,680" },
              { name: "Classic T-Shirt", sales: 189, revenue: "$2,835" },
              { name: "Slim Jeans", sales: 145, revenue: "$3,625" },
              { name: "Leather Jacket", sales: 98, revenue: "$4,900" },
            ].map((product, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                    {product.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {product.sales} sales
                  </p>
                </div>
                <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white ml-2">
                  {product.revenue}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Recent Orders Table - Responsive with horizontal scroll on mobile */}
      <div className="rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Recent Orders
          </h3>
          {/* <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 self-start sm:self-auto">
            View all orders →
          </button> */}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {productData.map((order) => (
                <tr
                  key={order.bagNo}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {order.bagNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {order.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {order.qty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.postingDate).toDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
          {productData.map((order) => (
            <div
              key={order.bagNo}
              className="p-4 space-y-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {order.bagNo}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {order.productName}
                  </p>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {order.qty}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(order.postingDate).toDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination for mobile */}
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button className="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Previous
            </button>
            <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">5</span> of{" "}
                <span className="font-medium">25</span> results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0">
                  3
                </button>
                <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
