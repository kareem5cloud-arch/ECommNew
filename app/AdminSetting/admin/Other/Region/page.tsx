"use client";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import { useEffect, useState } from "react";
import AddRegionForm from "./AddRegionForm";
import GetRegionList from "./GetRegionForm";
import GetCountryApi from "@/app/api/Controller/AdminController/Shipment/Country/CountryGet";
import {
  countryList,
  GetCountryListResponse,
} from "@/app/api/Types/Shipment/Country";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import DeleteComponent from "@/app/ui/UseFulLComponent/DeleteComponent/DeleteComponent";
import RegionDeleteApi from "@/app/api/Controller/AdminController/Shipment/Region/DeleteRegion";
import { regionlist } from "@/app/api/Types/Shipment/Region";

export default function RegionManagement() {
  const [view, setView] = useState<"list" | "form">("list");
  const [countryData, setCountryData] = useState<countryList[]>([]);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [ID, setID] = useState("");
  const [Update, setUpdate] = useState(false);
  const [Delete, setDelete] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [regionList, setRegionList] = useState<regionlist[]>([]);
  const [regionModifyList, setregionModifyList] = useState<regionlist>();

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

  const DeleteRegion = async (ID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await RegionDeleteApi(ID, String(token));
    if (response.status == 200) {
      const data = regionList.filter((item) => item.regionID !== ID);
      setRegionList(data);
      setDelete(false);
    } else {
      setRegionList(regionList);
    }
  };

  const resetValue = () => {
    setregionModifyList(undefined);
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
          setlistView={resetValue}
          setView={setView}
          view={view}
        />
        <div className="flex justify-between items-center mt-6 mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Region Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <>
              <AddRegionForm
                countryData={countryData}
                update={Update}
                initalData={regionModifyList}
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
              <GetRegionList
                countryData={countryData}
                setDelete={setDelete}
                update={setUpdate}
                setID={setID}
                RegionModifyList={(till) => {
                  setregionModifyList(till);
                  setView("form");
                }}
                RegionList={setRegionList}
                RegionnewList={regionList}
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
