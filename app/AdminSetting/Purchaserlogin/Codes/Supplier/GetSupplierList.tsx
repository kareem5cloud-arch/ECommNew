"use client";

import SuppliergetApi from "@/app/api/Controller/PurchaserLogin/Codes/Supplier/SupplierGet";
import {
  ResponseGetSupplpierlist,
  SupplierListReponse,
} from "@/app/api/Types/PurchaserLogin/Supplier/supplier";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  setDelete: (data: boolean) => void;
  update: (data: boolean) => void;
  setID: (data: string) => void;
  CatList: (data: SupplierListReponse[]) => void;
  CategoryNewList: SupplierListReponse[];
  CategoryModifyList: (data: SupplierListReponse) => void;
}
export default function GetSupplierList({
  setDelete,
  setID,
  update,
  CatList,
  CategoryModifyList,
  CategoryNewList,
}: propsForAddRegion) {
  const [isloading, setisLoading] = useState(false);

  const [SupplierList, setSupplierList] = useState<SupplierListReponse[]>([]);

  useEffect(() => {
    if (CategoryNewList) {
      setSupplierList(CategoryNewList);
    }
  }, [CategoryNewList]);

  const CategoryGet = async () => {
    try {
      setisLoading(true);

      const token = localStorage.getItem("PurchaserLoginToken");
      const response = await SuppliergetApi(String(token));
      if (response.status == 200) {
        const data = response.data as ResponseGetSupplpierlist;
        setSupplierList(data.supplierList);
      } else {
        setSupplierList([]);
      }
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    CategoryGet();
  }, []);

  const fetchData = (ID: string) => {
    const data = SupplierList.find((item) => item.supplierID === ID);
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
        ) : SupplierList.length === 0 ? (
          <div className="flex justify-center py-10">
            <span className="text-lg font-semibold text-gray-500">
              No Record Found
            </span>
          </div>
        ) : (
          SupplierList.map((item) => (
            <div
              key={item.supplierID}
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
                    Phone No: {item.phoneNo}
                  </span>
                  <span className="text-sm text-gray-500">
                    Opening Balance: {item.openingBalance}
                  </span>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchData(item.supplierID)}
                  className="p-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                >
                  <Pencil />
                </button>

                <button
                  onClick={() => {
                    setID(item.supplierID);
                    setDelete(true);
                    CatList(SupplierList);
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
