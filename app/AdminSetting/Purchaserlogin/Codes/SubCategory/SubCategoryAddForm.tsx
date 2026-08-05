"use client";
import SubCategoryAddApi from "@/app/api/Controller/PurchaserLogin/Codes/SubCategory/AddSubCategory";
import CategorySubModifyApi from "@/app/api/Controller/PurchaserLogin/Codes/SubCategory/ModifySubCategory";
import { CategoryList } from "@/app/api/Types/PurchaserLogin/Codes/Category/Category";
import { subCategoryList } from "@/app/api/Types/PurchaserLogin/Codes/SubCategory/SubCategory";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { useEffect, useState } from "react";

interface storeList {
  storeID: string;
  storeName: string;
}

interface StoreList {
  storeID: string;
  storeName: string;
}
interface PropsSubCategory {
  update: boolean;
  categoryList: CategoryList[];
  initalData?: subCategoryList;
  onShowMessage: (message: string, type: "success" | "error") => void;
}

export default function SubCategoryAddForm({
  update,
  initalData,
  onShowMessage,
  categoryList,
}: PropsSubCategory) {
  const [SubCategoryName, setSubCategoryName] = useState("");
  const [CategoryID, setCategoryID] = useState("");
  const [CategoryName, setCategoryName] = useState("");
  const [StoreList, setStoreList] = useState<StoreList[]>([]);
  const [description, setDescription] = useState("");
  const [ID, setID] = useState("");
  const [loading, setLoading] = useState(false);

  const SubCategoryAdd = async () => {
    try {
      setLoading(true);
      if (!CategoryID || !SubCategoryName)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          categoryID: CategoryID,
          subCategoryName: SubCategoryName,
          description: description,
        };
        const token = localStorage.getItem("PurchaserLoginToken");
        const response = await SubCategoryAddApi(formData, String(token));
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
  const SubCategoryModify = async () => {
    try {
      setLoading(true);
      if (!CategoryID || !SubCategoryName || !ID)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          subCategoryID: ID,
          categoryID: CategoryID,
          subCategoryName: SubCategoryName,
          description: description,
        };
        const token = localStorage.getItem("PurchaserLoginToken");
        const response = await CategorySubModifyApi(formData, String(token));
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
        setID(initalData.subCategoryID);
        setCategoryName(initalData.categoryName);
        setDescription(initalData.description);
        setSubCategoryName(initalData.subCategoryName);
        setCategoryID(initalData.categoryID);
      }
    } else {
      setID("");
      setCategoryName("");
      setDescription("");
      setSubCategoryName("");
      setCategoryID("");
    }
  }, [initalData, update]);
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <DropDownList
            label="Category "
            placeholder="Enter Category"
            required={true}
            filedID={setCategoryID}
            value={CategoryName}
            onChange={setCategoryName}
            options={categoryList.map((item) => ({
              label: item.categoryName,
              value: item.categoryName,
              id: item.categoryID,
            }))}
          />

          <InputFieldGeneric
            label="Sub-Category Name"
            type="text"
            required={true}
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

          {update ? (
            <div className="flex justify-end">
              <ActionButton
                text="Update"
                update={false}
                loading={loading}
                loadingtext="Updateing..."
                onClick={() => SubCategoryModify()}
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
                onClick={() => SubCategoryAdd()}
                disabled={false}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
