// InternationalShippingTable.tsx
"use client";
import { useState } from "react";
import { Globe } from "lucide-react";
import ActionButton from "@/app/ui/ActionButton/ActionButton";

interface InternationalShippingRate {
  id: number;
  fromCountry: string;
  toCountry: string;
  deliveryStandard: string;
  lessThan1kg: number;
  oneTo5kg: number;
  fiveTo10kg: number;
  greaterThan10kg: number;
}

export default function InternationalShippingTable() {
  const [rates, setRates] = useState<InternationalShippingRate[]>([
    {
      id: 1,
      fromCountry: "United States",
      toCountry: "Canada",
      deliveryStandard: "Standard",
      lessThan1kg: 15.99,
      oneTo5kg: 28.99,
      fiveTo10kg: 42.99,
      greaterThan10kg: 65.99,
    },
    {
      id: 2,
      fromCountry: "United States",
      toCountry: "United Kingdom",
      deliveryStandard: "Express",
      lessThan1kg: 25.99,
      oneTo5kg: 45.99,
      fiveTo10kg: 68.99,
      greaterThan10kg: 95.99,
    },
    {
      id: 3,
      fromCountry: "Germany",
      toCountry: "France",
      deliveryStandard: "Standard",
      lessThan1kg: 12.99,
      oneTo5kg: 22.99,
      fiveTo10kg: 35.99,
      greaterThan10kg: 55.99,
    },
    {
      id: 4,
      fromCountry: "China",
      toCountry: "United States",
      deliveryStandard: "Economy",
      lessThan1kg: 18.99,
      oneTo5kg: 32.99,
      fiveTo10kg: 48.99,
      greaterThan10kg: 75.99,
    },
  ]);

  const updateRate = (
    id: number,
    field: keyof InternationalShippingRate,
    value: string | number,
  ) => {
    setRates(
      rates.map((rate) =>
        rate.id === id ? { ...rate, [field]: value } : rate,
      ),
    );
  };

  const handleSave = () => {
    console.log("Saved international rates:", rates);
    // Add your API call here
    alert("International shipping rates saved successfully!");
  };

  const weightColumns = [
    { key: "lessThan1kg", label: "< 1 kg", range: "0 - 1 kg" },
    { key: "oneTo5kg", label: "1 - 5 kg", range: "1 kg - 5 kg" },
    { key: "fiveTo10kg", label: "5 - 10 kg", range: "5 kg - 10 kg" },
    { key: "greaterThan10kg", label: "> 10 kg", range: "10+ kg" },
  ];

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      "United States": "🇺🇸",
      Canada: "🇨🇦",
      "United Kingdom": "🇬🇧",
      Germany: "🇩🇪",
      France: "🇫🇷",
      China: "🇨🇳",
      Japan: "🇯🇵",
      India: "🇮🇳",
      Brazil: "🇧🇷",
      Australia: "🇦🇺",
    };
    return flags[country] || "🌍";
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                From Country
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                To Country
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                Delivery Standard
              </th>
              {weightColumns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300"
                >
                  {col.label}
                  <div className="text-[10px] font-normal text-gray-400">
                    {col.range}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {rates.map((rate) => (
              <tr
                key={rate.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {getCountryFlag(rate.fromCountry)}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {rate.fromCountry}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {getCountryFlag(rate.toCountry)}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {rate.toCountry}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      rate.deliveryStandard === "Express"
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        : rate.deliveryStandard === "Priority"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          : rate.deliveryStandard === "Economy"
                            ? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    }`}
                  >
                    {rate.deliveryStandard}
                  </span>
                </td>
                {weightColumns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-center">
                    <input
                      type="number"
                      step="0.01"
                      value={rate[col.key as keyof InternationalShippingRate]}
                      onChange={(e) =>
                        updateRate(
                          rate.id,
                          col.key as keyof InternationalShippingRate,
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="w-24 px-2 py-1 text-center rounded border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                        focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-3 text-right text-sm text-gray-500">
        🌍 Click on any price field to edit international shipping rates
      </div>
      <div className="flex justify-end mx-3 my-2">
        <ActionButton
          text="Save Changes"
          update={false}
          loading={false}
          loadingtext="Saving Changes..."
          onClick={handleSave}
          disabled={false}
        />
      </div>
    </div>
  );
}
