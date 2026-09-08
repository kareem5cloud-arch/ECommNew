"use client";
import CategoryAddApi from "@/app/api/Controller/PurchaserLogin/Codes/Category/AddCategory";
import CategoryModifyApi from "@/app/api/Controller/PurchaserLogin/Codes/Category/ModifyCategory";
import { storeList } from "@/app/api/Types/AdminSetting/Store/Store";
import { CategoryList } from "@/app/api/Types/PurchaserLogin/Codes/Category/Category";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import GenericCheckbox from "@/app/ui/CheckBox/CheckBox";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  update: boolean;
  onShowMessage: (message: string, type: "success" | "error") => void;
  initalData?: CategoryList;
  storeList: storeList[];
}

export default function AddCategoryForm({
  update,
  initalData,
  storeList,
  onShowMessage,
}: propsForAddRegion) {
  const [CategoryName, setCategoryName] = useState("");
  const [StoreName, setStoreName] = useState("");
  const [StoreID, setStoreID] = useState("");
  const [description, setDescription] = useState("");
  const [ID, setID] = useState("");
  const [Amount, setAmount] = useState("");
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  const [Checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const CategoryAdd = async () => {
    try {
      setLoading(true);
      if (!CategoryName || !StoreID)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          categoryName: CategoryName,
          description: description,
          storeID: StoreID,
          startDate: Checked ? StartDate : "",
          endDate: Checked ? EndDate : "",
          discount: Checked ? Number(Amount) : 0,
          isDiscount: Checked,
        };
        const token = localStorage.getItem("PurchaserLoginToken");
        const response = await CategoryAddApi(formData, String(token));
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
  const CategoryModify = async () => {
    try {
      setLoading(true);
      if (!CategoryName || !ID || !StoreID)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          categoryID: ID,
          categoryName: CategoryName,
          description: description,
          storeID: StoreID,
          startDate: Checked ? StartDate : "",
          endDate: Checked ? EndDate : "",
          discount: Checked ? Number(Amount) : 0,
          isDiscount: Checked,
        };
        const token = localStorage.getItem("PurchaserLoginToken");
        const response = await CategoryModifyApi(formData, String(token));
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
        setID(initalData.categoryID);
        setCategoryName(initalData.categoryName);
        setDescription(initalData.description);
        setStoreName(initalData.storeName);
        setStoreID(initalData.storeID);
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
      setCategoryName("");
      setDescription("");
      setID("");
      setStoreName("");
      setStoreID("");
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
            label="Store "
            placeholder="Enter Store"
            required={true}
            filedID={setStoreID}
            value={StoreName}
            onChange={setStoreName}
            options={storeList.map((item) => ({
              label: item.storeName,
              value: item.storeName,
              id: item.storeID,
            }))}
          />
          <InputFieldGeneric
            label="Category Name"
            type="text"
            required={true}
            placeholder="Enter Category Name"
            SateChange={CategoryName}
            setSateChange={setCategoryName}
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
                onClick={() => CategoryModify()}
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
                onClick={() => CategoryAdd()}
                disabled={false}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
