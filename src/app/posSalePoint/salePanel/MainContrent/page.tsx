"use client";
import GetSellerOfflineOnBoard from "@/api/lib/PosIntegration/OnBoard/OnBoard";
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
  queryTotalCredit: number;
  queryCashRecieved: number;
  queryTotalExpense: number;
  queryTotalReturn: number;
  queryTotalSale: number;
  queryTotalProfit: number;
}

export default function SellerOfflineOverview() {
  const [TotalExpense, setTotalExpense] = useState(0);
  const [CashRecieved, setCashRecieved] = useState(0);
  const [CreditSale, setCreditSale] = useState(0);
  const [TotalReturn, setTotalReturn] = useState(0);
  const [TotalSale, setTotalSale] = useState(0);
  const [TotlaProfit, setTotlaProfit] = useState(0);

  const stats = [
    {
      id: 1,
      title: "Total Sale",
      value: `Rs. ${TotalSale.toLocaleString()}`,
      icon: Package,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 2,
      title: "Total Return",
      value: `Rs. ${TotalReturn.toLocaleString()}`,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      id: 3,
      title: "Total Expense",
      value: `Rs. ${TotalExpense.toLocaleString()}`,
      icon: Wallet,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: 4,
      title: "Credit Sale",
      value: `Rs. ${CreditSale.toLocaleString()}`,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      id: 5,
      title: "Cash Recieved",
      value: `Rs. ${CashRecieved.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-pink-100 text-pink-600",
    },
    {
      id: 6,
      title: "Total Profit",
      value: `Rs. ${TotlaProfit.toLocaleString()}`,
      icon: Star,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const getData = async () => {
    const token = localStorage.getItem("tokenPosSale");
    const response = await GetSellerOfflineOnBoard(String(token));
    if (response.status === 200) {
      const data = response.data as ResponseData;
      setCreditSale(data.queryTotalCredit ?? 0);
      setCashRecieved(data.queryCashRecieved ?? 0);
      setTotalExpense(data.queryTotalExpense ?? 0);
      setTotalSale(data.queryTotalSale ?? 0);
      setTotalReturn(data.queryTotalReturn ?? 0);
      setTotlaProfit(data.queryTotalProfit ?? 0);
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
    </div>
  );
}
