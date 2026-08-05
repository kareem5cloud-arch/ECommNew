import CategorySubGetApi from "@/app/api/Controller/PurchaserLogin/Codes/SubCategory/GetSubCategory";
import { CategoryList } from "@/app/api/Types/PurchaserLogin/Codes/Category/Category";
import {
  ResponseSubCategory,
  subCategoryList,
} from "@/app/api/Types/PurchaserLogin/Codes/SubCategory/SubCategory";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface PropsSubCategory {
  setDelete: (data: boolean) => void;
  update: (data: boolean) => void;
  setID: (data: string) => void;
  categoryList: CategoryList[];
  SubCatList: (data: subCategoryList[]) => void;
  SubCategoryNewList: subCategoryList[];
  SubCategoryModifyList: (data: subCategoryList) => void;
  onShowMessage: (message: string, type: "success" | "error") => void;
}

export default function GetSubCategoryList({
  setDelete,
  update,
  setID,
  categoryList,
  onShowMessage,
  SubCatList,
  SubCategoryModifyList,
  SubCategoryNewList,
}: PropsSubCategory) {
  const [CategoryID, setCategoryID] = useState("");
  const [CategoryName, setCategoryName] = useState("");
  const [SubCategoryList, setSubCategoryList] = useState<subCategoryList[]>([]);
  const [isloading, setisLoading] = useState(false);

  useEffect(() => {
    if (SubCategoryNewList) {
      setSubCategoryList(SubCategoryNewList);
    }
  }, [SubCategoryNewList]);

  const CategoryGet = async (ID: string) => {
    try {
      setisLoading(true);

      const token = localStorage.getItem("PurchaserLoginToken");
      const response = await CategorySubGetApi(ID, String(token));
      if (response.status == 200) {
        const data = response.data as ResponseSubCategory;
        setSubCategoryList(data.subCategoryList);
      } else {
        setSubCategoryList([]);
      }
    } finally {
      setisLoading(false);
    }
  };
  const fetchData = (ID: string) => {
    const data = SubCategoryList.find((item) => item.subCategoryID === ID);
    if (data) {
      SubCategoryModifyList(data);
      update(true);
    }
  };
  return (
    <>
      <div className="mb-2">
        <DropDownList
          label="Category "
          placeholder="Enter Category"
          required={true}
          filedID={setCategoryID}
          value={CategoryName}
          onChange={setCategoryName}
          options={categoryList.map((item) => ({
            label: item.categoryName,
            value: item.categoryName,
            id: item.categoryID,
          }))}
        />
      </div>
      <div className="flex justify-end">
        <ActionButton
          text="Search"
          update={false}
          loading={false}
          loadingtext="Fetching..."
          onClick={() => CategoryGet(CategoryID)}
          disabled={false}
        />
      </div>

      <div className="space-y-4">
        {isloading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : SubCategoryList.length === 0 ? (
          <div className="flex justify-center py-10">
            <span className="text-lg font-semibold text-gray-500">
              No Record Found
            </span>
          </div>
        ) : (
          SubCategoryList.map((item) => (
            <div
              key={item.subCategoryID}
              className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              {/* Left Side */}
              <div className="flex items-center gap-3">
                <div className="w-2 h-10 bg-blue-500 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800">
                    {item.subCategoryName}
                  </span>
                  <span className="text-sm text-gray-500">
                    Store: {item.categoryName}
                  </span>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchData(item.subCategoryID)}
                  className="p-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                >
                  <Pencil />
                </button>

                <button
                  onClick={() => {
                    setID(item.subCategoryID);
                    setDelete(true);
                    SubCatList(SubCategoryList);
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
