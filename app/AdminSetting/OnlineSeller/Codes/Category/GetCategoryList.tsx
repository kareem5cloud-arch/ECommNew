"use client";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";

export default function GetCategoryMainList() {
  const [isloading, setisLoading] = useState(false);
  return (
    <>
      <div>
        {isloading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition relative">
              {/* Left: Till Info */}
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-800">
                  Fashion - Desgin
                </span>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                  //onClick={() => fetchData(item.bankID)}
                >
                  <Pencil />
                </button>

                <button
                  // onClick={() => {
                  //   setDelete(true);
                  //   setID(item.bankID);
                  // }}
                  className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition"
                >
                  <Trash />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
