"use client";
import StoreGetApi from "@/app/api/Controller/AdminController/Store/GetStore";
import {
  ResponseGetStore,
  storeList,
} from "@/app/api/Types/AdminSetting/Store/Store";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import { useEffect, useState } from "react";
import AddStoreDefaultSetting from "./AddStoreDefaultSetting";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";

export default function StoreDefaultSetting() {
  const [view, setView] = useState<"list" | "form">("list");

  const [ID, setID] = useState("");
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

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
      <div className="flex justify-between items-center mt-6 mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Store-Default Setting
        </h1>
      </div>
      <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
        <AddStoreDefaultSetting
          onShowMessage={(msg, type) => {
            setShowMessage(msg);
            setMessageType(type);
            if (type === "success") {
              setView("list");
            }
          }}
        />
      </div>
    </>
  );
}
