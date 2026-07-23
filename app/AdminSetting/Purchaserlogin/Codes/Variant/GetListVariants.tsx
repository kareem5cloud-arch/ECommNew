"use client";
import VarientsGetApi from "@/app/api/Controller/PurchaserLogin/Codes/Variants/GetVarient";

import {
  ResponseVariantsListGet,
  VariantsList,
} from "@/app/api/Types/PurchaserLogin/Codes/Variants/Varints";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  setDelete: (data: boolean) => void;
  update: (data: boolean) => void;
  setID: (data: string) => void;
  CatList: (data: VariantsList[]) => void;
  CategoryNewList: VariantsList[];
  CategoryModifyList: (data: VariantsList) => void;
}
export default function GetCategoryMainList({
  setDelete,
  setID,
  update,
  CatList,
  CategoryModifyList,
  CategoryNewList,
}: propsForAddRegion) {
  const [isloading, setisLoading] = useState(false);

  const [CategoryList, setCategoryList] = useState<VariantsList[]>([]);

  useEffect(() => {
    if (CategoryNewList) {
      setCategoryList(CategoryNewList);
    }
  }, [CategoryNewList]);

  const CategoryGet = async () => {
    try {
      setisLoading(true);

      const token = localStorage.getItem("PurchaserLoginToken");
      const response = await VarientsGetApi(String(token));
      if (response.status == 200) {
        const data = response.data as ResponseVariantsListGet;
        setCategoryList(data.variantsList);
        console.log(data);
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
    const data = CategoryList.find((item) => item.variantsID === ID);
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
              key={item.variantsID}
              className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              {/* Left Side */}
              <div className="flex items-center gap-3">
                <div className="w-2 h-10 bg-blue-500 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800">
                    {item.variantsName}
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {item.varientList.map((item2, index) => (
                      <p
                        key={index}
                        className="px-3 py-1 text-sm rounded-full bg-green-200 text-gray-800"
                      >
                        {item2.value}
                      </p>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    Notes: {item.description}
                  </span>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchData(item.variantsID)}
                  className="p-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                >
                  <Pencil />
                </button>

                <button
                  onClick={() => {
                    setID(item.variantsID);
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
