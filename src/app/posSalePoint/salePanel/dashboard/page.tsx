"use client";
import { useEffect, useState } from "react";
import {
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Plus,
  ShoppingBag,
  ShoppingCart,
  User,
  Briefcase,
  BookOpen,
  FileText,
  ScanEyeIcon,
  Coins,
  Notebook,
  Store,
} from "lucide-react";

import CustomerForm from "../codes/customer/page";

import SaleReturnModule from "../saleReturn/page";

import CustomerledgerForm from "../ledger/customerledger/page";
import ExpenseForm from "../GeneralExpense/page";
import CheckAuth from "@/api/authentication/checkAuth";
import { useRouter } from "next/navigation";
import LogoutApi from "@/api/authentication/logout";
import CustoemrReport from "../Reports/InventoryReports/page";
import SellerOfflineOverview from "../MainContrent/page";
import { BiTransfer } from "react-icons/bi";
import ItemTransferForm from "../ItemTransfer/page";
import SaleForm from "../sale/page";

export default function CustomerPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [ledgerDrop, setLedgerDrop] = useState(false);
  const [ReportDrop, setReportDrop] = useState(false);

  const navItems = [
    { id: "Code", label: "Code", icon: Plus },
    { id: "Ledger", label: "Ledger", icon: BookOpen },
    { id: "Reports", label: "Reports", icon: Notebook },
    //{ id: "ItemTransfer", label: "Item Transfer", icon: BiTransfer },
    { id: "expense", label: "Expense", icon: Coins },
    { id: "sale", label: "Sale", icon: ShoppingCart },
    { id: "saleReturn", label: "Sale Return", icon: ShoppingBag },
  ];

  const verfiy = async () => {
    const token = localStorage.getItem("tokenPosSale");
    if (!token) {
      router.push("/posSalePoint/login");
    }
    const response = await CheckAuth(token as string);
    if (response.status == 200 || response.status == 201) {
      console.log(response);
    } else {
      router.push("/posSalePoint/login/");
    }
  };

  const Logout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/posSalePoint/login");
    }

    const response = await LogoutApi(token as string);
    if (response.status == 200 || response.status == 201) {
      console.log(response);
      router.push("/posSalePoint/login");
    }
    if (response.status == 400 || response.status == 401) {
    } else {
      router.push("/posSalePoint/login/");
    }
  };

  useEffect(() => {
    verfiy();
  }, []);
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-50 relative">
      {/* === Mobile Header === */}
      <div className="flex items-center justify-between lg:hidden bg-white border-b border-gray-200 p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Seller Panel</h2>
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
            onClick={() => setActiveTab("overview")}
            className="text-xl font-bold text-gray-900 hidden lg:block cursor-pointer"
          >
            Sale Panel
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
            <div key={item.id}>
              {/* === Code Dropdown === */}
              {item.id === "Code" ? (
                <>
                  <button
                    onClick={() => {
                      setDropDown(!dropDown);
                      setLedgerDrop(false);
                      setReportDrop(false);
                    }}
                    className={`flex items-center w-full justify-between px-4 py-3 rounded-xl transition font-medium text-gray-700 hover:bg-gray-100 ${
                      dropDown
                        ? "bg-gray-100  shadow"
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

                  {dropDown && (
                    <div className="ml-6 mt-2 space-y-1">
                      {[{ id: "customer", label: "Customer", icon: User }].map(
                        (subItem) => (
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
                        ),
                      )}
                    </div>
                  )}
                </>
              ) : item.id === "Ledger" ? (
                <>
                  {/* === Ledger Dropdown === */}
                  <button
                    onClick={() => {
                      setLedgerDrop(!ledgerDrop);
                      setDropDown(false);
                      setReportDrop(false);
                    }}
                    className={`flex items-center w-full justify-between px-4 py-3 rounded-xl transition font-medium ${
                      ledgerDrop
                        ? "bg-gray-100  shadow"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {ledgerDrop ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>

                  {ledgerDrop && (
                    <div className="ml-6 mt-2 space-y-1">
                      {[
                        // {
                        //   id: "supplierLedger",
                        //   label: "Supplier Ledger",
                        //   icon: FileText,
                        // },
                        {
                          id: "customerLedger",
                          label: "Customer Ledger",
                          icon: FileText,
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
              ) : item.id === "Reports" ? (
                <>
                  <button
                    onClick={() => {
                      setReportDrop(!ReportDrop);
                      setDropDown(false);
                      setLedgerDrop(false);
                    }}
                    className={`flex items-center w-full justify-between px-4 py-3 rounded-xl transition font-medium ${
                      ReportDrop
                        ? "bg-gray-100  shadow"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {ReportDrop ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>

                  {ReportDrop && (
                    <div className="ml-6 mt-2 space-y-1">
                      {[
                        {
                          id: "custoemrReport",
                          label: "Customer Report",
                          icon: Store,
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
                // === Regular Buttons ===
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
          <button
            onClick={Logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium transition"
          >
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
        {activeTab === "overview" && <SellerOfflineOverview />}
        {activeTab === "customer" && <CustomerForm />}
        {activeTab === "ItemTransfer" && <ItemTransferForm />}
        {activeTab === "expense" && <ExpenseForm />}
        {activeTab === "sale" && <SaleForm />}
        {activeTab === "custoemrReport" && <CustoemrReport />}
        {activeTab === "saleReturn" && <SaleReturnModule />}
        {activeTab === "customerLedger" && <CustomerledgerForm />}
      </main>
    </div>
  );
}
