"use client";
import RegionGetApi from "@/app/api/Controller/AdminController/Shipment/Region/RegionGet";
import ZoneAddApi from "@/app/api/Controller/AdminController/Shipment/Zone/ZoneAdd";
import ZoneModifyApi from "@/app/api/Controller/AdminController/Shipment/Zone/ZoneModify";
import { countryList } from "@/app/api/Types/Shipment/Country";
import {
  RegionGetListResposne,
  regionlist,
} from "@/app/api/Types/Shipment/Region";
import { zonelist } from "@/app/api/Types/Shipment/Zone";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  update: boolean;
  countryData: countryList[];
  initalData?: zonelist;
  onShowMessage: (message: string, type: "success" | "error") => void;
}
export default function AddZoneForm({
  update,
  countryData,
  initalData,
  onShowMessage,
}: propsForAddRegion) {
  const [ZoneName, setZoneName] = useState("");
  const [optionList, setOptionList] = useState<countryList[]>([]);
  const [countryID, setCountryID] = useState("");
  const [countryName, setCountryName] = useState("");
  const [regionName, setRegionName] = useState("");
  const [RegionID, setRegionID] = useState("");
  const [ID, setID] = useState("");
  const [description, setDescription] = useState("");
  const [regionList, setRegionList] = useState<regionlist[]>([]);
  const [loading, setLoading] = useState(false);

  const RegionGet = async () => {
    if (!countryID) return;
    else {
      const token = localStorage.getItem("adminToken");
      const response = await RegionGetApi(countryID, String(token));
      if (response.status == 200) {
        const data = response.data as RegionGetListResposne;
        setRegionList(data.regionlist);
      } else {
        setRegionList([]);
      }
    }
  };

  const ZoneAdd = async () => {
    try {
      setLoading(true);
      if (!countryID || !RegionID || !ZoneName)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          regionID: RegionID,
          zoneName: ZoneName,
        };
        const token = localStorage.getItem("adminToken");
        const response = await ZoneAddApi(formData, String(token));
        if (response.status == 200) {
          onShowMessage(response.data.message, "success");
        } else {
          onShowMessage(response.data.message, "error");
        }
      }
    } finally {
      setLoading(false);
    }
  };
  const ZoneModify = async () => {
    try {
      setLoading(true);
      if (!ID || !countryID || !RegionID || !ZoneName)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          zoneID: ID,
          regionID: RegionID,
          zoneName: ZoneName,
        };
        const token = localStorage.getItem("adminToken");
        const response = await ZoneModifyApi(formData, String(token));
        if (response.status == 200) {
          onShowMessage(response.data.message, "success");
        } else {
          onShowMessage(response.data.message, "error");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRegion = async () => {
      if (update && initalData) {
        setCountryID(initalData.countryID);
        setCountryName(initalData.countryName);

        if (initalData.countryID) {
          await RegionGet();
        }

        setRegionName(initalData.regionName);
        setRegionID(initalData.regionID);
        setID(initalData.zoneID);
        setZoneName(initalData.zoneName);
      } else {
        setCountryID("");
        setCountryName("");
        setRegionName("");
        setRegionID("");
        setID("");
        setZoneName("");
      }
    };

    fetchRegion();
  }, [initalData, update]);

  useEffect(() => {
    if (countryID) {
      RegionGet();
    }
  }, [countryID]);

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <DropDownList
            label="Country "
            placeholder="Enter Country"
            required={true}
            value={countryName}
            onChange={setCountryName}
            filedID={setCountryID}
            options={countryData.map((item) => ({
              label: item.countryName,
              value: item.countryName,
              id: item.countryID,
            }))}
          />
          <DropDownList
            label="Region"
            placeholder="Enter Region "
            required={true}
            value={regionName}
            onChange={setRegionName}
            filedID={setRegionID}
            options={regionList.map((item) => ({
              label: item.regionName,
              value: item.regionName,
              id: item.regionID,
            }))}
          />
          <InputFieldGeneric
            label="Zone Name"
            type="text"
            required={false}
            placeholder="Enter Zone Name"
            SateChange={ZoneName}
            setSateChange={setZoneName}
            disabled={false}
          />
          <TextAreaFieldGeneric
            label="Description"
            required={false}
            placeholder="Enter Description"
            SateChange={description}
            setSateChange={setDescription}
            disabled={false}
          />

          {update ? (
            <div className="flex justify-end">
              <ActionButton
                text="Update"
                update={false}
                loading={loading}
                loadingtext="Updateing..."
                onClick={() => ZoneModify()}
                disabled={false}
              />
            </div>
          ) : (
            <div className="flex justify-end">
              <ActionButton
                text="Save"
                update={false}
                loading={loading}
                loadingtext="Saving..."
                onClick={() => ZoneAdd()}
                disabled={false}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
