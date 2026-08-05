"use client";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import DeleteComponent from "@/app/ui/UseFulLComponent/DeleteComponent/DeleteComponent";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import { useState } from "react";
import PurchaseAddForm from "./PurchaseAddForm";
import { GetPurchaseList } from "@/app/api/Types/PurchaserLogin/Purchase/Purchase";
import GetPurchaseListForm from "./GetPurchaseList";
import PurchaseDeleteApi from "@/app/api/Controller/PurchaserLogin/Purchase/DeletePurcahse";

export default function PurchaseModule() {
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [CatList, setCatList] = useState<GetPurchaseList[]>([]);
  const [CategoryModifyList, setCategoryModifyList] =
    useState<GetPurchaseList>();

  const DeleteRegion = async (ID: string) => {
    const token = localStorage.getItem("PurchaserLoginToken");
    const response = await PurchaseDeleteApi(ID, String(token));
    if (response.status == 200) {
      const data = CatList.filter((item) => item.ledgerID !== ID);
      setCatList(data);
      setDelete(false);
    } else {
      setCatList(CatList);
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
            Purchase Management
          </h1>
        </div>
        <div className="rounded-3xl bg-gray-50 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <PurchaseAddForm
              update={update}
              initalData={CategoryModifyList}
              onShowMessage={(msg, type) => {
                setShowMessage(msg);
                setMessageType(type);
                if (type === "success") {
                  setView("list");
                }
              }}
            />
          )}
          {view === "list" && (
            <GetPurchaseListForm
              setDelete={setDelete}
              update={setUpdate}
              setID={setID}
              CategoryModifyList={(till) => {
                setCategoryModifyList(till);
                setView("form");
              }}
              CatList={setCatList}
              CategoryNewList={CatList}
              onShowMessage={(msg, type) => {
                setShowMessage(msg);
                setMessageType(type);
                if (type === "success") {
                  setView("list");
                }
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
