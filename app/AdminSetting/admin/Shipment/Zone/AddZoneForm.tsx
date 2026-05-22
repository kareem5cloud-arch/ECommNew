"use client";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { useState } from "react";

interface countryList {
  countryID: string;
  countryName: string;
}
interface propsForAddRegion {
  update: boolean;
}
export default function AddZoneForm({ update }: propsForAddRegion) {
  const [ZoneName, setZoneName] = useState("");
  const [optionList, setOptionList] = useState<countryList[]>([]);
  const [countryID, setCountryID] = useState("");
  const [RegionID, setRegionID] = useState("");
  const [description, setDescription] = useState("");
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
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
            label="Region"
            placeholder="Enter Region"
            required={true}
            value={RegionID}
            onChange={setRegionID}
            options={optionList.map((item) => ({
              label: item.countryName,
              value: item.countryName,
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
