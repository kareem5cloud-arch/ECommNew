"use client";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { Plus } from "lucide-react";
import { useState } from "react";

interface storeList {
  storeID: string;
  storeName: string;
}

interface CatgeoryList {
  categoryID: string;
  categoryName: string;
}
interface UnitsList {
  unitID: string;
  unitName: string;
}

export default function FurtherSubCategoryAddForm() {
  const [SubCategoryName, setSubCategoryName] = useState("");
  const [SubCategoryID, setSubCategoryID] = useState("");
  const [SubCategoryList, setSubCategoryList] = useState<CatgeoryList[]>([]);
  const [UnitID, setUnitID] = useState("");
  const [UnitList, setUnitList] = useState<UnitsList[]>([]);
  const [description, setDescription] = useState("");
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <DropDownList
            label="Sub-Category "
            placeholder="Enter Sub-Category"
            required={true}
            value={SubCategoryID}
            onChange={setSubCategoryID}
            options={SubCategoryList.map((item) => ({
              label: item.categoryID,
              value: item.categoryName,
            }))}
          />
          <InputFieldGeneric
            label="Category Name"
            type="text"
            required={false}
            placeholder="Enter Category Name"
            SateChange={SubCategoryName}
            setSateChange={setSubCategoryName}
            disabled={false}
          />
          <div className="flex gap-2 ">
            <DropDownList
              label="Unit "
              placeholder="Enter Unit"
              required={true}
              value={UnitID}
              onChange={setUnitID}
              options={UnitList.map((item) => ({
                label: item.unitID,
                value: item.unitName,
              }))}
            />
            <div className="mt-7">
              <button className="px-2 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-md text-white shadow-md">
                <Plus />
              </button>
            </div>
          </div>
          {/* <TextAreaFieldGeneric
            label="Description"
            required={false}
            placeholder="Enter Description"
            SateChange={description}
            setSateChange={setDescription}
            disabled={false}
          /> */}

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
