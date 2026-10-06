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
} from "lucide-react";
import OnlineSellerDashboardStatsApi from "@/app/api/Controller/OnlineManager/Dashbaord/OnlineSellerDashbaord";
import StoreSellerGetApi from "@/app/api/Controller/AdminController/Store/GetStoreSeller";
import {
  ResponseGetStore,
  storeList,
} from "@/app/api/Types/AdminSetting/Store/Store";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";

interface ResponseData {
  message: string;
  error: string;
  stats: {
    totalSale: number;
    totalExpense: number;
    totalOrder: number;
    rating: number;
  };
  orderList: orderList[];
  productList: productList[];
}
interface orderList {
  bagNo: string;
  email: string;
  postingDate: string;
  productName: string;
  qty: number;
  status: string;
}
interface productList {
  productName: string;
  qty: number;
  amount: number;
}
export default function OnlineDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [TotalSale, setTotalSale] = useState("");
  const [TotalBag, setTotalBag] = useState("");
  const [Rating, setRating] = useState("");
  const [StoreName, setStoreName] = useState("");
  const [StoreID, setStoreID] = useState("");
  const [TotalExpense, setTotalExpense] = useState("");
  const [DateFrom, setDateFrom] = useState("");
  const [DateTo, setDateTo] = useState("");
  const [productData, setProductData] = useState<productList[]>([]);
  const [orderList, setOrderList] = useState<orderList[]>([]);
  const [StoreList, setStoreList] = useState<storeList[]>([]);

  const getStats = async () => {
    try {
      const token = localStorage.getItem("OnlineSellerToken");
      const response = await OnlineSellerDashboardStatsApi(
        StoreID,
        DateFrom,
        DateTo,
        String(token),
      );
      if (response.status === 200) {
        const data = response.data as ResponseData;
        setTotalSale(data.stats.totalSale.toLocaleString());
        setTotalBag(data.stats.totalOrder.toLocaleString());
        setRating(String(data.stats.rating));
        setTotalExpense(data.stats.totalExpense.toLocaleString());
        setProductData(data.productList);
        setOrderList(data.orderList);
      }
    } finally {
    }
  };

  const getStores = async () => {
    const token = localStorage.getItem("OnlineSellerToken");
    const response = await StoreSellerGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as ResponseGetStore;
      setStoreList(data.storeList);
    } else {
      setStoreList([]);
    }
  };
  useEffect(() => {
    if (StoreID && DateFrom && DateTo) {
      getStats();
    }
  }, [StoreID, DateFrom, DateTo]);
  useEffect(() => {
    getStores();
  }, []);
  const stats = [
    {
      title: "Total Sale",
      value: TotalSale,
      icon: DollarSign,
      color: "bg-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Total Order",
      value: TotalBag,
      icon: Users,
      color: "bg-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Total Expense",
      value: TotalExpense,
      icon: ShoppingBag,
      color: "bg-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Average Rating",
      value: Rating,
      icon: Star,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delieverd":
        return "bg-green-100 text-green-700 capitalize dark:bg-green-900/30 dark:text-green-400";
      case "approved":
        return "bg-blue-100 text-blue-700 capitalize dark:bg-blue-900/30 dark:text-blue-400";
      case "pending":
        return "bg-yellow-100 text-yellow-700 capitalize dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Reclaimed":
        return "bg-yellow-100 text-yellow-700 capitalize dark:bg-yellow-900/30 dark:text-yellow-400";
      case "shipped":
        return "bg-purple-100 text-purple-700 capitalize dark:bg-purple-900/30 dark:text-purple-400";
      case "rejected":
        return "bg-red-100 text-red-700 capitalize dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 capitalize dark:bg-gray-900/30 dark:text-gray-400";
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
        {/* <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
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
        </div> */}
      </div>
      <div className="w-full flex gap-2">
        <div className="w-full mt-1">
          <DropDownList
            label="Store"
            placeholder="Select Store"
            required={true}
            filedID={setStoreID}
            value={StoreName}
            onChange={setStoreName}
            options={StoreList.map((item) => ({
              label: item.storeName,
              value: item.storeName,
              id: item.storeID,
            }))}
          />
        </div>
        <div className="w-full">
          <InputFieldGeneric
            label="Date From"
            type="date"
            required={true}
            placeholder="Enter Expense Date"
            SateChange={DateFrom}
            setSateChange={setDateFrom}
            disabled={false}
          />
        </div>
        <div className="w-full">
          <InputFieldGeneric
            label="Date To"
            type="date"
            required={true}
            placeholder="Enter Expense Date"
            SateChange={DateTo}
            setSateChange={setDateTo}
            disabled={false}
          />
        </div>
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
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
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

        {/* Top Products */}
        <div className="rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Top Products
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {productData.map((product, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                    {product.productName}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {product.qty} sales
                  </p>
                </div>
                <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white ml-2">
                  {product.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table - Responsive with horizontal scroll on mobile */}
      <div className="rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Recent Orders
          </h3>
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
                  Email
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
              {orderList.map((order) => (
                <tr
                  key={order.bagNo}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {order.bagNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {order.email}
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
          {orderList.map((order) => (
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
                    {order.email}
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
      </div>
    </div>
  );
}
