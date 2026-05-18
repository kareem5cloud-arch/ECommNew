"use client";
import AddZone from "@/api/lib/Shippment/Zone/AddZone";
import GetRegion from "@/api/lib/Shippment/Region/GetRegion";

import Spinner from "@/component/spinner/page";
import { ChevronLeft, ChevronRight, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import ModifyZone from "@/api/lib/Shippment/Zone/ModifyZone";
import GetZone from "@/api/lib/Shippment/Zone/GetZone";
import DeleteZone from "@/api/lib/Shippment/Zone/DeleteZone";

interface response {
  message: string;
  citylist: citylist[];
}
interface citylist {
  cityID: string;
  cityName: string;
}

export default function CityManagement() {
  const router = useRouter();
  const [showList, setShowList] = useState(true);
  const [loading, setLoading] = useState(true);
  const [Update, setUpdate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isTrue, setIsTrue] = useState(false);
  const [responseBack, setResponseBack] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const [ZoneName, setZoneName] = useState("");
  const [ID, setID] = useState("");
  const [zonelist, setZoneList] = useState<citylist[]>([]);

  const addZone = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("token");
      const formData = {
        zoneName: ZoneName,
      };
      const response = await AddZone(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        getZone();
        setID("");
        setZoneName("");
        setIsTrue(true);
        setResponseBack(response.data.message);
      } else if (response.status === 400) {
        setIsTrue(true);
        setResponseBack("PLease Fill in Required Fields");
      } else {
        setIsTrue(true);
        setResponseBack("Something Went Wrong. Please try again later.");
      }
    } catch (error) {
      setisLoading(true);
    } finally {
      setisLoading(false);
    }
  };
  const modifyZone = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("token");
      const formData = {
        zoneID: ID,
        zoneName: ZoneName,
      };
      const response = await ModifyZone(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        getZone();
        setShowList(true);
        setID("");
        setZoneName("");
        setUpdate(false);
        setShowList(true);
        setIsTrue(true);
        setResponseBack(response.data[0].message);
      } else if (response.status === 400) {
        setIsTrue(true);
        setResponseBack("Please fill in all Fields.");
      } else {
        setUpdate(true);
        setShowList(false);
        setIsTrue(true);
        setResponseBack("Something Went Wrong. Please Try Again Later");
      }
    } catch (error) {
      setisLoading(true);
    } finally {
      setisLoading(false);
    }
  };

  const fetchData = (ID: string) => {
    setUpdate(true);
    setShowList(false);
    const data = zonelist.find((item) => item.cityID === ID);
    if (data) {
      setID(data.cityID);
      setZoneName(data.cityName);
    }
  };

  const deleteZone = async (ID: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = {
        zoneID: ID,
      };
      const response = await DeleteZone(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        setZoneList(zonelist.filter((item) => item.cityID !== ID));
        setID("");
        setUpdate(false);
        setShowList(true);
        setIsTrue(true);
        setResponseBack(response.data[0].message);
      } else {
        setUpdate(true);
        setShowList(false);
        setIsTrue(false);
        setResponseBack(response.data[0].message);
      }
    } catch (error) {
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };

  const getZone = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await GetZone(String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as response;
        setZoneList(data.citylist);
      } else {
        setZoneList([]);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getZone();
  }, []);

  useEffect(() => {
    if (!responseBack) return;

    const timer = setTimeout(() => {
      setIsTrue(false);
      setResponseBack("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [responseBack]);

  return (
    <div className="w-full relative">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">City Management</h1>
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
                  deleteZone(ID);
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

      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          {/* <h2 className="text-2xl font-semibold text-gray-800">
            Supplier Ledger
          </h2> */}
          <button
            onClick={() => {
              setShowList(!showList);
              setID("");
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {showList ? (
              <>
                <ChevronRight size={18} /> Add New
              </>
            ) : (
              <>
                <ChevronLeft size={18} /> Show List
              </>
            )}
          </button>
        </div>
        {showList ? (
          <>
            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : (
              <>
                {zonelist.length > 0 ? (
                  <>
                    {zonelist.map((item) => (
                      <div
                        className="p-4 border mt-2  border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition flex justify-between items-center"
                        key={item.cityID}
                      >
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {item.cityName}
                          </h3>
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => fetchData(item.cityID)}
                            className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
                            title="Edit"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setIsOpen(true);
                              setID(item.cityID);
                            }}
                            className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
                            title="Delete"
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="w-full bg-red-100 text-red-800 text-center px-4 py-3 mb-2 rounded">
                    No Record Found
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="space-y-5 mt-2">
            {/* === Column: Sub Category === */}

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                City Name <span className="text-red-500">*</span>
              </label>
              <input
                value={ZoneName}
                onChange={(e) => setZoneName(e.target.value)}
                type="text"
                name="Zone Name"
                placeholder="Enter Zone Name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none text-gray-900"
              />
            </div>

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

            {Update ? (
              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={modifyZone}
                  className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
                >
                  {isLoading ? "Updating...." : "Update"}
                </button>
              </div>
            ) : (
              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={addZone}
                  className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
                >
                  {isLoading ? "Saving...." : "Save"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
