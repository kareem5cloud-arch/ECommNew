"use client";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import { useEffect, useState } from "react";
import FurtherSubCategoryAddForm from "./AddFurtherSubCategoryForm";
import GetFurtherSubCategoryList from "./GetFurtherSubCategory";
import CategoryGetApi from "@/app/api/Controller/PurchaserLogin/Codes/Category/CategoryGet";
import {
  CategoryList,
  ResponseCategory,
} from "@/app/api/Types/PurchaserLogin/Codes/Category/Category";
import {
  ResponseSubCategory,
  subCategoryList,
} from "@/app/api/Types/PurchaserLogin/Codes/SubCategory/SubCategory";
import CategorySubGetApi from "@/app/api/Controller/PurchaserLogin/Codes/SubCategory/GetSubCategory";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import DeleteComponent from "@/app/ui/UseFulLComponent/DeleteComponent/DeleteComponent";
import StoreSellerGetApi from "@/app/api/Controller/AdminController/Store/GetStoreSeller";
import {
  ResponseGetStore,
  storeList,
} from "@/app/api/Types/AdminSetting/Store/Store";
import { furtherSubCategoryList } from "@/app/api/Types/PurchaserLogin/Codes/FurtherCategory/FurtherCategory";

export default function FurtherSubCategoryMain() {
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [CategoryList, setCategoryList] = useState<CategoryList[]>([]);
  const [StoreList, setStoreList] = useState<storeList[]>([]);
  const [FurtherSubCategoryList, setFurtherSubCategoryList] = useState<
    furtherSubCategoryList[]
  >([]);
  const [FurtherSubCategoryListModify, setFurtherSubCategoryListModify] =
    useState<furtherSubCategoryList>();

  const CategoryGet = async () => {
    const token = localStorage.getItem("PurchaserLoginToken");
    const response = await CategoryGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as ResponseCategory;
      setCategoryList(data.categoryList);
    } else {
      setCategoryList([]);
    }
  };
  const getStores = async () => {
    const token = localStorage.getItem("PurchaserLoginToken");
    const response = await StoreSellerGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as ResponseGetStore;
      setStoreList(data.storeList);
    } else {
      setStoreList([]);
    }
  };
  useEffect(() => {
    CategoryGet();
    getStores();
  }, []);

  const DeleteFurther = (ID: string) => {};
  return (
    <>
      {showMessage && (
        <MessagePopUp
          message={showMessage}
          type={messageType}
          duration={3000}
          onClose={() => setShowMessage(null)}
        />
      )}
      {Delete && (
        <DeleteComponent
          onCancel={() => {
            setDelete(false);
            setID("");
          }}
          onConfirm={() => DeleteFurther(ID)}
        />
      )}
      <div>
        <ShowAddFile
          update={setUpdate}
          setView={setView}
          view={view}
          setlistView={() => {}}
        />
        <div className="flex justify-between items-center mt-6 mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Further Sub-Category Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <>
              <FurtherSubCategoryAddForm
                update={update}
                storeList={StoreList}
                categoryList={CategoryList}
                initalData={FurtherSubCategoryListModify}
                onShowMessage={(msg, type) => {
                  setShowMessage(msg);
                  setMessageType(type);
                  if (type === "success") {
                    setView("list");
                  }
                }}
              />
            </>
          )}
          {view === "list" && (
            <>
              <GetFurtherSubCategoryList
                storeList={StoreList}
                categoryList={CategoryList}
                setDelete={setDelete}
                update={setUpdate}
                setID={setID}
                FurtherCategoryModifyList={(till) => {
                  setFurtherSubCategoryListModify(till);
                  setView("form");
                }}
                FurtherCatList={setFurtherSubCategoryList}
                FurtherCategoryNewList={FurtherSubCategoryList}
                onShowMessage={(msg, type) => {
                  setShowMessage(msg);
                  setMessageType(type);
                  if (type === "success") {
                    setView("list");
                  }
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
