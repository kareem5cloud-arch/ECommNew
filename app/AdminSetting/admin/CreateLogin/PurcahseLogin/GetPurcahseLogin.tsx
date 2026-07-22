import OfflineSellerSignUpList from "@/app/api/Controller/Authentication/SignupList/OfflineSellerList/OfflineSellerList";
import OnlineSellerSignUpList from "@/app/api/Controller/Authentication/SignupList/OnlineSellerList/OnlineSellerList";
import GetPurchaserLoginSignUpList from "@/app/api/Controller/Authentication/SignupList/PurcahserLogin/PurcahserLogin";
import RevokeSellerApi from "@/app/api/Controller/Authentication/SignupList/RevokeSeller/RevokeSeller";
import GetWareHouseSellerSignUpList from "@/app/api/Controller/Authentication/SignupList/WareHouseSeller/GetWareHouseSeller";
import {
  ResponseSignUpList,
  signupList,
} from "@/app/api/Types/Authentication/SignUpLoginList";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { Info, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  setDelete: (data: boolean) => void;
  update: (data: boolean) => void;
  setID: (data: string) => void;
  standardListRecord: (data: signupList[]) => void;
  standardListNewRecord: signupList[];
  standardModifyListRecord: (data: signupList) => void;
  onShowMessage: (message: string, type: "success" | "error") => void;
}
export default function GetLoginList({
  setDelete,
  update,
  setID,
  onShowMessage,
  standardListRecord,
  standardModifyListRecord,
  standardListNewRecord,
}: propsForAddRegion) {
  const [isloading, setisLoading] = useState(false);
  const [value, setValue] = useState(false);
  const [courierServiceList, setCourierServiceList] = useState<signupList[]>(
    [],
  );

  const Standardget = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await GetPurchaserLoginSignUpList(String(token));
      if (response.status == 200) {
        const data = response.data as ResponseSignUpList;
        setCourierServiceList(data.signupList);
      } else {
        setCourierServiceList([]);
      }
    } finally {
      setisLoading(false);
    }
  };
  useEffect(() => {
    Standardget();
  }, []);

  const fetchData = (ID: string) => {
    const data = courierServiceList.find((item) => item.sellerID === ID);
    if (data) {
      console.log(data);
      standardModifyListRecord(data);
      update(true);
    }
  };
  const fetchDataRevoke = async (ID: string) => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await RevokeSellerApi(ID, value, String(token));
      if (response.status == 200) {
        Standardget();
      } else {
        Standardget;
      }
    } finally {
      setisLoading(false);
    }
  };
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
              key={item.sellerID}
              className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              {/* Left Side */}
              <div className="flex items-center gap-3">
                <div className="w-2 h-10 bg-blue-500 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800">
                    {item.email}
                  </span>
                  <span className="text-sm text-gray-500">
                    UserName : {item.userName}
                  </span>
                  <span className="text-sm text-gray-500">
                    Phone No : {item.phone}
                  </span>
                  <span className="text-sm text-gray-500">
                    Blocked : {item.isActive ? "True" : "False"}
                  </span>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                <button
                  title="Revoke"
                  onClick={() => {
                    setValue(!value);
                    fetchDataRevoke(item.sellerID);
                  }}
                  className="p-2 text-yellow-600 border border-yellow-600 rounded hover:bg-yellow-50 transition"
                >
                  <Info />
                </button>
                <button
                  title="Edit"
                  onClick={() => fetchData(item.sellerID)}
                  className="p-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                >
                  <Pencil />
                </button>

                <button
                  title="Delete"
                  onClick={() => {
                    setID(item.sellerID);
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
