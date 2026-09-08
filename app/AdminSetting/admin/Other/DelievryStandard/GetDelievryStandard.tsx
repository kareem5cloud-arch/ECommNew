"use client";
import DelievryStandardGetApi from "@/app/api/Controller/AdminController/Shipment/DelievryStandard/GetStandard";
import {
  DelievryDataStandard,
  ResponpseDelievryStandard,
} from "@/app/api/Types/Shipment/DelievryStandard";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  setDelete: (data: boolean) => void;
  update: (data: boolean) => void;
  setID: (data: string) => void;
  standardListRecord: (data: DelievryDataStandard[]) => void;
  standardListNewRecord: DelievryDataStandard[];
  standardModifyListRecord: (data: DelievryDataStandard) => void;
  onShowMessage: (message: string, type: "success" | "error") => void;
}

export default function GetDelievryStadandard({
  setDelete,
  update,
  setID,
  standardListRecord,
  standardListNewRecord,
  standardModifyListRecord,
}: propsForAddRegion) {
  const [isloading, setisLoading] = useState(false);
  const [delievryStadnard, setDeleivryStadnard] = useState<
    DelievryDataStandard[]
  >([]);

  useEffect(() => {
    if (standardListNewRecord) {
      setDeleivryStadnard(standardListNewRecord);
    }
  }, [standardListNewRecord]);

  const Standardget = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await DelievryStandardGetApi(String(token));
      if (response.status == 200) {
        const data = response.data as ResponpseDelievryStandard;
        setDeleivryStadnard(data.delievryData);
      } else {
        setDeleivryStadnard([]);
      }
    } finally {
      setisLoading(false);
    }
  };
  const fetchData = (ID: string) => {
    const data = delievryStadnard.find((item) => item.deliveryTypeID === ID);
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
        ) : delievryStadnard.length === 0 ? (
          <div className="flex justify-center py-10">
            <span className="text-lg font-semibold text-gray-500">
              No Record Found
            </span>
          </div>
        ) : (
          delievryStadnard.map((item) => (
            <div
              key={item.deliveryTypeID}
              className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              {/* Left Side */}
              <div className="flex items-center gap-3">
                <div className="w-2 h-10 bg-blue-500 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800">
                    {item.typeName}
                  </span>
                  <span className="text-sm text-gray-500">
                    Estimate Time: {item.numberofDays}
                  </span>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchData(item.deliveryTypeID)}
                  className="p-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                >
                  <Pencil />
                </button>

                <button
                  onClick={() => {
                    setID(item.deliveryTypeID);
                    setDelete(true);
                    standardListRecord(delievryStadnard);
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
