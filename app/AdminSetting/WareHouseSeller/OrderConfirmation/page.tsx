"use client";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import { useEffect, useState } from "react";
import ModifyOrderConfirmation from "./ModifyOrderConfirmation";
import StoreSellerGetApi from "@/app/api/Controller/AdminController/Store/GetStoreSeller";
import {
  ResponseGetStore,
  storeList,
} from "@/app/api/Types/AdminSetting/Store/Store";
import { X } from "lucide-react";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import ActionButton from "@/app/ui/ActionButton/ActionButton";

export default function OrderCoinfirmation() {
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [ShowMenu, setShowMenu] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [StoreList, setStoreList] = useState<storeList[]>([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [callFunction, setCallFunction] = useState(0);
  const getStores = async () => {
    const token = localStorage.getItem("WareHouseSellerToken");
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
      {ShowMenu && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                setShowMenu(false);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <TextAreaFieldGeneric
              label="Reason"
              required={false}
              placeholder="Reason For Rejection"
              SateChange={description}
              setSateChange={setDescription}
              disabled={false}
            />
            <div className="flex justify-end mt-2">
              <ActionButton
                text="Reject Order"
                update={false}
                loading={loading}
                loadingtext="Processing..."
                size={true}
                onClick={() => setCallFunction((prev) => prev + 1)}
                disabled={false}
              />
            </div>
          </div>
        </div>
      )}
      <div>
        <div className="flex justify-between items-center mt-6 mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Orders Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          <ModifyOrderConfirmation
            StoreList={StoreList}
            setLoading={setLoading}
            showMenu={setShowMenu}
            setDescription={setDescription}
            setCallFunction={callFunction}
            description={description}
            onShowMessage={(msg, type) => {
              setShowMessage(msg);
              setMessageType(type);
              if (type === "success") {
                setView("list");
              }
            }}
          />
        </div>
      </div>
    </>
  );
}
