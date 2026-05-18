"use client";
import AddZone from "@/api/lib/Shippment/Zone/AddZone";
import GetRegion from "@/api/lib/Shippment/Region/GetRegion";

import Spinner from "@/component/spinner/page";
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import ModifyZone from "@/api/lib/Shippment/Zone/ModifyZone";
import GetZone from "@/api/lib/Shippment/Zone/GetZone";
import DeleteZone from "@/api/lib/Shippment/Zone/DeleteZone";
import { Product, ProductApiResponse } from "@/api/types/product/getProduct";
import GetProduct from "@/api/lib/product/GetProduct/GetProduct";
import GetInitalStoreSalesMan from "@/api/lib/store/GetStoreSalesMan/GetStoreSalesMan";
import { StoreApiResponse, storeInital } from "@/api/types/storeGet";
import AddTillForPos from "@/api/lib/MainDashbaord/TillCreate/TillCreate";
import GetTillForPos from "@/api/lib/MainDashbaord/TillCreate/TillGet";
import ModifyTillForPos from "@/api/lib/MainDashbaord/TillCreate/ModifyTill";
import DeleteTillForPos from "@/api/lib/MainDashbaord/TillCreate/DeleteTill";
import AddLoginForPos from "@/api/lib/MainDashbaord/CreteLogin/AddLogin";

interface RespiosneGet {
  message: string;
  tillList: TillList[];
}
interface TillList {
  tillID: string;
  tillName: string;
  tillSubList: TillSubList[];
}
interface TillSubList {
  listID: string;
  productID: string;
  productName: string;
}

export default function TillManagement() {
  const router = useRouter();
  const [showList, setShowList] = useState(true);
  const [loading, setLoading] = useState(true);
  const [Update, setUpdate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isTrue, setIsTrue] = useState(false);
  const [responseBack, setResponseBack] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const [UserName, setUserName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const [TillID, setTillID] = useState("");

  const [TillList, setTillList] = useState<TillList[]>([]);

  const getTill = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await GetTillForPos(String(token));
      if (response.status === 200) {
        console.log(response);
        const data = response.data as RespiosneGet;
        if (data) {
          setTillID(data.tillList[0].tillID);
          setTillList(data.tillList);
        } else {
          setTillList([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const CreateLogin = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("token");
      const formData = {
        email: Email,
        password: Password,
        tillID: TillID,
      };
      const response = await AddLoginForPos(formData, String(token));
      if (response.status === 200) {
        setEmail("");
        setPassword("");
        setIsTrue(false);
        setResponseBack("Record Added Successfully");
      } else if (response.status === 400) {
        setIsTrue(true);
        setResponseBack("PLease Fill in Required Fields");
      } else {
        setIsTrue(true);
        setResponseBack("Something Went Wrong. Please try again later.");
      }
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    getTill();
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Login Management
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
                  // deleteTill(ID);
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
          <></>
        ) : (
          // <>
          //   {loading ? (
          //     <div className="flex justify-center py-10">
          //       <Spinner />
          //     </div>
          //   ) : (
          //     <>
          //       {TillList.length > 0 ? (
          //         <>
          //           {TillList.map((item) => (
          //             <div
          //               className="p-4 border mt-2 border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition flex justify-between items-center"
          //               key={item.tillID}
          //             >
          //               <div className="flex flex-col">
          //                 <h3 className="text-lg font-semibold text-gray-800">
          //                   {item.tillName}
          //                 </h3>
          //                 <div className="flex flex-wrap gap-2 mt-1">
          //                   {item.tillSubList.map((subItem, index) => (
          //                     <span
          //                       key={index}
          //                       className="inline-block bg-green-300 text-green-800 text-xs font-semibold px-2 py-1 rounded-full"
          //                     >
          //                       {subItem.productName}
          //                     </span>
          //                   ))}
          //                 </div>
          //               </div>
          //               <div className="flex gap-4">
          //                 <button
          //                   onClick={() => fetchData(item.tillID)}
          //                   className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
          //                   title="Edit"
          //                 >
          //                   <Pencil className="w-5 h-5" />
          //                 </button>
          //                 <button
          //                   onClick={() => {
          //                     setIsOpen(true);
          //                     setID(item.tillID);
          //                   }}
          //                   className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
          //                   title="Delete"
          //                 >
          //                   <Trash className="w-5 h-5" />
          //                 </button>
          //               </div>
          //             </div>
          //           ))}
          //         </>
          //       ) : (
          //         <div className="w-full bg-red-100 text-red-800 text-center px-4 py-3 mb-2 rounded">
          //           No Record Found
          //         </div>
          //       )}
          //     </>
          //   )}
          // </>
          <div className="space-y-5 mt-2">
            {/* === Column: Sub Category === */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Tills
              </label>
              <div className="flex items-center w-full border border-gray-200 rounded-lg bg-gray-50 px-3 py-2">
                <select
                  value={TillID}
                  onChange={(e) => {
                    setTillID(e.target.value);
                  }}
                  className="flex-1 bg-transparent outline-none text-gray-900 p-1"
                >
                  {TillList.length === 0 ? (
                    <option value="">No Record Found</option>
                  ) : (
                    <>
                      {TillList.map((item) => (
                        <option key={item.tillID} value={item.tillID}>
                          {item.tillName}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                name="Zone Name"
                placeholder="Enter Email"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                type="text"
                name="Zone Name"
                placeholder="Enter Password"
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
                  // onClick={ModifyTill}
                  className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
                >
                  {isLoading ? "Updating...." : "Update"}
                </button>
              </div>
            ) : (
              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={CreateLogin}
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
