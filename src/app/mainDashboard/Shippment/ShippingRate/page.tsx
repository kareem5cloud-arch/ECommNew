"use client";
import GetCountry from "@/api/lib/country/countryList/countryListGet";
import AddRegion from "@/api/lib/Shippment/Region/AddRegion";
import DeleteRegion from "@/api/lib/Shippment/Region/DeleteRegion";
import GetRegion from "@/api/lib/Shippment/Region/GetRegion";
import ModifyRegion from "@/api/lib/Shippment/Region/ModifyRegion";
import AddShippingZoneRate from "@/api/lib/Shippment/ShippmentRate/AddShippment";
import GetCombination from "@/api/lib/Shippment/ShippmentRate/GetCombination";
type EditableField = "lessThen1KG" | "lessThen5KG" | "greaterThen10KG";

import {
  Countryget,
  CountrygetApiResponse,
} from "@/api/types/country/countryget";
import {
  responseShippingRate,
  ShippingRate,
} from "@/api/types/Shippment/Rates/rates";
import {
  regionlist,
  responseRegionList,
} from "@/api/types/Shippment/Region/Region";
import Spinner from "@/component/spinner/page";
import { ChevronLeft, ChevronRight, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export default function RateManagement() {
  const router = useRouter();
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [Update, setUpdate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [CombinationList, setCombinationList] = useState<ShippingRate[]>([]);

  const [ID, setID] = useState("");
  const [isTrue, setIsTrue] = useState(false);
  const [responseBack, setResponseBack] = useState("");

  const getCombination = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await GetCombination(String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as responseShippingRate;
        console.log(data.loopList);
        setCombinationList(data.loopList);
      }
    } catch {
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("token");
      const formData = {
        shippingDetail: CombinationList.map((item) => ({
          lessThen1KG: item.lessThen1KG,
          lessThen5KG: item.lessThen5KG,
          greaterThen10KG: item.greaterThen10KG,
          StoreZoneID: item.storeZoneID,
          DestinationZoneID: item.destinationZoneID,
        })),
      };
      const response = await AddShippingZoneRate(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        setIsTrue(true);
        setResponseBack(response.data.message);
      } else if (response.status === 200) {
        setIsTrue(true);
        setResponseBack("PLease Fill in Required Fields");
      } else {
        setIsTrue(true);
        setResponseBack("Something Went Wrong. Please try again later.");
      }
    } catch {
      setisLoading(true);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    getCombination();
  }, []);

  useEffect(() => {
    if (!responseBack) return;

    const timer = setTimeout(() => {
      setIsTrue(false);
      setResponseBack("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [responseBack]);

  const handleChange = (index: number, field: EditableField, value: string) => {
    setCombinationList((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value === "" ? "" : Number(value),
      };

      return updated;
    });
  };

  return (
    <div className="w-full relative">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Shipping Rate Management
      </h1>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center">
            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-800">
              Delete Confirmation
            </h2>
            <p className="text-gray-500 mt-2">
              Are you sure you want to delete this record? <br />
              This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  //   deleteRegion(ID);
                  setIsOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-md">
        {showList ? (
          <></>
        ) : (
          <div className="space-y-5 mt-2">
            {loading ? (
              <>
                <Spinner />
              </>
            ) : (
              <>
                <div className="w-full overflow-x-auto">
                  <table className="min-w-[900px] w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-100">
                      <tr className="text-left text-sm font-semibold text-gray-700">
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Location 1</th>
                        <th className="px-4 py-3">Location 2</th>
                        <th className="px-4 py-3">
                          Rate{" "}
                          <span className="text-sm text-gray-400 font-bold">
                            {"<" + 1}
                          </span>
                        </th>
                        <th className="px-4 py-3">
                          Rate{" "}
                          <span className="text-sm text-gray-400 font-bold">
                            {"<" + 5}
                          </span>
                        </th>
                        <th className="px-4 py-3">
                          Rate{" "}
                          <span className="text-sm text-gray-400 font-bold">
                            {">" + 10}
                          </span>
                        </th>
                      </tr>
                    </thead>

                    <tbody className="text-sm">
                      {CombinationList.map((item, index) => (
                        <tr
                          key={index + 1}
                          className="border-t hover:bg-gray-50 transition"
                        >
                          <td className="px-4 py-3">{index + 1}</td>

                          <td className="px-4 py-3 font-medium">
                            {item.storeZoneName}
                          </td>

                          <td className="px-4 py-3 font-medium">
                            {item.destinationZoneName}
                          </td>

                          <td className="px-4 py-3">
                            <input
                              value={item.lessThen1KG ?? 0}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "lessThen1KG",
                                  e.target.value
                                )
                              }
                              type="number"
                              placeholder="Min"
                              className="w-24 rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>

                          <td className="px-4 py-3">
                            <input
                              value={item.lessThen5KG ?? 0}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "lessThen5KG",
                                  e.target.value
                                )
                              }
                              type="number"
                              placeholder="Max"
                              className="w-24 rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>

                          <td className="px-4 py-3">
                            <input
                              value={item.greaterThen10KG ?? 0}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "greaterThen10KG",
                                  e.target.value
                                )
                              }
                              type="number"
                              placeholder="Rate"
                              className="w-28 rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>

                          {/* <td className="px-4 py-3 text-center">
                            <button className="rounded-md bg-green-600 px-3 py-1.5 text-white text-xs hover:bg-green-700">
                              Save
                            </button>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {isTrue && (
              <>
                {responseBack && (
                  <div
                    className={`w-full text-center px-4 py-3 mb-2 rounded ${
                      responseBack === "Record Added successfully" ||
                      responseBack === "Login Successfully" ||
                      responseBack === "Request successful"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {responseBack}
                  </div>
                )}
              </>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="px-2  py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
            >
              {isLoading ? "Saving...." : "Save"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
