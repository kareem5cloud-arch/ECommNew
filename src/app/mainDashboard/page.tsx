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
  Bell,
  Loader2,
  ChevronLeft,
  Coins,
  Key,
  Truck,
  WholeWord,
  Building,
  Map,
  Ship,
  UserLock,
  ShoppingBagIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import SellerOverviewDashbaord from "./dashboard/page";
import { StoreApiResponse, storeInital } from "@/api/types/storeGet";
import GetInitalStore from "@/api/authentication/StoreGet";
import SellerPaymentInfo from "./payment/page";
import CheckAuth from "@/api/authentication/checkAuth";
// import Overview from "../overview/page";
// import AccountSettings from "../Codes/category/page";
// import SellerOrders from "../order/page";
// import SupplierForm from "../Codes/FurtherSubCat/page";
// import CustomerForm from "../Codes/customer/page";
// import PurchaseForm from "../purchase/page";
// import UnitForm from "../Codes/Unit/page";
// import FurtherSubCategory from "../Codes/FurtherSubCat/page";
// import CheckAuth from "@/api/authentication/checkAuth";
// import { useRouter } from "next/navigation";
// import ProfileManagement from "../profile/page";
import ProfileSetting from "./setting/page";
import HomePageSetting from "./StoreSetting/page";
import RegionManagement from "./Shippment/Region/page";
import ZoneManagement from "./Shippment/Zone2/page";
import CityManagement from "./Shippment/City/page";
import ShippingCityZoneManagemnet from "./Shippment/ShippingZone/page";
import RateManagement from "./Shippment/ShippingRate/page";
import CreateLogins from "./CreateLogin/page";
import { FaCashRegister, FaMoneyBill } from "react-icons/fa";
import TillManagement from "./TillRegister/page";
import Salesman from "./Salesman/page";

export default function CustomerPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [Till, setTill] = useState(false);

  const [storeShow, setStoreShow] = useState(false);
  const [addStoreForm, setaddStoreForm] = useState(false);

  const [storeList, setStoreList] = useState<storeInital[]>([]);

  const navItems = [
    // { id: "Code", label: "Code", icon: Plus },
    { id: "Shippment", label: "Shippment ", icon: Truck },
    { id: "Till", label: "Cash Register ", icon: FaCashRegister },
    { id: "Salesman", label: "Salesman", icon: User },
    { id: "CreateLogin", label: "Create Login", icon: UserLock },
    // { id: "StoreSetting", label: "Store Setting", icon: ShoppingBagIcon },
    { id: "payment", label: "Payment", icon: Coins },
    { id: "password", label: "Change Password", icon: Key },
  ];

  const verfiy = async () => {
    const token = localStorage.getItem("token");
    const response = await CheckAuth(token as string);
    if (response.status == 200 || response.status == 201) {
      console.log(response);
    }
    if (response.status == 400 || response.status == 401) {
      router.push("/sellerlogin");
    }
  };
  useEffect(() => {
    verfiy();
  }, []);
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-50 relative">
      {/* === Mobile Header === */}
      <div className="flex items-center justify-between lg:hidden bg-white border-b border-gray-200 p-4 shadow-sm">
        <h2
          onClick={() => window.location.reload()}
          className="text-lg font-semibold text-gray-900"
        >
          Seller Panel
        </h2>
        <button
          onClick={() => {
            setSidebarOpen(!sidebarOpen);
          }}
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
              {item.id === "Shippment" ? (
                <>
                  <button
                    onClick={() => {
                      setDropDown(!dropDown);
                      setTill(false);
                    }}
                    className={`flex justify-between items-center w-full gap-3 px-4 py-3 rounded-xl transition font-medium ${
                      activeTab === item.id
                        ? "bg-black text-white shadow"
                        : "text-gray-700 hover:bg-gray-200"
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
                  {dropDown && (
                    <div className="ml-6 mt-2 space-y-1">
                      {[
                        {
                          id: "region",
                          label: "Region",
                          icon: WholeWord,
                        },
                        {
                          id: "city",
                          label: "Zone",
                          icon: Building,
                        },
                        // {
                        //   id: "zone",
                        //   label: "Zone",
                        //   icon: Map,
                        // },
                        {
                          id: "shippingZone",
                          label: "Shipping Zone",
                          icon: Ship,
                        },
                        {
                          id: "shippingRate",
                          label: "Shipping Rate",
                          icon: Coins,
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
              ) : item.id === "Till" ? (
                <>
                  <button
                    onClick={() => {
                      setDropDown(false);
                      setTill(!Till);
                    }}
                    className={`flex justify-between items-center w-full gap-3 px-4 py-3 rounded-xl transition font-medium ${
                      activeTab === item.id
                        ? "bg-black text-white shadow"
                        : "text-gray-700 hover:bg-gray-200"
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
                  {Till && (
                    <div className="ml-6 mt-2 space-y-1">
                      {[
                        {
                          id: "TillCreate",
                          label: "Creats Tills",
                          icon: FaMoneyBill,
                        },
                      ].map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => {
                            setActiveTab(subItem.id);
                            setTill(false);
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
      {/* <div className="mb-4 p-2 bg-yellow-100 text-black font-bold">
  Active Tab: {activeTab}
</div> */}

      {/* === Main Content === */}
      <main className="w-full h-screen flex-1 p-6 sm:p-8 lg:ml-0 transition-all overflow-hidden overflow-y-auto">
        {activeTab === "dashboard" && <SellerOverviewDashbaord />}
        {activeTab === "payment" && <SellerPaymentInfo />}
        {/* {activeTab === "reviews" && <Review />}
        {activeTab === "orders" && <Order />} */}
        {activeTab === "password" && <ProfileSetting />}
        {activeTab === "StoreSetting" && <HomePageSetting />}
        {activeTab === "region" && <RegionManagement />}
        {activeTab === "city" && <ZoneManagement />}
        {activeTab === "zone" && <CityManagement />}
        {activeTab === "shippingZone" && <ShippingCityZoneManagemnet />}
        {activeTab === "shippingRate" && <RateManagement />}
        {activeTab === "CreateLogin" && <CreateLogins />}
        {activeTab === "TillCreate" && <TillManagement />}
        {activeTab === "Salesman" && <Salesman />}

        {/*{activeTab === "unit" && <UnitForm />}
        {activeTab === "orders" && <SellerOrders />}
        {activeTab === "supplier" && <SupplierForm />}
        {activeTab === "customer" && <CustomerForm />}
        {activeTab === "purchase" && <PurchaseForm />} */}
        {/* // {activeTab === "wishlist" && <Wishlist />}
        // {activeTab === "cart" && <Cart />} */}
      </main>
    </div>
  );
}
