"use client";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { Store } from "lucide-react";
import { useState } from "react";

interface countryList {
  countryID: string;
  countryName: string;
}
interface propsForAddRegion {
  update: boolean;
}
export default function AddStoreForm({ update }: propsForAddRegion) {
  const [StoreName, setStoreName] = useState("");
  const [Email, setEmail] = useState("");
  const [optionList, setOptionList] = useState<countryList[]>([]);
  const [countryID, setCountryID] = useState("");
  const [ZoneID, setZoneID] = useState("");
  const [RegionID, setRegionID] = useState("");
  const [description, setDescription] = useState("");
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
            required={false}
            placeholder="Enter Email"
            SateChange={Email}
            setSateChange={setEmail}
            disabled={false}
          />
          <DropDownList
            label="Country "
            placeholder="Enter Country"
            required={true}
            value={countryID}
            onChange={setCountryID}
            options={optionList.map((item) => ({
              label: item.countryName,
              value: item.countryName,
            }))}
          />
          <DropDownList
            label="Region "
            placeholder="Enter Region"
            required={true}
            value={RegionID}
            onChange={setRegionID}
            options={optionList.map((item) => ({
              label: item.countryName,
              value: item.countryName,
            }))}
          />
          <DropDownList
            label="Zone "
            placeholder="Enter Zone"
            required={true}
            value={ZoneID}
            onChange={setZoneID}
            options={optionList.map((item) => ({
              label: item.countryName,
              value: item.countryName,
            }))}
          />
          <TextAreaFieldGeneric
            label="Description"
            required={false}
            placeholder="Enter Description"
            SateChange={description}
            setSateChange={setDescription}
            disabled={false}
          />

          <div className="flex justify-end">
            <ActionButton
              text="Save"
              update={update}
              loading={false}
              loadingtext="Saving..."
              onClick={() => {}}
              disabled={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
