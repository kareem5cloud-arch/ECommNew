"use client";
import GetInitalStore from "@/api/authentication/StoreGet";
import GetCountry from "@/api/lib/country/countryList/countryListGet";
import GetMainStoreOnBoard from "@/api/lib/MainDashbaord/MainOverview/MainOverview";
import GetCity from "@/api/lib/Shippment/City/CityGet";
import GetCitySeller from "@/api/lib/Shippment/City/CityGetSeller";
import GetRegion from "@/api/lib/Shippment/Region/GetRegion";
import StoreCreation from "@/api/lib/store/createStore/createStore";
import StoreDefaultSet from "@/api/lib/store/defaultStore/defaultStore";
import GetUserData from "@/api/lib/userData/userDataGet/dataGet";
import {
  Countryget,
  CountrygetApiResponse,
} from "@/api/types/country/countryget";
import {
  regionlist,
  responseRegionList,
} from "@/api/types/Shippment/Region/Region";
import { StoreApiResponse, storeInital } from "@/api/types/storeGet";
import { userDatagetApiResponse } from "@/api/types/userData/userDataType";
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
  ChevronLeft,
  X,
} from "lucide-react";
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
interface ResponseData {
  queryTotalProducts: number;
  queryPendingOrders: number;
  queryCompletedOrders: number;
  queryTotalRevenue: number;
  queryTopRating: number;
}
export default function SellerOverviewDashbaord() {
  const router = useRouter();
  const [storeShow, setStoreShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addStoreForm, setaddStoreForm] = useState(false);
  const [responseBack, setResponseBack] = useState(0);

  const [storeEmail, setStoreEmail] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [defaultStoreset, setDefaultStoreset] = useState(false);
  const [Countries, setCountries] = useState<Countryget[]>([]);
  const [countryID, setCountryID] = useState("");
  const [RegionList, setRegionList] = useState<regionlist[]>([]);
  const [RegionID, setRegionID] = useState("");
  const [totalProduct, setTotalProduct] = useState(0);
  const [pendingOrder, setPendingOrder] = useState(0);
  const [CompleteOrder, setCompleteOrder] = useState(0);
  const [TopRating, setTopRating] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [ZoneID, setZoneID] = useState("");

  const [zonelist, setZoneList] = useState<zonelist[]>([]);

  const [storeList, setStoreList] = useState<storeInital[]>([]);
  const stats = [
    {
      id: 1,
      title: "Total Products",
      value: totalProduct,
      icon: Package,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 2,
      title: "Pending Orders",
      value: pendingOrder,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      id: 3,
      title: "Completed Orders",
      value: CompleteOrder,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      id: 4,
      title: "Total Revenue",
      value: totalRevenue,
      icon: Wallet,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: 5,
      title: "Top Rating",
      value: TopRating,
      icon: Star,
      color: "bg-orange-100 text-orange-600",
    },
    {
      id: 6,
      title: "Monthly Growth",
      value: "+12%",
      icon: TrendingUp,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  const recentOrders = [
    {
      id: "#1023",
      product: "Denim Jacket",
      buyer: "Ali Khan",
      status: "Delivered",
      amount: "Rs. 3,200",
      date: "Oct 28, 2025",
    },
    {
      id: "#1022",
      product: "Graphic Tee",
      buyer: "Sara Ahmed",
      status: "Processing",
      amount: "Rs. 1,800",
      date: "Oct 27, 2025",
    },
    {
      id: "#1021",
      product: "Hoodie",
      buyer: "Zain Malik",
      status: "Pending",
      amount: "Rs. 2,500",
      date: "Oct 25, 2025",
    },
  ];

  const storesget = async () => {
    const token = localStorage.getItem("token");
    const response = await GetInitalStore(String(token));
    if (response.status === 200 || response.status === 201) {
      const data = response.data as StoreApiResponse;
      console.log(data);
      setStoreList(data.storeList);
    }
  };
  const getData = async () => {
    const token = localStorage.getItem("token");
    const response = await GetUserData(String(token));

    if (response.status === 200 || response.status === 201) {
      const user = response.data as userDatagetApiResponse;
      setStoreEmail(user.userData[0].email);
    }

    if (response.status === 401) {
      router.push("/sellerlogin");
    }
  };
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
    } else if (response.status === 401) return router.push("/sellerlogin");
  };
  const DefaultStore = async (ID: string) => {
    const token = localStorage.getItem("token");
    const response = await StoreDefaultSet(ID, String(token));

    if (response.status === 200 || response.status === 201) {
      setResponseBack(1);
      setStoreShow(true);
      setDefaultStoreset(false);
    }

    if (response.status === 401) {
      router.push("/sellerlogin");
    }
    setResponseBack(4);
  };
  const createStore = async () => {
    if (!storeDescription || !storeEmail) return setResponseBack(2);
    else {
      const token = localStorage.getItem("token");
      const formData = {
        email: storeEmail,
        zoneID: ZoneID,
        storeName: storeName,
        description: storeDescription,
      };
      const response = await StoreCreation(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        storesget();
        setStoreShow(true);
        setaddStoreForm(false);
        setStoreName("");
        setStoreDescription("");
        setResponseBack(1);
      }

      if (response.status === 401) {
        router.push("/sellerlogin");
      }
      if (response.status === 409) {
        return setResponseBack(3);
      } else return setResponseBack(4);
    }
  };
  const getStatData = async () => {
    const token = localStorage.getItem("token");
    const response = await GetMainStoreOnBoard(String(token));
    if (response.status === 200) {
      const data = response.data as ResponseData;
      setTotalProduct(data.queryTotalProducts ?? 0);
      setPendingOrder(data.queryPendingOrders ?? 0);
      setCompleteOrder(data.queryCompletedOrders ?? 0);
      setTopRating(data.queryTopRating ?? 0);
      setTotalRevenue(data.queryTotalRevenue ?? 0);
      console.log(response.data);
    }
  };
  useEffect(() => {
    getStatData();
    storesget();
    getCountry();
  }, []);

  useEffect(() => {
    if (
      responseBack === 1 ||
      responseBack === 2 ||
      responseBack === 3 ||
      responseBack === 4
    ) {
      setTimeout(() => {
        setResponseBack(0);
      }, 2000);
    }
  }, [responseBack]);
  return (
    <div className="w-full">
      <div className="w-full flex justify-end">
        <button
          onClick={() => {
            setStoreShow(true);
          }}
          className=" border border-gray-200 hover:bg-gray-200 rounded-md  px-3 py-2"
        >
          <span className=" flex justify-around align-center gap-1">
            <span>List Store</span>
          </span>{" "}
        </button>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Seller Dashboard Overview
      </h1>

      {storeShow && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Your Stores
              </h2>
              <button
                onClick={() => setStoreShow(false)}
                className="p-1 rounded-full hover:bg-gray-200 transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {storeList.length > 0 ? (
              <>
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Store Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 flex-1">
                    {storeList.map((item) => (
                      <div
                        key={item.storeID}
                        onClick={() => {
                          sessionStorage.setItem("storeID", item.storeID);
                          router.push("/SelectedStore");
                        }}
                        className="relative bg-gray-50 shadow-md border border-gray-200 p-5 rounded-2xl 
                             hover:shadow-lg hover:-translate-y-1 hover:bg-white transition-all 
                             cursor-pointer text-center flex flex-col justify-center items-center"
                      >
                        {/* Store Image */}
                        {/* {item.imagelist?.length > 0 && (
                          <img
                            src={item.imagelist[0].imageUrl}
                            alt={item.storeName}
                            className="w-full h-32 object-cover rounded-md mb-3 pointer-events-none"
                          />
                        )} */}

                        {/* Store Name */}
                        <h3 className="text-lg font-semibold text-gray-900 pointer-events-none">
                          {item.storeName}
                        </h3>

                        {/* Badge (won’t block clicks) */}
                        <span
                          className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold 
                               w-5 h-5 flex items-center justify-center rounded-full shadow 
                               pointer-events-none"
                        >
                          2
                        </span>

                        {/* Delete Button */}
                        {/* <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent navigating
                            console.log("Delete store:", item.storeID);
                            // Add your delete logic here
                          }}
                          className="absolute bottom-2 right-2 bg-red-600 text-white text-xs font-bold
                               w-6 h-6 flex items-center justify-center rounded-full shadow 
                               hover:bg-red-700"
                        >
                          ×
                        </button> */}
                      </div>
                    ))}
                  </div>

                  {/* Optional Create Store Sidebar (hidden for now) */}
                  {/* <div className="flex sm:flex-col justify-center items-center sm:items-start">
              <button
                onClick={() => {
                  setaddStoreForm(true);
                  setStoreShow(false);
                  getData();
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all text-lg font-medium"
              >
                + Create Store
              </button>
            </div> */}
                </div>

                {storeList.length > 1 && (
                  <button
                    onClick={() => {
                      setDefaultStoreset(true);
                      setStoreShow(false);
                    }}
                    className="mt-2 text-blue-400 hover:underline cursor-pointer"
                  >
                    Set-Up a Default Store
                  </button>
                )}
              </>
            ) : (
              <div className="flex justify-center items-center h-40">
                <button
                  onClick={() => {
                    setaddStoreForm(true);
                    setStoreShow(false);
                    getData();
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all text-lg font-medium"
                >
                  + Create Your First Store
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {addStoreForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 relative
                    max-h-[90vh] overflow-y-auto"
          >
            {/* Back Button */}
            <button
              onClick={() => {
                setStoreShow(true);
                setaddStoreForm(false);
              }}
              className="absolute left-4 top-4 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft />
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Create New Store
            </h2>

            <div className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={storeEmail}
                  readOnly
                  className="w-full px-3 py-3 border rounded-md bg-gray-100 border-gray-300"
                />
              </div>

              {/* Store Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Enter store name"
                  className="w-full px-3 py-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* City */}
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

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  placeholder="Enter store description..."
                  rows={4}
                  className="w-full px-3 py-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Messages */}
              {responseBack === 2 && (
                <div className="bg-red-100 text-red-800 p-3 rounded text-center">
                  Fill in all required fields
                </div>
              )}
              {responseBack === 1 && (
                <div className="bg-green-100 text-green-800 p-3 rounded text-center">
                  Store created successfully
                </div>
              )}
              {responseBack === 3 && (
                <div className="bg-red-100 text-red-800 p-3 rounded text-center">
                  Store limit reached
                </div>
              )}
              {responseBack === 4 && (
                <div className="bg-red-100 text-red-800 p-3 rounded text-center">
                  Network error
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={createStore}
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-white transition
            ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            }
          `}
              >
                {loading ? "Creating..." : "Create Store"}
              </button>
            </div>
          </div>
        </div>
      )}

      {defaultStoreset && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center">
            {/* Header */}
            <div className="w-full flex justify-start ">
              <button
                onClick={() => {
                  setDefaultStoreset(false);
                  setStoreShow(true);
                }}
                className=" cursor-pointer hover:text-gray-900"
              >
                <ChevronLeft />
              </button>
            </div>
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 border border-gray-200 mt-10">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Set Default Store
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 flex-1">
                {storeList.map((item) => {
                  const isSelected = selectedStore === item.storeID;

                  return (
                    <div
                      onClick={() => setSelectedStore(item.storeID)}
                      className={`relative cursor-pointer rounded-2xl border p-5 text-center
    transition-all flex flex-col items-center justify-center
    ${
      selectedStore === item.storeID
        ? "border-blue-600 ring-2 ring-blue-200 bg-white shadow-lg"
        : "border-gray-200 bg-gray-50 shadow-md hover:shadow-lg hover:-translate-y-1"
    }
  `}
                    >
                      <input
                        type="radio"
                        checked={selectedStore === item.storeID}
                        readOnly
                        className="hidden"
                      />

                      <h3 className="text-lg font-semibold text-gray-900 px-3">
                        {item.storeName}
                      </h3>
                    </div>
                    //       <label
                    //         key={item.storeID}
                    //         className={`
                    //   relative cursor-pointer rounded-2xl border p-5 text-center
                    //   transition-all flex flex-col items-center justify-center
                    //   ${
                    //     isSelected
                    //       ? "border-blue-600 ring-2 ring-blue-200 bg-white shadow-lg"
                    //       : "border-gray-200 bg-gray-50 shadow-md hover:shadow-lg hover:-translate-y-1"
                    //   }
                    // `}
                    //       >
                    //         {/* Hidden Radio */}
                    //         <input
                    //           type="radio"
                    //           name="store"
                    //           value={item.storeID}
                    //           checked={isSelected}
                    //           onChange={() => setSelectedStore(item.storeID)}
                    //           className="hidden"
                    //         />

                    //         {/* Store Name */}
                    //         <h3 className="text-lg font-semibold text-gray-900 px-3 ">
                    //           {item.storeName}
                    //         </h3>
                    //       </label>
                  );
                })}
              </div>
              <div className="space-y-5">
                {/* Messages */}
                {responseBack === 2 && (
                  <div className="w-full bg-red-100 text-red-800 p-3 rounded text-center">
                    Fill in All Required Fields
                  </div>
                )}
                {responseBack === 1 && (
                  <div className="w-full bg-green-100 text-green-800 p-3 rounded text-center">
                    Store Default Successfully
                  </div>
                )}
                {responseBack === 3 && (
                  <div className="w-full bg-red-100 text-red-800 p-3 rounded text-center">
                    Store Limit Reached
                  </div>
                )}
                {responseBack === 4 && (
                  <div className="w-full bg-red-100 text-red-800 p-3 rounded text-center">
                    Network Error
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={() => DefaultStore(String(selectedStore))} // Your API call function
                  type="button"
                  className="w-full py-3 mt-2 bg-indigo-500 text-white rounded-xl font-semibold shadow-lg hover:bg-indigo-600 transition"
                >
                  {loading ? "Saving..." : "Save Store"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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

      {/* === RECENT ORDERS SECTION === */}
      <div className="mt-10 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Orders Received
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-t border-gray-100 text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Buyer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-medium text-gray-700">
                    {order.id}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{order.product}</td>
                  <td className="py-3 px-4 text-gray-600">{order.buyer}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-md font-semibold ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{order.amount}</td>
                  <td className="py-3 px-4 text-gray-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
