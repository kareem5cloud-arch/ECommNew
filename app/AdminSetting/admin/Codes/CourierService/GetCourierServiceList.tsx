import CourierServiceGet from "@/app/api/Controller/AdminController/CourierService/GetCourier";
import {
  courierList,
  responseCourierService,
} from "@/app/api/Types/AdminSetting/CourierService/CourierService";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  setDelete: (data: boolean) => void;
  update: (data: boolean) => void;
  setID: (data: string) => void;
  standardListRecord: (data: courierList[]) => void;
  standardListNewRecord: courierList[];
  standardModifyListRecord: (data: courierList) => void;
  onShowMessage: (message: string, type: "success" | "error") => void;
}
export default function GetCourierList({
  setDelete,
  update,
  setID,
  standardListRecord,
  standardListNewRecord,
  standardModifyListRecord,
}: propsForAddRegion) {
  const [isloading, setisLoading] = useState(false);
  const [courierServiceList, setCourierServiceList] = useState<courierList[]>(
    [],
  );

  useEffect(() => {
    if (standardListNewRecord) {
      setCourierServiceList(standardListNewRecord);
    }
  }, [standardListNewRecord]);

  const Standardget = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await CourierServiceGet(String(token));
      if (response.status == 200) {
        const data = response.data as responseCourierService;
        setCourierServiceList(data.courierList);
      } else {
        setCourierServiceList([]);
      }
    } finally {
      setisLoading(false);
    }
  };
  const fetchData = (ID: string) => {
    const data = courierServiceList.find((item) => item.courierID === ID);
    if (data) {
      console.log(data);
      standardModifyListRecord(data);
      update(true);
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
              key={item.deliveryTypeID}
              className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              {/* Left Side */}
              <div className="flex items-center gap-3">
                <div className="w-2 h-10 bg-blue-500 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800">
                    {item.serviceName}
                  </span>
                  <span className="text-sm text-gray-500">
                    Delivery Service: {item.typeName}
                  </span>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchData(item.courierID)}
                  className="p-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                >
                  <Pencil />
                </button>

                <button
                  onClick={() => {
                    setID(item.courierID);
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
