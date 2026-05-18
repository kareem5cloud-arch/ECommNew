"use client";
import GetCountry from "@/api/lib/country/countryList/countryListGet";
import AddCity from "@/api/lib/Shippment/City/CityAdd";
import DeleteCity from "@/api/lib/Shippment/City/CityDelete";
import GetCity from "@/api/lib/Shippment/City/CityGet";
import ModifyCity from "@/api/lib/Shippment/City/CityModified";
import AddRegion from "@/api/lib/Shippment/Region/AddRegion";
import DeleteRegion from "@/api/lib/Shippment/Region/DeleteRegion";
import GetRegion from "@/api/lib/Shippment/Region/GetRegion";
import ModifyRegion from "@/api/lib/Shippment/Region/ModifyRegion";
import AddShippingZone from "@/api/lib/Shippment/ShippingZone/AddShippingZone";
import DeleteShippingZoneCity from "@/api/lib/Shippment/ShippingZone/DeleteShippingZone";
import GetShippingZone from "@/api/lib/Shippment/ShippingZone/GetShippingZone";
import ModfiyShippingZone from "@/api/lib/Shippment/ShippingZone/ModifyShippingZone";
import GetZone from "@/api/lib/Shippment/Zone/GetZone";
import {
  Countryget,
  CountrygetApiResponse,
} from "@/api/types/country/countryget";
// import { citylist, responseCityList } from "@/api/types/Shippment/City/City";
import {
  regionlist,
  responseRegionList,
} from "@/api/types/Shippment/Region/Region";
import {
  responseShippingZone,
  ShippingZone,
} from "@/api/types/Shippment/ShippingZone/ShippingZone";
import Spinner from "@/component/spinner/page";
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

interface response {
  message: string;
  zonelist: zonelist[];
}
interface zonelist {
  countryID: string;
  countryName: string;
  regionID: string;
  regionName: string;
  zoneID: string;
  zoneName: string;
}
interface SelectedCity {
  cityID: string;
  cityName: string;
}

