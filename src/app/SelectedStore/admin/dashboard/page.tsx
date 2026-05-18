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
  Plus,
  ChevronRight,
  ChevronDown,
  User,
  Briefcase,
  ListCollapse,
  Weight,
  ListChecksIcon,
  Settings,
  NotepadText,
  Coins,
} from "lucide-react";
import Overview from "../overview/page";
import AccountSettings from "../Codes/category/page";
import SellerOrders from "../order/page";
import SupplierForm from "../Codes/supplier/page";
import CustomerForm from "../Codes/customer/page";
import PurchaseForm from "../purchase/page";
import UnitForm from "../Codes/Unit/page";
import FurtherSubCategory from "../Codes/FurtherSubCat/page";
import CheckAuth from "@/api/authentication/checkAuth";
import { useRouter } from "next/navigation";
import ProfileManagement from "../profile/page";
import { StoreApiResponse, storeInital } from "@/api/types/storeGet";
import GetInitalStore from "@/api/authentication/StoreGet";
import ProductControll from "../Codes/category/page";
import SupplierledgerForm from "../supplierledger/page";
export default function SellerDashboardPanel({ storeID }: { storeID: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [storeList, setStoreList] = useState<storeInital[]>([]);

  const navItems = [
    { id: "Code", label: "Code", icon: Plus },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "ledger", label: "Supplier Ledger", icon: NotepadText },
    // { id: "purchase", label: "Purchase Module", icon: Coins },
  ];
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    const response = await CheckAuth(token as string);
    console.log("Response from CheckAuth API:", response);
    if (response?.status === 200 || response?.status === 201) {
      console.log(response);
    }
    if (response?.status === 400 || response?.status === 401) {
      router.push("/sellerlogin");
    }
  };
  const storesget = async () => {
    const token = localStorage.getItem("token");
    const response = await GetInitalStore(String(token));
    if (response.status === 200 || response.status === 201) {
      const data = response.data as StoreApiResponse;
      const storeExists = data.storeList.some(
        (store) => store.storeID === storeID,
      );
      if (!storeExists) {
        router.push("/404");
        return;
      }
    }
  };
  useEffect(() => {
    storesget();
  }, []);
  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-50 relative">
      {/* === Mobile Header === */}
      <div className="flex items-center justify-between lg:hidden bg-white border-b border-gray-200 p-4 shadow-sm">
        <h2
          className="text-lg font-semibold text-gray-900"
          onClick={() => window.location.reload()}
        >
          Seller Panel
        </h2>
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
          <h2
            onClick={() => window.location.reload()}
            className="text-xl font-bold text-gray-900 hidden lg:block"
          >
            Seller Panel
          </h2>
          <button
            onClick={() => {
              setSidebarOpen(false);
            }}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <div key={item.id}>
              {item.id === "Code" ? (
                <>
                  {/* Main Button for Code */}
                  <button
                    onClick={() => setDropDown(!dropDown)}
                    className={`flex items-center w-full justify-between px-4 py-3 rounded-xl transition font-medium ${
                      activeTab === item.id
                        ? "bg-black text-white shadow"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {dropDown ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>

                  {/* Dropdown Submenu */}
                  {dropDown && (
                    <div className="ml-6 mt-2 space-y-1">
                      {[
                        {
                          id: "unit",
                          label: "Units",
                          icon: Weight,
                        },
                        {
                          id: "customer",
                          label: "Category",
                          icon: ListCollapse,
                        },
                        {
                          id: "SubCategory",
                          label: "Sub Category",
                          icon: ListChecksIcon,
                        },
                        {
                          id: "supplier",
                          label: "Supplier",
                          icon: User,
                        },
                        {
                          id: "setting",
                          label: "Product",
                          icon: ShoppingCart,
                        },
                      ].map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => {
                            setActiveTab(subItem.id);
                            setSidebarOpen(false);
                          }}
                          className={`flex items-center w-full gap-2 px-3 py-2 text-sm rounded-lg transition ${
                            activeTab === subItem.id
                              ? "bg-gray-900 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <subItem.icon className="w-4 h-4" />
                          <span>{subItem.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button
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
                  <span>{item.label}</span>
                </button>
              )}
            </div>
          ))}
        </nav>

        <div className="border-t border-gray-200 mt-10 pt-6">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium transition">
            <LogOut className="w-5 h-5" /> Logout
          </button>
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
        {activeTab === "dashboard" && <Overview storeID={storeID} />}
        {activeTab === "SubCategory" && (
          <FurtherSubCategory storeID={storeID} />
        )}
        {/* {activeTab === "reviews" && <Review />}
        {activeTab === "orders" && <Order />} */}
        {activeTab === "purchase" && <PurchaseForm storeID={storeID} />}
        {activeTab === "setting" && <ProductControll storeID={storeID} />}
        {activeTab === "unit" && <UnitForm storeID={storeID} />}
        {activeTab === "orders" && <SellerOrders storeID={storeID} />}
        {activeTab === "customer" && <CustomerForm storeID={storeID} />}
        {activeTab === "supplier" && <SupplierForm />}
        {activeTab === "ledger" && <SupplierledgerForm />}
        {/* // {activeTab === "wishlist" && <Wishlist />}
        // {activeTab === "cart" && <Cart />} */}
      </main>
    </div>
  );
}
