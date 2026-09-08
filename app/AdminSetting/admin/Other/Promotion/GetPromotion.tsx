"use client";

import PromotionGetApi from "@/app/api/Controller/AdminController/Shipment/Promotion/GetPromotion";
import {
  RequestModifyPromotion,
  ResponseGetPromotion,
} from "@/app/api/Types/AdminSetting/Promotion/Promotion";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  setDelete: (data: boolean) => void;
  update: (data: boolean) => void;
  setID: (data: string) => void;
  standardListRecord: (data: RequestModifyPromotion[]) => void;
  standardListNewRecord: RequestModifyPromotion[];
  standardModifyListRecord: (data: RequestModifyPromotion) => void;
  onShowMessage: (message: string, type: "success" | "error") => void;
}
export default function GetPromotionList({
  setDelete,
  update,
  setID,
  standardListNewRecord,
  standardModifyListRecord,
  standardListRecord,
  onShowMessage,
}: propsForAddRegion) {
  const [isloading, setisLoading] = useState(false);
  const [PromotionList, setPromotionList] = useState<RequestModifyPromotion[]>(
    [],
  );

  useEffect(() => {
    if (standardListNewRecord) {
      setPromotionList(standardListNewRecord);
    }
  }, [standardListNewRecord]);

  const Standardget = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await PromotionGetApi(String(token));
      if (response.status == 200) {
        const data = response.data as ResponseGetPromotion;
        setPromotionList(data.promolist);
      } else {
        setPromotionList([]);
      }
    } finally {
      setisLoading(false);
    }
  };
  const fetchData = (ID: string) => {
    const data = PromotionList.find((item) => item.promoID === ID);
    if (data) {
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
        ) : PromotionList.length === 0 ? (
          <div className="flex justify-center py-10">
            <span className="text-lg font-semibold text-gray-500">
              No Record Found
            </span>
          </div>
        ) : (
          PromotionList.map((item) => (
            <div
              key={item.promoID}
              className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              {/* Left Side */}
              <div className="flex items-center gap-3">
                <div className="w-2 h-10 bg-blue-500 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800">
                    {item.promotionName}
                  </span>
                  <span className="text-sm text-gray-500">
                    Promo Code: {item.promoCode}
                  </span>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchData(item.promoID)}
                  className="p-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                >
                  <Pencil />
                </button>

                <button
                  onClick={() => {
                    setID(item.promoID);
                    setDelete(true);
                    standardListRecord(PromotionList);
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
