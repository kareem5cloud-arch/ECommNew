// components/AdminSidebar.tsx
"use client";

import { useState, useEffect } from "react";
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
  Home,
  BarChart3,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  FolderTree,
  Gift,
  Tag,
  Globe,
  Shield,
  Warehouse,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Start open on desktop
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    content: false,
    shipping: false,
    users: false,
    settings: false,
  });

  const navigation = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/AdminSetting/admin/Dashboard",
      type: "link",
    },
    {
      id: "storeSetting",
      label: "Store",
      icon: Warehouse,
      href: "/AdminSetting/admin/Store",
      type: "link",
    },
    {
      id: "shipping",
      label: "Shipping",
      icon: Truck,
      type: "dropdown",
      items: [
        {
          id: "Delivery",
          label: "Delivery Standard",
          icon: Truck,
          href: "/AdminSetting/admin/Shipment/DelievryStandard",
        },
        {
          id: "regions",
          label: "Regions",
          icon: Globe,
          href: "/AdminSetting/admin/Shipment/Region",
        },
        {
          id: "zones",
          label: "Zones",
          icon: Map,
          href: "/AdminSetting/admin/Shipment/Zone",
        },
        {
          id: "rates",
          label: "Shipping Rates",
          icon: Coins,
          href: "/AdminSetting/admin/Shipment/ShippingRates",
        },
      ],
    },
    {
      id: "logins",
      label: "Create Login",
      icon: Users,
      type: "dropdown",
      items: [
        {
          id: "OnlineSeller",
          label: "Online Seller",
          icon: UserLock,
          href: "/AdminSetting/admin/CreateLogin/OnlineSeller",
        },
        {
          id: "OfflineSeller",
          label: "Offline Seller",
          icon: UserLock,
          href: "/AdminSetting/admin/CreateLogin/OfflineSeller",
        },
      ],
    },
    // {
    //   id: "settings",
    //   label: "Settings",
    //   icon: Settings,
    //   type: "dropdown",
    //   items: [
    //     {
    //       id: "general",
    //       label: "General",
    //       icon: Settings,
    //       href: "/admin/settings/general",
    //     },
    //     {
    //       id: "store",
    //       label: "Store Settings",
    //       icon: ShoppingBagIcon,
    //       href: "/admin/settings/store",
    //     },
    //     {
    //       id: "payment",
    //       label: "Payment",
    //       icon: Coins,
    //       href: "/admin/settings/payment",
    //     },
    //   ],
    // },
  ];

  const toggleMenu = (menuId: string) => {
    setOpenMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  const isActive = (href: string) => {
    if (href === "/admin" && pathname === "/admin") return true;
    if (href !== "/admin" && pathname?.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile menu button - now outside sidebar */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-50 rounded-xl bg-white p-2 shadow-lg lg:hidden dark:bg-gray-800"
      >
        <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - No main wrapper, just the aside */}
      <aside
        className={`fixed left-0 top-0 z-40 h-full w-72 transform bg-white transition-transform duration-300 shadow-xl dark:bg-gray-800 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="flex h-20 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
              <span className="text-xl font-bold text-white">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                AdminKit
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Dashboard
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          {navigation.map((item) => (
            <div key={item.id} className="mb-2">
              {item.type === "link" ? (
                <Link
                  href={item.href!}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 group ${
                    isActive(item.href!)
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                  {isActive(item.href!) && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white"></div>
                  )}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 font-medium transition-all duration-200 group ${
                      openMenus[item.id]
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-700/50 dark:text-white"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                      <span>{item.label}</span>
                    </div>
                    {openMenus[item.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>

                  {openMenus[item.id] && (
                    <div className="ml-7 mt-2 space-y-1 border-l-2 border-gray-200 pl-4 dark:border-gray-700">
                      {item.items?.map((subItem) => (
                        <Link
                          key={subItem.id}
                          href={subItem.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 group ${
                            isActive(subItem.href)
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50"
                          }`}
                        >
                          <subItem.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                          <span>{subItem.label}</span>
                          {isActive(subItem.href) && (
                            <div className="ml-auto h-1 w-1 rounded-full bg-white"></div>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <button className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-gray-700 transition-all duration-200 hover:text-red-600 hover:bg-red-50 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400 group">
            <LogOut className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// Helper component for Image icon
function ImageIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="2.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  );
}
