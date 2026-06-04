"use client";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import { useState } from "react";

interface CatgeoryList {
  categoryID: string;
  categoryName: string;
}
export default function OrderTracking() {
  const [CategoryID, setCategoryID] = useState("");
  const [CategoryList, setCategoryList] = useState<CatgeoryList[]>([]);
  return (
    <>
      <div>
        <div className="flex justify-between items-center mt-6 mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Order Tracking Assign
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          <div className="w-full flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:max-w-md space-y-4">
              <div className="w-full lg:max-w-md space-y-4">
                {/* <DropDownList
                  label="Courier "
                  placeholder="Enter Courier"
                  required={true}
                  value={CategoryID}
                  onChange={setCategoryID}
                  options={CategoryList.map((item) => ({
                    label: item.categoryID,
                    value: item.categoryName,
                  }))}
                />
                <DropDownList
                  label="OrderList"
                  placeholder="Enter OrderList"
                  required={true}
                  value={CategoryID}
                  onChange={setCategoryID}
                  options={CategoryList.map((item) => ({
                    label: item.categoryID,
                    value: item.categoryName,
                  }))}
                /> */}
                <div className="flex justify-end">
                  <ActionButton
                    text="Save"
                    update={false}
                    loading={false}
                    loadingtext="Saving..."
                    onClick={() => {}}
                    disabled={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
