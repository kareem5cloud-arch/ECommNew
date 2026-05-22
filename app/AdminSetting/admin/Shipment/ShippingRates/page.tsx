"use client";
import { List, Plane, Plus } from "lucide-react";
import { useState } from "react";
import ShippingRateTable from "./LocalShippingRates";
import InternationalShippingRateTable from "./InternationShippingRates";

export default function ShippingRate() {
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  return (
    <>
      <div>
        <div className="w-full bg-gray-100 dark:bg-gray-800/50 shadow-md flex justify-between p-2 rounded-xl">
          <button
            onClick={() => {
              setView("list");
              setUpdate(false);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-semibold transition-all duration-200
            ${
              view === "list"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <List size={18} />
            Local-Shipping
          </button>

          <button
            onClick={() => {
              setView("form");
              //setUpdate(false);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-semibold transition-all duration-200
            ${
              view === "form"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Plane size={18} />
            International-Shipping
          </button>
        </div>
        {view === "form" ? (
          <div>
            <div className="flex justify-between items-center mt-6 mb-6">
              <h1 className="text-2xl font-semibold text-neutral-900">
                International-Shipping Rates
              </h1>
            </div>
            <InternationalShippingRateTable />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mt-6 mb-6">
              <h1 className="text-2xl font-semibold text-neutral-900">
                Local-Shipping Rates
              </h1>
            </div>
            <ShippingRateTable />
          </div>
        )}
      </div>
    </>
  );
}
