"use client";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import { useEffect, useState } from "react";
import AddUnitForm from "./AddUnitForm";
import {
  ResponseGetStore,
  storeList,
} from "@/app/api/Types/AdminSetting/Store/Store";
import StoreSellerGetApi from "@/app/api/Controller/AdminController/Store/GetStoreSeller";
import { unitList } from "@/app/api/Types/OnlineSetting/Unit/Unit";
import GetUnitList from "./GetUnitList";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import DeleteComponent from "@/app/ui/UseFulLComponent/DeleteComponent/DeleteComponent";
import UnitDeleteApi from "@/app/api/Controller/OnlineSellerController/Unit/DeleteUnit";

export default function UnitManagement() {
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [StoreList, setStoreList] = useState<storeList[]>([]);
  const [UnitList, setUnitList] = useState<unitList[]>([]);
  const [UnitModifyList, setUnitModifyList] = useState<unitList>();

  const getStores = async () => {
    const token = localStorage.getItem("OnlineSellerToken");
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
  const DeleteRegion = async (ID: string) => {
    const token = localStorage.getItem("OnlineSellerToken");
    const response = await UnitDeleteApi(ID, String(token));
    if (response.status == 200) {
      const data = UnitList.filter((item) => item.unitID !== ID);
      setUnitList(data);
      setDelete(false);
    } else {
      setUnitList(UnitList);
    }
  };
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
            Unit Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <>
              <AddUnitForm
                storeList={StoreList}
                update={update}
                initalData={UnitModifyList}
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
              <GetUnitList
                storeList={StoreList}
                setDelete={setDelete}
                update={setUpdate}
                setID={setID}
                UnitModifyList={(till) => {
                  setUnitModifyList(till);
                  setView("form");
                }}
                unitDataList={setUnitList}
                UnitDataListReturn={UnitList}
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
