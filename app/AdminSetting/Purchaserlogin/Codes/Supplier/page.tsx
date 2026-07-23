"use client";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import DeleteComponent from "@/app/ui/UseFulLComponent/DeleteComponent/DeleteComponent";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import { useState } from "react";
import AddSupplierForm from "./AddSupplier";
import GetSupplierList from "./GetSupplierList";
import { SupplierListReponse } from "@/app/api/Types/PurchaserLogin/Supplier/supplier";

export default function Customer() {
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [CategoryModifyList, setCategoryModifyList] =
    useState<SupplierListReponse>();
  const [CatList, setCatList] = useState<SupplierListReponse[]>([]);
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
            Supplier Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <AddSupplierForm
              update={update}
              onShowMessage={(msg, type) => {
                setShowMessage(msg);
                setMessageType(type);
                if (type === "success") {
                  setView("list");
                }
              }}
              initalData={CategoryModifyList}
            />
          )}
          {view === "list" && (
            <GetSupplierList
              setDelete={setDelete}
              update={setUpdate}
              setID={setID}
              CategoryModifyList={(till) => {
                setCategoryModifyList(till);
                setView("form");
              }}
              CatList={setCatList}
              CategoryNewList={CatList}
            />
          )}
        </div>
      </div>
    </>
  );
}