export default function ShippingCityZoneManagemnet() {
  const router = useRouter();
  const [showList, setShowList] = useState(true);
  const [loading, setLoading] = useState(true);
  const [Update, setUpdate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [Countries, setCountries] = useState<Countryget[]>([]);
  const [countryID, setCountryID] = useState("");
  const [RegionList, setRegionList] = useState<regionlist[]>([]);
  const [RegionID, setRegionID] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const [ZoneID, setZoneID] = useState("");

  const [zonelist, setZoneList] = useState<zonelist[]>([]);
  const [ShippingZone, setShippingZone] = useState<ShippingZone[]>([]);
  const [CityName, setCityName] = useState("");
  const [ID, setID] = useState("");
  const [isTrue, setIsTrue] = useState(false);
  const [responseBack, setResponseBack] = useState("");

  const addShippingZone = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("token");
      const formData = {
        zoneID: ZoneID,
        cityName: CityName,
      };
      const response = await AddShippingZone(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        getShippingZone(ZoneID);
        setCityName("");
        setIsTrue(true);
        setResponseBack(response.data.message);
      } else if (response.status === 400) {
        setIsTrue(true);
        setResponseBack("Please Fill in Required Fields");
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

  // const ModifyShippingZone = async () => {
  //   try {
  //     setisLoading(true);
  //     const token = localStorage.getItem("token");
  //     const formData = {
  //       zoneID: ZoneID,
  //       cityID: CityID,
  //     };
  //     const response = await ModfiyShippingZone(formData, String(token));
  //     if (response.status === 200 || response.status === 201) {
  //       getShippingZone(ZoneID);
  //       setUpdate(false);
  //       setShowList(true);
  //       setIsTrue(true);
  //       setResponseBack(response.data[0].message);
  //     } else if (response.status === 400) {
  //       setIsTrue(true);
  //       setResponseBack("Please Fill in Required Fileds");
  //     } else {
  //       setUpdate(true);
  //       setShowList(false);
  //       setIsTrue(true);
  //       setResponseBack("Something Went Wrong. Please Try Again Later");
  //     }
  //   } catch (error) {
  //     setisLoading(true);
  //   } finally {
  //     setisLoading(false);
  //   }
  // };

  const getShippingZone = async (ID: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await GetShippingZone(ID, String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as responseShippingZone;
        setShippingZone(data.zonelist);
      } else {
        setShippingZone([]);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const deleteShippingZone = async (ID: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = {
        cityID: ID,
      };
      const response = await DeleteShippingZoneCity(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        setShippingZone(ShippingZone.filter((item) => item.cityID !== ID));
        setID("");
        setIsTrue(true);
        setResponseBack(response.data[0].message);
      } else {
        setIsTrue(false);
        setResponseBack(response.data[0].message);
      }
    } catch (error) {
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCountry();
  }, []);

  const getRegion = async (ID: string) => {
    const token = localStorage.getItem("token");
    const response = await GetRegion(ID, String(token));
    if (response.status === 200 || response.status === 201) {
      const data = response.data as responseRegionList;
      setRegionList(data.regionlist);
      setRegionID(data.regionlist[0].regionID);
      getZone(data.regionlist[0].regionID);
    } else {
      setRegionList([]);
    }
  };
  const getZone = async (ID: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await GetCity(ID, String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as response;
        setZoneList(data.zonelist);
        setZoneID(data.zonelist[0].zoneID);
      } else {
        setZoneList([]);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const getCountry = async () => {
    const token = localStorage.getItem("token");
    const response = await GetCountry(String(token));
    if (response.status === 201 || response.status === 200) {
      const data = response.data as CountrygetApiResponse;
      setCountries(data.countryList);
      setCountryID(data.countryList[0].countryID);
      getRegion(data.countryList[0].countryID);
    } else if (response.status === 401) return router.push("/sellerogin");
  };

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
                  deleteShippingZone(ID);
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
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Country
              </label>

              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <select
                  value={countryID}
                  name="CategoryMain"
                  className="w-full bg-transparent outline-none text-gray-900 p-1"
                  onChange={(e) => {
                    setCountryID(e.target.value);
                    getRegion(e.target.value);
                  }}
                >
                  {Countries.map((cat) => (
                    <option key={cat.countryID} value={cat.countryID}>
                      {cat.countryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Region
              </label>

              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <select
                  value={RegionID}
                  name="CategoryMain"
                  className="w-full bg-transparent outline-none text-gray-900 p-1"
                  onChange={(e) => {
                    setRegionID(e.target.value);
                    getZone(e.target.value);
                  }}
                >
                  {RegionList.length > 0 ? (
                    <>
                      {RegionList.map((cat) => (
                        <option key={cat.regionID} value={cat.regionID}>
                          {cat.regionName}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option>No Record Found</option>
                  )}
                </select>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Zone
              </label>

              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <select
                  value={ZoneID}
                  name="CategoryMain"
                  className="w-full bg-transparent outline-none text-gray-900 p-1"
                  onChange={(e) => {
                    setZoneID(e.target.value);
                    getShippingZone(e.target.value);
                  }}
                >
                  {zonelist.map((cat) => (
                    <option key={cat.zoneID} value={cat.zoneID}>
                      {cat.zoneName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : (
              <>
                {ShippingZone.length > 0 ? (
                  <>
                    {ShippingZone.map((item) => (
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
                          {/* <button
                            // onClick={() => fetchData(item.cityZoneID)}
                            className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
                            title="Edit"
                          >
                            <Pencil className="w-5 h-5" />
                          </button> */}
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
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Country
              </label>

              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <select
                  value={countryID}
                  name="CategoryMain"
                  className="w-full bg-transparent outline-none text-gray-900 p-1"
                  onChange={(e) => {
                    setCountryID(e.target.value);
                    getRegion(e.target.value);
                  }}
                >
                  {Countries.map((cat) => (
                    <option key={cat.countryID} value={cat.countryID}>
                      {cat.countryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Region
              </label>

              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <select
                  value={RegionID}
                  name="CategoryMain"
                  className="w-full bg-transparent outline-none text-gray-900 p-1"
                  onChange={(e) => {
                    setRegionID(e.target.value);
                    getZone(e.target.value);
                  }}
                >
                  {RegionList.length > 0 ? (
                    <>
                      {RegionList.map((cat) => (
                        <option key={cat.regionID} value={cat.regionID}>
                          {cat.regionName}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option>No Record Found</option>
                  )}
                </select>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Zone
              </label>
              <div className="flex gap-2">
                <div className="w-full flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                  <select
                    value={ZoneID}
                    name="CategoryMain"
                    className="w-full bg-transparent outline-none text-gray-900 p-1"
                    onChange={(e) => {
                      setZoneID(e.target.value);
                    }}
                  >
                    {zonelist.length > 0 ? (
                      <>
                        {zonelist.map((cat) => (
                          <option key={cat.zoneID} value={cat.zoneID}>
                            {cat.zoneName}
                          </option>
                        ))}
                      </>
                    ) : (
                      <option>No Record Found</option>
                    )}
                  </select>
                </div>
                <div></div>
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                City Name
              </label>

              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <input
                  value={CityName}
                  type="text"
                  placeholder="Enter City Name"
                  className="w-full bg-transparent outline-none text-gray-900 p-1"
                  onChange={(e) => {
                    setCityName(e.target.value);
                  }}
                />
              </div>
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
                  // onClick={ModifyShippingZone}
                  className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
                >
                  {isLoading ? "Updating...." : "Update"}
                </button>
              </div>
            ) : (
              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={addShippingZone}
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
