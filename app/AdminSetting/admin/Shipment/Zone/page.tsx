"use client";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import { useEffect, useState } from "react";
import AddZoneForm from "./AddZoneForm";
import GetZoneList from "./GetZoneList";
import GetCountryApi from "@/app/api/Controller/AdminController/Shipment/Country/CountryGet";
import {
  countryList,
  GetCountryListResponse,
} from "@/app/api/Types/Shipment/Country";
import { zonelist } from "@/app/api/Types/Shipment/Zone";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import DeleteComponent from "@/app/ui/UseFulLComponent/DeleteComponent/DeleteComponent";
import ZoneDeleteApi from "@/app/api/Controller/AdminController/Shipment/Zone/ZoneDelete";

export default function ZoneManagement() {
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [update, setUpdate] = useState(false);
  const [ZoneList, setZoneList] = useState<zonelist[]>([]);
  const [countryData, setCountryData] = useState<countryList[]>([]);
  const [view, setView] = useState<"list" | "form">("list");
  const [ZoneModifyList, setZoneModifyList] = useState<zonelist>();

  const resetValue = () => {
    setZoneModifyList(undefined);
  };

  const getCountries = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetCountryApi(String(token));
    if (response.status === 200) {
      const data = response.data as GetCountryListResponse;
      setCountryData(data.countryList);
    } else {
      setCountryData([]);
    }
  };
  useEffect(() => {
    getCountries();
  }, []);

  const DeleteZone = async (ID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await ZoneDeleteApi(ID, String(token));
    if (response.status == 200) {
      const data = ZoneList.filter((item) => item.zoneID !== ID);
      if (data) {
        setZoneList(data);
        setDelete(false);
      }
    } else {
      setZoneList(ZoneList);
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
          onConfirm={() => DeleteZone(ID)}
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
            Zone Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <>
              <AddZoneForm
                countryData={countryData}
                update={update}
                initalData={ZoneModifyList}
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
              <GetZoneList
                countryData={countryData}
                setDelete={setDelete}
                update={setUpdate}
                setID={setID}
                zoneModifyListRecord={(till) => {
                  setZoneModifyList(till);
                  setView("form");
                }}
                zoneListRecord={setZoneList}
                zoneListnewRecord={ZoneList}
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
        </div>
      </div>
    </>
  );
}
