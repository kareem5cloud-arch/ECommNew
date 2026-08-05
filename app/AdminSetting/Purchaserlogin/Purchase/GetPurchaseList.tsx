"use client";
import GetPurchasetApi from "@/app/api/Controller/PurchaserLogin/Purchase/GetPurchase";
import {
  GetPurchaseList,
  ResponsePurchaseList,
} from "@/app/api/Types/PurchaserLogin/Purchase/Purchase";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  setDelete: (data: boolean) => void;
  update: (data: boolean) => void;
  setID: (data: string) => void;
  CatList: (data: GetPurchaseList[]) => void;
  CategoryNewList: GetPurchaseList[];
  CategoryModifyList: (data: GetPurchaseList) => void;
  onShowMessage: (message: string, type: "success" | "error") => void;
}

export default function GetPurchaseListForm({
  setDelete,
  setID,
  update,
  CatList,
  CategoryModifyList,
  CategoryNewList,
  onShowMessage,
}: propsForAddRegion) {
  const [isloading, setisLoading] = useState(false);

  const [CategoryList, setCategoryList] = useState<GetPurchaseList[]>([]);

  const CategoryGet = async () => {
    try {
      setisLoading(true);

      const token = localStorage.getItem("PurchaserLoginToken");
      const response = await GetPurchasetApi(String(token));
      if (response.status == 200) {
        const data = response.data as ResponsePurchaseList;
        setCategoryList(data.data);
      } else {
        setCategoryList([]);
      }
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    CategoryGet();
  }, []);

  const fetchData = (ID: string) => {
    const data = CategoryList.find((item) => item.ledgerID === ID);
    if (data) {
      CategoryModifyList(data);
      update(true);
    }
  };
  return (
    <>
      <div className="space-y-4">
        {isloading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : CategoryList.length === 0 ? (
          <div className="flex justify-center py-10">
            <span className="text-lg font-semibold text-gray-500">
              No Record Found
            </span>
          </div>
        ) : (
          CategoryList.map((item) => (
            <div
              key={item.ledgerID}
              className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              {/* Left Side */}
              <div className="flex items-center gap-3">
                <div className="w-2 h-10 bg-blue-500 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800">
                    {item.supplierName}
                  </span>
                  <span className="text-sm text-gray-500">
                    Total Bill: {item.totalBill.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    Amount Paid: {item.amountPaid.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchData(item.ledgerID)}
                  className="p-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                >
                  <Pencil />
                </button>

                <button
                  onClick={() => {
                    setID(item.ledgerID);
                    setDelete(true);
                    CatList(CategoryList);
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
