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
export default function AddRegionForm({ update }: propsForAddRegion) {
  const [regionName, setRegionName] = useState("");
  const [optionList, setOptionList] = useState<countryList[]>([]);
  const [countryID, setCountryID] = useState("");
  const [description, setDescription] = useState("");
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <InputFieldGeneric
            label="Region Name"
            type="text"
            required={false}
            placeholder="Enter Region Name"
            SateChange={regionName}
            setSateChange={setRegionName}
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
