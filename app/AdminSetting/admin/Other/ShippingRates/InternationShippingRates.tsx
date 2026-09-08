// InternationalShippingTable.tsx
"use client";
import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import InternationalShippingRateGetApi from "@/app/api/Controller/AdminController/Shipment/ShippingRate/InternationalShippingRate/GetInternationalShippingRate";
import {
  loopListInternation,
  responseGetShippingInternation,
} from "@/app/api/Types/Shipment/ShippingRate";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";

export default function InternationalShippingTable() {
  const [rates, setRates] = useState<loopListInternation[]>([]);
  const [isLoading, setisLoading] = useState(false);

  const updateRate = (
    id: string,
    field: keyof loopListInternation,
    value: string | number,
  ) => {
    setRates(
      rates.map((rate) =>
        rate.intlRateID === id ? { ...rate, [field]: value } : rate,
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

  const getInternatiopnShippingrate = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await InternationalShippingRateGetApi(String(token));
      if (response.status === 200) {
        const data = response.data as responseGetShippingInternation;
        setRates(data.loopList);
      }
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    getInternatiopnShippingrate();
  }, []);
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
          {isLoading ? (
            <>
              <Spinner />
            </>
          ) : (
            <>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {rates.map((rate) => (
                  <tr
                    key={rate.intlRateID}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {rate.countryFrom}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {rate.countryTo}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          rate.deliveryType === "Express"
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                            : rate.deliveryType === "Priority"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                              : rate.deliveryType === "Economy"
                                ? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        }`}
                      >
                        {rate.deliveryType}
                      </span>
                    </td>
                    {weightColumns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-center">
                        <input
                          type="number"
                          step="0.01"
                          value={rate[col.key as keyof loopListInternation]}
                          onChange={(e) =>
                            updateRate(
                              rate.intlRateID,
                              col.key as keyof loopListInternation,
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
            </>
          )}
        </table>
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
