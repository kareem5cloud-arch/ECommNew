"use client";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import { useEffect, useState } from "react";
import SubCategoryAddForm from "./SubCategoryAddForm";
import GetSubCategoryList from "./GetSubCategoryList";
import CategoryGetApi from "@/app/api/Controller/OnlineSellerController/Category/CategoryGet";
import {
  CategoryList,
  ResponseCategory,
} from "@/app/api/Types/OnlineSetting/Category/Category";
import { subCategoryList } from "@/app/api/Types/OnlineSetting/SubCategory/SubCategory";
import SubCategoryDelete from "@/app/api/Controller/OnlineSellerController/SubCategory/DeleteSubCategory";
import DeleteComponent from "@/app/ui/UseFulLComponent/DeleteComponent/DeleteComponent";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";

// import AddOnlineLogin from "./AddLogin";
// import GetLoginList from "./GetLoginList";

export default function SubCategoryMain() {
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);

  const [CategoryList, setCategoryList] = useState<CategoryList[]>([]);
  const [SubCategoryList, setSubCategoryList] = useState<subCategoryList[]>([]);
  const [SubCategoryListModify, setSubCategoryListModify] =
    useState<subCategoryList>();

  const CategoryGet = async () => {
    const token = localStorage.getItem("OnlineSellerToken");
    const response = await CategoryGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as ResponseCategory;
      setCategoryList(data.categoryList);
    } else {
      setCategoryList([]);
    }
  };
  const DeleteRegion = async (ID: string) => {
    const token = localStorage.getItem("OnlineSellerToken");
    const response = await SubCategoryDelete(ID, String(token));
    if (response.status == 200) {
      const data = SubCategoryList.filter((item) => item.subCategoryID !== ID);
      setSubCategoryList(data);
      setDelete(false);
    } else {
      setSubCategoryList(SubCategoryList);
    }
  };

  useEffect(() => {
    CategoryGet();
  }, []);
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
          onConfirm={() => DeleteRegion(ID)}
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
            Sub-Category Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <>
              <SubCategoryAddForm
                categoryList={CategoryList}
                update={update}
                initalData={SubCategoryListModify}
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
              <GetSubCategoryList
                setDelete={setDelete}
                categoryList={CategoryList}
                update={setUpdate}
                setID={setID}
                SubCategoryModifyList={(till) => {
                  setSubCategoryListModify(till);
                  setView("form");
                }}
                SubCatList={setSubCategoryList}
                SubCategoryNewList={SubCategoryList}
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
