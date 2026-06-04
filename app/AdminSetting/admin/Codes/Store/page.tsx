"use client";

import { useEffect, useState } from "react";
import AddStoreForm from "./StoreAddForm";
import GetStoreList from "./GetStoreList";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import GetCountryApi from "@/app/api/Controller/AdminController/Shipment/Country/CountryGet";
import {
  countryList,
  GetCountryListResponse,
} from "@/app/api/Types/Shipment/Country";
import { storeList } from "@/app/api/Types/AdminSetting/Store/Store";
import StoreDeleteApi from "@/app/api/Controller/AdminController/Store/DeleteStore";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import DeleteComponent from "@/app/ui/UseFulLComponent/DeleteComponent/DeleteComponent";

export default function StoreManagement() {
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [countryData, setCountryData] = useState<countryList[]>([]);
  const [StoreList, setStoreList] = useState<storeList[]>([]);

  const getCountries = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetCountryApi(String(token));
    if (response.status === 200) {
      const data = response.data as GetCountryListResponse;
      setCountryData(data.countryList);
    } else {
      setCountryData([]);
    }
  };

  const DeleteCouriere = async (ID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await StoreDeleteApi(ID, String(token));
    if (response.status == 200) {
      const data = StoreList.filter((item) => item.storeID !== ID);
      if (data) {
        setStoreList(data);
        setDelete(false);
      }
    } else {
      setStoreList(StoreList);
    }
  };

  useEffect(() => {
    getCountries();
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
          onConfirm={() => DeleteCouriere(ID)}
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
            Store Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <>
              <AddStoreForm
                countryListData={countryData}
                update={update}
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
              <GetStoreList
                setDelete={setDelete}
                update={setUpdate}
                setID={setID}
                onShowMessage={(msg, type) => {
                  setShowMessage(msg);
                  setMessageType(type);
                  if (type === "success") {
                    setView("list");
                  }
                }}
                standardListNewRecord={StoreList}
                standardListRecord={setStoreList}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
