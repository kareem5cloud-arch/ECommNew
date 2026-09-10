"use client";
import StoreSellerGetApi from "@/app/api/Controller/AdminController/Store/GetStoreSeller";
import AddDamageProductApi from "@/app/api/Controller/OnlineManager/DamageProduct/AddDamageProduct";
import ModifyDamageProductApi from "@/app/api/Controller/OnlineManager/DamageProduct/ModifyDamageProduct";
import ProductIDGetApi from "@/app/api/Controller/PurchaserLogin/Codes/Product/GetProductByStore";
import {
  ResponseGetStore,
  storeList,
} from "@/app/api/Types/AdminSetting/Store/Store";
import { DamageList } from "@/app/api/Types/OnlineSeller/DamageProduct/DamageProduct";
import {
  productList,
  responseGetProduct,
  variantsList,
} from "@/app/api/Types/PurchaserLogin/Codes/Product/Product";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  update: boolean;
  onShowMessage: (message: string, type: "success" | "error") => void;
}
export default function AddGeneralExpense({
  update,
  onShowMessage,
}: propsForAddRegion) {
  const [StoreName, setStoreName] = useState("");
  const [StoreID, setStoreID] = useState("");
  const [ExpenseName, setExpenseName] = useState("");
  const [productName, setProductName] = useState("");
  const [varientID, setVarientID] = useState("");
  const [varientName, setVarientName] = useState("");
  const [Amount, setAmount] = useState("");
  const [PostingDate, setPostingDate] = useState("");
  const [Description, setDescription] = useState("");
  const [productList, setProductList] = useState<productList[]>([]);
  const [varientList, setVarientList] = useState<variantsList[]>([]);
  const [StoreList, setStoreList] = useState<storeList[]>([]);
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:max-w-md space-y-4">
        <InputFieldGeneric
          label={`Expense Date`}
          type="date"
          required={true}
          placeholder="Enter Expense Date"
          SateChange={PostingDate}
          setSateChange={setPostingDate}
          disabled={false}
        />
        <DropDownList
          label="Expense Category"
          placeholder="Select Expense Category"
          required={true}
          filedID={setStoreID}
          value={StoreName}
          onChange={setStoreName}
          options={StoreList.map((item) => ({
            label: item.storeName,
            value: item.storeName,
            id: item.storeID,
          }))}
        />
        <InputFieldGeneric
          label="Expense Name"
          type="number"
          required={true}
          placeholder="Enter Expense Name"
          SateChange={ExpenseName}
          setSateChange={setExpenseName}
          disabled={false}
        />
        <InputFieldGeneric
          label="Amount"
          type="number"
          required={true}
          placeholder="Enter Amount"
          SateChange={Amount}
          setSateChange={setAmount}
          disabled={false}
        />
        <TextAreaFieldGeneric
          label="Remarks"
          required={false}
          placeholder="Enter Remarks"
          SateChange={Description}
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
              onClick={() => {}}
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
              onClick={() => {}}
              disabled={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
