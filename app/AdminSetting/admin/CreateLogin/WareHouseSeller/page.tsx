"use client";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import { useEffect, useState } from "react";

import StoreGetApi from "@/app/api/Controller/AdminController/Store/GetStore";
import {
  ResponseGetStore,
  storeList,
} from "@/app/api/Types/AdminSetting/Store/Store";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import { signupList } from "@/app/api/Types/Authentication/SignUpLoginList";
import DeleteSellerApi from "@/app/api/Controller/Authentication/SignupList/DeletSeller/DeleteSeller";
import DeleteComponent from "@/app/ui/UseFulLComponent/DeleteComponent/DeleteComponent";
import AddOnlineLogin from "./AddWareHouseSeller";
import GetLoginList from "./GetWareHouseSeller";

export default function OnlineSeller() {
  const [Delete, setDelete] = useState(false);
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [StoreList, setStoreList] = useState<storeList[]>([]);
  const [ID, setID] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [SignUpList, setSignUpList] = useState<signupList[]>([]);
  const [SignUpListModify, setSignUpListModify] = useState<signupList>();

  const Storeget = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await StoreGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as ResponseGetStore;
      setStoreList(data.storeList);
    } else {
      setStoreList([]);
    }
  };
  useEffect(() => {
    Storeget();
  }, []);

  const DeleteCouriere = async (ID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await DeleteSellerApi(ID, String(token));
    if (response.status == 200) {
      const data = SignUpList.filter((item) => item.sellerID !== ID);
      if (data) {
        setSignUpList(data);
        setDelete(false);
      }
    } else {
      setSignUpList(SignUpList);
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
            WareHouse-Seller Login
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <>
              <AddOnlineLogin
                update={update}
                storeList={StoreList}
                initalData={SignUpListModify}
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
              <GetLoginList
                update={setUpdate}
                setDelete={setDelete}
                setID={setID}
                onShowMessage={(msg, type) => {
                  setShowMessage(msg);
                  setMessageType(type);
                  if (type === "success") {
                    setView("list");
                  }
                }}
                standardModifyListRecord={(till) => {
                  setSignUpListModify(till);
                  setView("form");
                }}
                standardListNewRecord={SignUpList}
                standardListRecord={setSignUpList}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
