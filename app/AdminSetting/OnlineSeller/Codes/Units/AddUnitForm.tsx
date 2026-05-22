import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { useState } from "react";

interface StoreList {
  storeID: string;
  storeName: string;
}
export default function AddUnitForm() {
  const [UnitName, setUnitName] = useState("");
  const [Abbreviation, setAbbreviation] = useState("");
  const [StoreID, setStoreID] = useState("");
  const [StoreList, setStoreList] = useState<StoreList[]>([]);
  const [description, setDescription] = useState("");
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <DropDownList
            label="Store "
            placeholder="Enter Store"
            required={true}
            value={StoreID}
            onChange={setStoreID}
            options={StoreList.map((item) => ({
              label: item.storeID,
              value: item.storeName,
            }))}
          />

          <InputFieldGeneric
            label="Unit Name"
            type="text"
            required={false}
            placeholder="Enter Unit Name"
            SateChange={UnitName}
            setSateChange={setUnitName}
            disabled={false}
          />
          <InputFieldGeneric
            label="Abbreviation"
            type="text"
            required={false}
            placeholder="Enter abbreviation"
            SateChange={Abbreviation}
            setSateChange={setAbbreviation}
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
              update={false}
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
