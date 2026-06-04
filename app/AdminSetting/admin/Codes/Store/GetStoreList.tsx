import StoreDefaultApi from "@/app/api/Controller/AdminController/Store/DefaultStoreSetting";
import StoreGetApi from "@/app/api/Controller/AdminController/Store/GetStore";
import {
  ResponseGetStore,
  storeList,
} from "@/app/api/Types/AdminSetting/Store/Store";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { Info, InfoIcon, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface countryList {
  countryID: string;
  countryName: string;
}
interface propsForAddRegion {
  setDelete: (data: boolean) => void;
  update: (data: boolean) => void;
  setID: (data: string) => void;
  standardListRecord: (data: storeList[]) => void;
  standardListNewRecord: storeList[];
  onShowMessage: (message: string, type: "success" | "error") => void;
}
export default function GetStoreList({
  setDelete,
  update,
  setID,
  standardListNewRecord,
  standardListRecord,
  onShowMessage,
}: propsForAddRegion) {
  const [isloading, setisLoading] = useState(false);
  const [courierServiceList, setCourierServiceList] = useState<storeList[]>([]);

  useEffect(() => {
    if (standardListNewRecord) {
      setCourierServiceList(standardListNewRecord);
    }
  }, [standardListNewRecord]);

  const Standardget = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await StoreGetApi(String(token));
      if (response.status == 200) {
        const data = response.data as ResponseGetStore;
        setCourierServiceList(data.storeList);
      } else {
        setCourierServiceList([]);
      }
    } finally {
      setisLoading(false);
    }
  };

  const DefautlStoreSet = async (ID: string) => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await StoreDefaultApi(ID, String(token));
      if (response.status == 200) {
        Standardget();
      } else {
        Standardget;
      }
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    Standardget();
  }, []);

  return (
    <>
      <div className="space-y-4">
        {isloading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : courierServiceList.length === 0 ? (
          <div className="flex justify-center py-10">
            <span className="text-lg font-semibold text-gray-500">
              No Record Found
            </span>
          </div>
        ) : (
          courierServiceList.map((item) => (
            <div
              key={item.storeID}
              className={`flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition ${
                item.defaultStore === true ? "border-2 border-blue-500" : ""
              }`}
            >
              {/* Left Side */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-10 rounded-full ${
                    item.defaultStore === true ? "bg-blue-500" : "bg-blue-500"
                  }`}
                />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800">
                    {item.storeName}
                  </span>
                  {/* Optional: Add a default badge */}
                  {item.defaultStore === true && (
                    <span className="text-xs text-blue-600 font-medium mt-1">
                      ✓ Default Store
                    </span>
                  )}
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    DefautlStoreSet(item.storeID);
                  }}
                  className="p-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                >
                  <InfoIcon />
                </button>

                <button
                  onClick={() => {
                    setID(item.storeID);
                    setDelete(true);
                    standardListRecord(courierServiceList);
                  }}
                  className="p-2 text-red-600 border border-red-600 rounded hover:bg-red-50 transition"
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
