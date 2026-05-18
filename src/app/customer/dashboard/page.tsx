"use client";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Star,
  ShoppingBag,
  UserCog,
  LogOut,
  Menu,
  X,
  Heart,
  ShoppingCart,
} from "lucide-react";
import Overview from "../overview/page";
import Review from "../review/page";
import Order from "../order/page";
import Setting from "../setting/page";
import Wishlist from "../wishlist/page";
import Cart from "../cart/page";
import CheckAuth from "@/api/authentication/checkAuth";
import { useRouter } from "next/navigation";
import { CustomerDetailResponse } from "@/api/types/HomePage/CustomerData/Customerdata";
import GetCustomerLoginData from "@/api/lib/HomePage/CustomerData/CustomerGet";
import CustoemrStats from "@/api/lib/CustomerAuthentication/CustomerStats.ts/CustomerStats";

export default function CustomerPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [response, setResponse] = useState("");
  const [UserName, setUserName] = useState("");

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "reviews", label: "My Reviews", icon: Star },
    { id: "orders", label: "My Orders", icon: ShoppingBag },
    { id: "wishlist", label: "My WishList", icon: Heart },
    { id: "cart", label: "My Cart", icon: ShoppingCart },
    { id: "settings", label: "Account Settings", icon: UserCog },
  ];

  const checkAuth = async () => {
    const token = localStorage.getItem("token1");
    const response = await CheckAuth(token as string);
    console.log("Response from CheckAuth API:", response);
    if (response?.status === 200 || response?.status === 201) {
      const data = response.data as any;
      getCustomer();
      if (data.loggedBy !== "Customer") {
        router.push("/");
      }
    } else {
      return;
    }
  };

  const getCustomer = async () => {
    const token = localStorage.getItem("token1");
    const response = await GetCustomerLoginData(String(token), {});
    if (response.status === 200 || response.status == 201) {
      const data = response.data as CustomerDetailResponse;
      console.log(data);
      setResponse(data.customerData[0].verificationStatus);
      setUserName(data.customerData[0].customerName);
    } else {
      console.log();
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-50 relative">
      {/* === Mobile Header === */}
      <div className="flex items-center justify-between lg:hidden bg-white border-b border-gray-200 p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Customer Panel</h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-800 p-2 rounded-md hover:bg-gray-100"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* === Sidebar === */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full lg:h-auto z-40 bg-white border-r border-gray-200 shadow-md lg:shadow-none p-6 w-64 transform transition-transform duration-300
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900 hidden lg:block">
            Customer Panel
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`flex items-center w-full gap-3 px-4 py-3 rounded-xl transition font-medium ${
                activeTab === item.id
                  ? "bg-black text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex flex-col justify-between">
          <div className="border-t border-gray-200 mt-10 pt-6">
            <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium transition">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
          <div className="mt-5 flex gap-2 items-center">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {UserName?.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold">{UserName}</span>
              <div>
                <span
                  className={`px-2 py-1 rounded-md text-sm ${
                    response === "Verified"
                      ? "bg-green-300 text-green-700"
                      : "bg-red-300 text-red-700"
                  }`}
                >
                  {response}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* === Overlay for Mobile === */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* === Main Content === */}
      <main className="w-full h-screen flex-1 p-6 sm:p-8 lg:ml-0 transition-all overflow-hidden overflow-y-auto">
        {activeTab === "dashboard" && <Overview />}
        {activeTab === "reviews" && <Review />}
        {activeTab === "orders" && <Order />}
        {activeTab === "settings" && <Setting />}
        {activeTab === "wishlist" && <Wishlist />}
        {activeTab === "cart" && <Cart />}
      </main>
    </div>
  );
}
