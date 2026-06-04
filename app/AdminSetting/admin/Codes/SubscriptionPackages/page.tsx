"use client";
import PackagesDelete from "@/app/api/Controller/AdminController/Packages/DeletePackage";
import { SubscriptionList } from "@/app/api/Types/AdminSetting/Packages/Packages";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import DeleteComponent from "@/app/ui/UseFulLComponent/DeleteComponent/DeleteComponent";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import { useEffect, useState } from "react";
import AddSubscriptionPackagesForm from "./AddSubscriptionPackagesForm";
import GetSubscrioptionList from "./GetSubscriptionpakcageForm";

export default function CourierServiceManagement() {
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);

  const [CouriereService, setCouriereService] = useState<SubscriptionList[]>(
    [],
  );
  const [CouriereServiceModify, setCouriereServiceModify] =
    useState<SubscriptionList>();

  const DeleteCouriere = async (ID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await PackagesDelete(ID, String(token));
    if (response.status == 200) {
      const data = CouriereService.filter((item) => item.subID !== ID);
      if (data) {
        setCouriereService(data);
        setDelete(false);
      }
    } else {
      setCouriereService(CouriereService);
    }
  };

  const resetValue = () => {};

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
          setlistView={resetValue}
          setView={setView}
          view={view}
        />
        <div className="flex justify-between items-center mt-6 mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Subscription Packages
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <>
              <AddSubscriptionPackagesForm
                update={update}
                initalData={CouriereServiceModify}
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
              <GetSubscrioptionList
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
                standardListNewRecord={CouriereService}
                standardListRecord={setCouriereService}
                standardModifyListRecord={(till) => {
                  setCouriereServiceModify(till);
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
