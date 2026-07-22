"use client";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import { useEffect, useState } from "react";

import DeleteComponent from "@/app/ui/UseFulLComponent/DeleteComponent/DeleteComponent";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import { CategoryList } from "@/app/api/Types/OnlineSetting/Category/Category";
import CategoryDelete from "@/app/api/Controller/OnlineSellerController/Category/CategoryDelete";
import StoreSellerGetApi from "@/app/api/Controller/AdminController/Store/GetStoreSeller";
import {
  ResponseGetStore,
  storeList,
} from "@/app/api/Types/AdminSetting/Store/Store";

// import AddOnlineLogin from "./AddLogin";
// import GetLoginList from "./GetLoginList";

export default function CategoryMain() {
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [StoreList, setStoreList] = useState<storeList[]>([]);

  const getStores = async () => {
    const token = localStorage.getItem("OfflineSellerToken");
    const response = await StoreSellerGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as ResponseGetStore;
      setStoreList(data.storeList);
    } else {
      setStoreList([]);
    }
  };

  useEffect(() => {
    getStores();
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
          onConfirm={() => {}}
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
            Till Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {/* {view === "form" && (
            <>
              <AddTillform storeList={StoreList} />
            </>
          )} */}
          {view === "list" && <></>}
        </div>
      </div>
    </>
  );
}
