"use client";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import { useEffect, useState } from "react";
import AddCourierServiceForm from "./AddCourierServiceForm";
import {
  DelievryDataStandard,
  ResponpseDelievryStandard,
} from "@/app/api/Types/Shipment/DelievryStandard";
import DelievryStandardGetApi from "@/app/api/Controller/AdminController/Shipment/DelievryStandard/GetStandard";
import { courierList } from "@/app/api/Types/AdminSetting/CourierService/CourierService";
import CourierServiceDelete from "@/app/api/Controller/AdminController/CourierService/DeleteCourier";
import DeleteComponent from "@/app/ui/UseFulLComponent/DeleteComponent/DeleteComponent";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import GetCourierList from "./GetCourierServiceList";

export default function CourierServiceManagement() {
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);

  const [CouriereServiceModify, setCouriereServiceModify] =
    useState<courierList>();
  const [CouriereService, setCouriereService] = useState<courierList[]>([]);
  const [delievryStadnard, setDeleivryStadnard] = useState<
    DelievryDataStandard[]
  >([]);

  const Standardget = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await DelievryStandardGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as ResponpseDelievryStandard;
      setDeleivryStadnard(data.delievryData);
    } else {
      setDeleivryStadnard([]);
    }
  };

  const DeleteCouriere = async (ID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await CourierServiceDelete(ID, String(token));
    if (response.status == 200) {
      const data = CouriereService.filter((item) => item.courierID !== ID);
      if (data) {
        setCouriereService(data);
        setDelete(false);
      }
    } else {
      setCouriereService(CouriereService);
    }
  };

  useEffect(() => {
    Standardget();
  }, []);

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
            Courier Service
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <>
              <AddCourierServiceForm
                update={update}
                standardListGet={delievryStadnard}
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
              <GetCourierList
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
