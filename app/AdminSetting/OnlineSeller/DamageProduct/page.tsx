"use client";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import { useState } from "react";
import AddDamageProduct from "./AddDamageProduct";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import GetDamageProductList from "./GetDamageProduct";
import { DamageList } from "@/app/api/Types/OnlineSeller/DamageProduct/DamageProduct";

export default function DamagedProduct() {
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [DamageList, setDamageList] = useState<DamageList>();
  const resetFunction = () => {
    setDamageList(undefined);
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
      <div>
        <ShowAddFile
          update={setUpdate}
          setlistView={() => resetFunction()}
          setView={setView}
          view={view}
        />
        <div className="flex justify-between items-center mt-6 mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Damage-Product Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <AddDamageProduct
              update={update}
              initalData={DamageList}
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
            <GetDamageProductList
              update={setUpdate}
              setDamageList={(till) => {
                setDamageList(till);
                setView("form");
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
