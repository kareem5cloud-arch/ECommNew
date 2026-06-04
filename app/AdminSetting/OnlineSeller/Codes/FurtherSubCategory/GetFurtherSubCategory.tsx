import FurtherGetApi from "@/app/api/Controller/OnlineSellerController/FurtherSubCategory/GetFurtherCategory";
import CategorySubGetApi from "@/app/api/Controller/OnlineSellerController/SubCategory/GetSubCategory";
import { storeList } from "@/app/api/Types/AdminSetting/Store/Store";
import { CategoryList } from "@/app/api/Types/OnlineSetting/Category/Category";
import {
  furtherSubCategoryList,
  RespopnseFurtherListGet,
} from "@/app/api/Types/OnlineSetting/FurtherCategory/FurtherCategory";
import {
  ResponseSubCategory,
  subCategoryList,
} from "@/app/api/Types/OnlineSetting/SubCategory/SubCategory";
import { unitList } from "@/app/api/Types/OnlineSetting/Unit/Unit";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  categoryList: CategoryList[];
  storeList: storeList[];
  setDelete: (data: boolean) => void;
  update: (data: boolean) => void;
  setID: (data: string) => void;
  FurtherCatList: (data: furtherSubCategoryList[]) => void;
  FurtherCategoryNewList: furtherSubCategoryList[];
  FurtherCategoryModifyList: (data: furtherSubCategoryList) => void;
  onShowMessage: (message: string, type: "success" | "error") => void;
}
export default function GetFurtherSubCategoryList({
  categoryList,
  update,
  storeList,
  setDelete,
  setID,
  FurtherCatList,
  FurtherCategoryModifyList,
  FurtherCategoryNewList,
  onShowMessage,
}: propsForAddRegion) {
  const [SubCategoryName, setSubCategoryName] = useState("");
  const [SubCategoryID, setSubCategoryID] = useState("");
  const [CategoryID, setCategoryID] = useState("");
  const [CategoryName, setCategoryName] = useState("");
  const [SubCategoryList, setSubCategoryList] = useState<subCategoryList[]>([]);
  const [FurtherSubCategoryList, setFurtherSubCategoryList] = useState<
    furtherSubCategoryList[]
  >([]);
  const [StoreName, setStoreName] = useState("");
  const [StoreID, setStoreID] = useState("");
  const [unitID, setUnitID] = useState("");
  const [unitName, setUnitName] = useState("");
  const [unitList, setUnitList] = useState<unitList[]>([]);
  const [isloading, setisLoading] = useState(false);

  useEffect(() => {
    if (CategoryID) {
      SubCategoryGet(CategoryID);
    }
  }, [CategoryID]);

  const SubCategoryGet = async (ID: string) => {
    const token = localStorage.getItem("OnlineSellerToken");
    const response = await CategorySubGetApi(ID, String(token));
    if (response.status == 200) {
      const data = response.data as ResponseSubCategory;
      setSubCategoryList(data.subCategoryList);
    } else {
      setSubCategoryList([]);
    }
  };

  const CategoryGet = async (ID: string) => {
    try {
      setisLoading(true);

      const token = localStorage.getItem("OnlineSellerToken");
      const response = await FurtherGetApi(ID, String(token));
      if (response.status == 200) {
        const data = response.data as RespopnseFurtherListGet;
        setFurtherSubCategoryList(data.furtherSubCategoryList);
      } else {
        setFurtherSubCategoryList([]);
      }
    } finally {
      setisLoading(false);
    }
  };
  const fetchData = (ID: string) => {
    const data = FurtherSubCategoryList.find(
      (item) => item.subCategoryDetailID === ID,
    );
    if (data) {
      FurtherCategoryModifyList(data);
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
      <div className="mb-2">
        <DropDownList
          label="SubCategory "
          placeholder="Enter SubCategory"
          required={true}
          filedID={setSubCategoryID}
          value={SubCategoryName}
          onChange={setSubCategoryName}
          options={SubCategoryList.map((item) => ({
            label: item.subCategoryName,
            value: item.subCategoryName,
            id: item.subCategoryID,
          }))}
        />
      </div>
      <div className="flex justify-end">
        <ActionButton
          text="Search"
          update={false}
          loading={false}
          loadingtext="Fetching..."
          onClick={() => CategoryGet(SubCategoryID)}
          disabled={false}
        />
      </div>
      {/* <div className="mb-2">
        <DropDownList
          label="Store "
          placeholder="Enter Store"
          required={true}
          filedID={setStoreID}
          value={StoreName}
          onChange={setStoreName}
          options={storeList.map((item) => ({
            label: item.storeName,
            value: item.storeName,
            id: item.storeID,
          }))}
        />
      </div> */}
      <div className="space-y-4">
        {isloading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : FurtherSubCategoryList.length === 0 ? (
          <div className="flex justify-center py-10">
            <span className="text-lg font-semibold text-gray-500">
              No Record Found
            </span>
          </div>
        ) : (
          FurtherSubCategoryList.map((item) => (
            <div
              key={item.subCategoryDetailID}
              className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              {/* Left Side */}
              <div className="flex items-center gap-3">
                <div className="w-2 h-10 bg-blue-500 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    Unit:
                    {item.unitListSub.map((unit, index) => (
                      <span key={unit.unitID}>
                        {index > 0 && " | "} {unit.unitName}
                      </span>
                    ))}
                  </span>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchData(item.subCategoryDetailID)}
                  className="p-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                >
                  <Pencil />
                </button>

                <button
                  onClick={() => {
                    setID(item.subCategoryDetailID);
                    setDelete(true);
                    FurtherCatList(FurtherSubCategoryList);
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
