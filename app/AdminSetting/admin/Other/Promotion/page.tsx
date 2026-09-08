"use client";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import { useState } from "react";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import DeleteComponent from "@/app/ui/UseFulLComponent/DeleteComponent/DeleteComponent";
import DelievryStandardDeleteApi from "@/app/api/Controller/AdminController/Shipment/DelievryStandard/DeleteStandard";
import { DelievryDataStandard } from "@/app/api/Types/Shipment/DelievryStandard";
import AddPromotion from "./AddPromotion";
import { RequestModifyPromotion } from "@/app/api/Types/AdminSetting/Promotion/Promotion";
import GetPromotionList from "./GetPromotion";

export default function PromotionManagement() {
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [delievryStadnard, setDeleivryStadnard] = useState<
    RequestModifyPromotion[]
  >([]);
  const [delievryStadnardModify, setDelievryStadnardModify] =
    useState<RequestModifyPromotion>();

  const resetValue = () => {
    setDelievryStadnardModify(undefined);
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
          onConfirm={() => {}}
        />
      )}
      <div>
        <ShowAddFile
          update={setUpdate}
          setlistView={resetValue}
          setView={setView}
          view={view}
        />
        <div className="flex justify-between items-center mt-6 mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Promotion Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <>
              <AddPromotion
                update={update}
                initalData={delievryStadnardModify}
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
              <GetPromotionList
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
                standardListNewRecord={delievryStadnard}
                standardListRecord={setDeleivryStadnard}
                standardModifyListRecord={(till) => {
                  setDelievryStadnardModify(till);
                  setView("form");
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
