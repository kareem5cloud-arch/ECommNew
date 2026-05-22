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

interface CatgeoryList {
  categoryID: string;
  categoryName: string;
}
interface StoreList {
  storeID: string;
  storeName: string;
}

export default function SubCategoryAddForm() {
  const [SubCategoryName, setSubCategoryName] = useState("");
  const [CategoryID, setCategoryID] = useState("");
  const [CategoryList, setCategoryList] = useState<CatgeoryList[]>([]);
  const [StoreID, setStoreID] = useState("");
  const [StoreList, setStoreList] = useState<StoreList[]>([]);
  const [description, setDescription] = useState("");
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <DropDownList
            label="Category "
            placeholder="Enter Category"
            required={true}
            value={CategoryID}
            onChange={setCategoryID}
            options={CategoryList.map((item) => ({
              label: item.categoryID,
              value: item.categoryName,
            }))}
          />
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
            label="Sub-Category Name"
            type="text"
            required={false}
            placeholder="Enter SubCategory Name"
            SateChange={SubCategoryName}
            setSateChange={setSubCategoryName}
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
