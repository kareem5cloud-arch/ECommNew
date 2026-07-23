"use client";
import CategoryGetApi from "@/app/api/Controller/PurchaserLogin/Codes/Category/CategoryGet";
import {
  CategoryList,
  ResponseCategory,
} from "@/app/api/Types/OnlineSetting/Category/Category";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  setDelete: (data: boolean) => void;
  update: (data: boolean) => void;
  setID: (data: string) => void;
  CatList: (data: CategoryList[]) => void;
  CategoryNewList: CategoryList[];
  CategoryModifyList: (data: CategoryList) => void;
  onShowMessage: (message: string, type: "success" | "error") => void;
}
export default function GetCategoryMainList({
  setDelete,
  setID,
  update,
  CatList,
  CategoryModifyList,
  CategoryNewList,
  onShowMessage,
}: propsForAddRegion) {
  const [isloading, setisLoading] = useState(false);

  const [CategoryList, setCategoryList] = useState<CategoryList[]>([]);

  useEffect(() => {
    if (CategoryNewList) {
      setCategoryList(CategoryNewList);
    }
  }, [CategoryNewList]);

  const CategoryGet = async () => {
    try {
      setisLoading(true);

      const token = localStorage.getItem("PurchaserLoginToken");
      const response = await CategoryGetApi(String(token));
      if (response.status == 200) {
        const data = response.data as ResponseCategory;
        setCategoryList(data.categoryList);
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
    const data = CategoryList.find((item) => item.categoryID === ID);
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
              key={item.categoryID}
              className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              {/* Left Side */}
              <div className="flex items-center gap-3">
                <div className="w-2 h-10 bg-blue-500 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800">
                    {item.categoryName}
                  </span>
                  <span className="text-sm text-gray-500">
                    Store: {item.storeName}
                  </span>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchData(item.categoryID)}
                  className="p-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                >
                  <Pencil />
                </button>

                <button
                  onClick={() => {
                    setID(item.categoryID);
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
