"use client";
import RegionGetApi from "@/app/api/Controller/AdminController/Shipment/Region/RegionGet";
import ZoneGetApi from "@/app/api/Controller/AdminController/Shipment/Zone/ZoneGet";
import StoreAddApi from "@/app/api/Controller/AdminController/Store/AddStore";
import { countryList } from "@/app/api/Types/Shipment/Country";
import {
  RegionGetListResposne,
  regionlist,
} from "@/app/api/Types/Shipment/Region";
import { ZoneGetListResposne, zonelist } from "@/app/api/Types/Shipment/Zone";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import GenericCheckbox from "@/app/ui/CheckBox/CheckBox";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { Phone, Store } from "lucide-react";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  update: boolean;
  countryListData: countryList[];
  initalData?: zonelist;
  onShowMessage: (message: string, type: "success" | "error") => void;
}
export default function AddStoreForm({
  update,
  countryListData,
  initalData,
  onShowMessage,
}: propsForAddRegion) {
  const [StoreName, setStoreName] = useState("");
  const [Email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [regionList, setRegionList] = useState<regionlist[]>([]);
  const [zoneList, setzoneList] = useState<zonelist[]>([]);
  const [ZoneID, setZoneID] = useState("");
  const [ZoneName, setZoneName] = useState("");
  const [RegionID, setRegionID] = useState("");
  const [RegionName, setRegionName] = useState("");
  const [countryID, setCountryID] = useState("");
  const [countryName, setCountryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [PhoneNo, setPhoneNo] = useState("");
  const [ReturnThreshold, setReturnThreshold] = useState("");
  const [ID, setID] = useState("");

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
  const ZoneGet = async () => {
    if (!RegionID) return;
    else {
      const token = localStorage.getItem("adminToken");
      const response = await ZoneGetApi(RegionID, String(token));
      if (response.status == 200) {
        const data = response.data as ZoneGetListResposne;
        setzoneList(data.zonelist);
      } else {
        setzoneList([]);
      }
    }
  };

  useEffect(() => {
    if (countryID) {
      RegionGet();
    }
  }, [countryID]);

  useEffect(() => {
    if (RegionID) {
      ZoneGet();
    }
  }, [RegionID]);

  const StoreAdd = async () => {
    try {
      setLoading(true);
      if (
        !StoreName ||
        !ZoneID ||
        !countryID ||
        !RegionID ||
        !Email ||
        !description ||
        !PhoneNo
      )
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          storeName: StoreName,
          logoUrl: "",
          zoneID: ZoneID,
          returnThreshold: Number(ReturnThreshold),
          email: Email,
          phoneNo: PhoneNo,
          defaultStore: checked,
          address: description,
        };
        // console.log(formData);
        const token = localStorage.getItem("adminToken");
        const response = await StoreAddApi(formData, String(token));
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

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <InputFieldGeneric
            label="Store Name"
            type="text"
            required={false}
            placeholder="Enter Store Name"
            SateChange={StoreName}
            setSateChange={setStoreName}
            disabled={false}
          />
          <InputFieldGeneric
            label="Email"
            type="email"
            required={true}
            placeholder="Enter Email"
            SateChange={Email}
            setSateChange={setEmail}
            disabled={false}
          />
          <InputFieldGeneric
            label="Return Threshold"
            type="number"
            required={true}
            placeholder="Enter Return Threshold"
            SateChange={ReturnThreshold}
            setSateChange={setReturnThreshold}
            disabled={false}
          />
          <InputFieldGeneric
            label="PhoneNo"
            type="text"
            required={true}
            placeholder="Enter PhoneNo"
            SateChange={PhoneNo}
            setSateChange={setPhoneNo}
            disabled={false}
          />
          {/* <InputFieldGeneric
            label="Email"
            type="email"
            required={false}
            placeholder="Enter Email"
            SateChange={Email}
            setSateChange={setEmail}
            disabled={false}
          /> */}
          <DropDownList
            label="Country "
            placeholder="Enter Country"
            required={true}
            filedID={setCountryID}
            value={countryName}
            onChange={setCountryName}
            options={countryListData.map((item) => ({
              label: item.countryName,
              value: item.countryName,
              id: item.countryID,
            }))}
          />
          <DropDownList
            label="Region "
            placeholder="Enter Region"
            required={true}
            filedID={setRegionID}
            value={RegionName}
            onChange={setRegionName}
            options={regionList.map((item) => ({
              label: item.regionName,
              value: item.regionName,
              id: item.regionID,
            }))}
          />
          <DropDownList
            label="Zone "
            placeholder="Enter Zone"
            required={true}
            filedID={setZoneID}
            value={ZoneName}
            onChange={setZoneName}
            options={zoneList.map((item) => ({
              label: item.zoneName,
              value: item.zoneName,
              id: item.zoneID,
            }))}
          />
          <GenericCheckbox
            label="Default Store"
            checked={checked}
            onChange={setChecked}
          />
          <TextAreaFieldGeneric
            label="Address"
            required={false}
            placeholder="Enter Address"
            SateChange={description}
            setSateChange={setDescription}
            disabled={false}
          />

          <div className="flex justify-end">
            <ActionButton
              text="Save"
              update={update}
              loading={loading}
              loadingtext="Saving..."
              onClick={() => StoreAdd()}
              disabled={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
