"use client";
import SubCategoryAddApi from "@/app/api/Controller/PurchaserLogin/Codes/SubCategory/AddSubCategory";
import CategorySubModifyApi from "@/app/api/Controller/PurchaserLogin/Codes/SubCategory/ModifySubCategory";
import { CategoryList } from "@/app/api/Types/PurchaserLogin/Codes/Category/Category";
import { subCategoryList } from "@/app/api/Types/PurchaserLogin/Codes/SubCategory/SubCategory";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import GenericCheckbox from "@/app/ui/CheckBox/CheckBox";
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
  const [Amount, setAmount] = useState("");
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  const [Checked, setChecked] = useState(false);
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
          startDate: Checked ? StartDate : "",
          endDate: Checked ? EndDate : "",
          discount: Checked ? Number(Amount) : 0,
          isDiscount: Checked,
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
          startDate: Checked ? StartDate : "",
          endDate: Checked ? EndDate : "",
          discount: Checked ? Number(Amount) : 0,
          isDiscount: Checked,
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
        setChecked(initalData.isDiscount);
        setAmount(String(initalData.discount));
        setStartDate(
          initalData.isDiscount
            ? new Date(initalData.startDate).toISOString().split("T")[0]
            : "",
        );
        setEndDate(
          initalData.isDiscount
            ? new Date(initalData.endDate).toISOString().split("T")[0]
            : "",
        );
      }
    } else {
      setID("");
      setCategoryName("");
      setDescription("");
      setSubCategoryName("");
      setCategoryID("");
      setChecked(false);
      setAmount("");
      setStartDate("");
      setEndDate("");
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
          <GenericCheckbox
            label="Add Discount"
            checked={Checked}
            onChange={setChecked}
          />
          {Checked && (
            <>
              <InputFieldGeneric
                label="Amount"
                type="number"
                required={true}
                placeholder="Enter Amount"
                SateChange={Amount}
                setSateChange={setAmount}
                disabled={false}
              />
              <InputFieldGeneric
                label="Start Date"
                type="date"
                required={true}
                placeholder="Enter Start Date"
                SateChange={StartDate}
                setSateChange={setStartDate}
                disabled={false}
              />
              <InputFieldGeneric
                label="End Date"
                type="date"
                required={true}
                placeholder="Enter End Date"
                SateChange={EndDate}
                setSateChange={setEndDate}
                disabled={false}
              />
            </>
          )}
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
