import DropDownList from "@/app/ui/DropDownList/DropDownList";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
interface CatgeoryList {
  categoryID: string;
  categoryName: string;
}
interface StoreList {
  storeID: string;
  storeName: string;
}

export default function GetSubCategoryList() {
  const [CategoryID, setCategoryID] = useState("");
  const [CategoryList, setCategoryList] = useState<CatgeoryList[]>([]);
  const [isloading, setisLoading] = useState(false);
  const [StoreID, setStoreID] = useState("");
  const [StoreList, setStoreList] = useState<StoreList[]>([]);
  return (
    <>
      <div className="mb-2">
        <DropDownList
          label="Category "
          placeholder="Enter Category"
          required={true}
          value={CategoryID}
          onChange={setCategoryID}
          options={CategoryList.map((item) => ({
            label: item.categoryID,
            value: item.categoryName,
          }))}
        />
      </div>
      <div className="mb-2">
        <DropDownList
          label="Store "
          placeholder="Enter Store"
          required={true}
          value={StoreID}
          onChange={setStoreID}
          options={StoreList.map((item) => ({
            label: item.storeID,
            value: item.storeName,
          }))}
        />
      </div>
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
                  Rawalpindi
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
