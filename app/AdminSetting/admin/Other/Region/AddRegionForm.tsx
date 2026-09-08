"use client";

import RegionAddApi from "@/app/api/Controller/AdminController/Shipment/Region/RegionAdd";
import RegionModifyApi from "@/app/api/Controller/AdminController/Shipment/Region/RegionModify";
import { countryList } from "@/app/api/Types/Shipment/Country";
import { regionlist } from "@/app/api/Types/Shipment/Region";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  update: boolean;
  initalData?: regionlist;
  onShowMessage: (message: string, type: "success" | "error") => void;
  countryData: countryList[];
}
export default function AddRegionForm({
  countryData,
  onShowMessage,
  initalData,
  update,
}: propsForAddRegion) {
  const [regionName, setRegionName] = useState("");
  const [countryID, setCountryID] = useState("");
  const [countryName, setCountryName] = useState("");
  const [description, setDescription] = useState("");
  const [ID, setID] = useState("");
  const [loading, setLoading] = useState(false);

  const RegionAdd = async () => {
    try {
      setLoading(true);
      if (!countryID || !regionName)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          regionName: regionName,
          countryID: countryID,
        };
        const token = localStorage.getItem("adminToken");
        const response = await RegionAddApi(formData, String(token));
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

  const RegionModify = async () => {
    try {
      setLoading(true);
      if (!countryID || !regionName || !ID)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          regionName: regionName,
          countryID: countryID,
          regionID: ID,
        };
        const token = localStorage.getItem("adminToken");
        const response = await RegionModifyApi(formData, String(token));
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
    if (update) {
      if (initalData) {
        setCountryID(initalData.countryID);
        setCountryName(initalData.countryName);
        setRegionName(initalData.regionName);
        setID(initalData.regionID);
      }
    } else {
      setCountryID("");
      setCountryName("");
      setRegionName("");
      setID("");
    }
  }, [initalData, update]);
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
          <InputFieldGeneric
            label="Region Name"
            type="text"
            required={false}
            placeholder="Enter Region Name"
            SateChange={regionName}
            setSateChange={setRegionName}
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
                onClick={() => RegionModify()}
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
                onClick={() => RegionAdd()}
                disabled={false}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
