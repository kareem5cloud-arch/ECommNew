"use client";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import DeleteComponent from "@/app/ui/UseFulLComponent/DeleteComponent/DeleteComponent";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import { useEffect, useState } from "react";
import GetCourierListLedger from "./GetCourierListLedger";
import {
  courierList,
  responseCourierService,
} from "@/app/api/Types/AdminSetting/CourierService/CourierService";
import CourierServiceGet from "@/app/api/Controller/AdminController/CourierService/GetCourier";
import AddCourierLedger from "./AddCourerLedger";

export default function CourierLedger() {
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [courierServiceList, setCourierServiceList] = useState<courierList[]>(
    [],
  );

  const Standardget = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await CourierServiceGet(String(token));
    if (response.status == 200) {
      const data = response.data as responseCourierService;
      setCourierServiceList(data.courierList);
    } else {
      setCourierServiceList([]);
    }
  };
  useEffect(() => {
    Standardget();
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
            Courier-Ledger Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <AddCourierLedger
              courierServiceList={courierServiceList}
              // update={update}
              // standardListGet={delievryStadnard}
              // initalData={CouriereServiceModify}
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
            <GetCourierListLedger courierServiceList={courierServiceList} />
          )}
        </div>
      </div>
    </>
  );
}
