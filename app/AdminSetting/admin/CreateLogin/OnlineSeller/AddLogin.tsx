"use client";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { useState } from "react";

interface storeList {
  storeID: string;
  storeName: string;
}

export default function AddOnlineLogin() {
  const [UserName, setUserName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [Address, setAddress] = useState("");
  const [StoreID, setStoreID] = useState("");
  const [stores, setStore] = useState<storeList[]>([]);
  const [numberOfDays, setNumberOfDays] = useState("");
  const [description, setDescription] = useState("");
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <InputFieldGeneric
            label="UserName"
            type="text"
            required={false}
            placeholder="Enter UserName"
            SateChange={UserName}
            setSateChange={setUserName}
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
          <InputFieldGeneric
            label="Password"
            type="text"
            required={false}
            placeholder="Enter Password"
            SateChange={Password}
            setSateChange={setPassword}
            disabled={false}
          />
          <InputFieldGeneric
            label="PhoneNo"
            type="text"
            required={false}
            placeholder="Enter PhoneNo"
            SateChange={PhoneNo}
            setSateChange={setPhoneNo}
            disabled={false}
          />
          <InputFieldGeneric
            label="Address"
            type="text"
            required={false}
            placeholder="Enter Address"
            SateChange={Address}
            setSateChange={setAddress}
            disabled={false}
          />
          <DropDownList
            label="Stores "
            placeholder="Enter Stores"
            required={true}
            value={StoreID}
            onChange={setStoreID}
            options={stores.map((item) => ({
              label: item.storeID,
              value: item.storeName,
            }))}
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
