"use client";
import StoreSellerGetApi from "@/app/api/Controller/AdminController/Store/GetStoreSeller";
import AddDamageProductApi from "@/app/api/Controller/OnlineManager/DamageProduct/AddDamageProduct";
import ModifyDamageProductApi from "@/app/api/Controller/OnlineManager/DamageProduct/ModifyDamageProduct";
import AddGeneralExpenseApi from "@/app/api/Controller/OnlineManager/GeneralExpense/AddGeneralExpense";
import GetGeneralExpenseCategoriesApi from "@/app/api/Controller/OnlineManager/GeneralExpense/GetGeneralExpenseCategory";
import ModifyGeneralExpenseApi from "@/app/api/Controller/OnlineManager/GeneralExpense/ModifyGeneralExpense";
import ProductIDGetApi from "@/app/api/Controller/PurchaserLogin/Codes/Product/GetProductByStore";
import {
  ResponseGetStore,
  storeList,
} from "@/app/api/Types/AdminSetting/Store/Store";
import { DamageList } from "@/app/api/Types/OnlineSeller/DamageProduct/DamageProduct";
import {
  expenseCategoryList,
  expenseList,
  ResponseExpenseCategory,
} from "@/app/api/Types/OnlineSeller/GenralExpense/GenralExpense";
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
  initalDate?: expenseList;
  onShowMessage: (message: string, type: "success" | "error") => void;
}
export default function AddGeneralExpense({
  update,
  initalDate,
  onShowMessage,
}: propsForAddRegion) {
  const [StoreName, setStoreName] = useState("");
  const [ExpenseCategory, setExpenseCategory] = useState("");
  const [ExpenseName, setExpenseName] = useState("");
  const [Amount, setAmount] = useState("");
  const [PostingDate, setPostingDate] = useState("");
  const [Description, setDescription] = useState("");
  const [ExpenseCategoryList, setExpenseCategoryList] = useState<
    expenseCategoryList[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");

  const ExpenseAdd = async () => {
    try {
      setLoading(true);
      if (!PostingDate || !ExpenseCategory || !ExpenseName || !Amount)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          expenseName: ExpenseName,
          expenseDate: PostingDate,
          expenseAmount: Number(Amount),
          expenseCategory: ExpenseCategory,
          remarks: Description,
        };
        const token = localStorage.getItem("OnlineSellerToken");
        const response = await AddGeneralExpenseApi(formData, String(token));
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

  const ExpenseModify = async () => {
    try {
      setLoading(true);
      if (!ID || !PostingDate || !ExpenseCategory || !ExpenseName || !Amount)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          expenseID: ID,
          expenseName: ExpenseName,
          expenseDate: PostingDate,
          expenseAmount: Number(Amount),
          expenseCategory: ExpenseCategory,
          remarks: Description,
        };
        const token = localStorage.getItem("OnlineSellerToken");
        const response = await ModifyGeneralExpenseApi(formData, String(token));
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
  const damageget = async () => {
    const token = localStorage.getItem("OnlineSellerToken");
    const response = await GetGeneralExpenseCategoriesApi(String(token));
    if (response.status == 200) {
      const data = response.data as ResponseExpenseCategory;
      setExpenseCategoryList(data.expenseCategoryList);
    } else {
      setExpenseCategoryList([]);
    }
  };

  useEffect(() => {
    damageget();
  }, []);

  useEffect(() => {
    if (update && initalDate) {
      setID(initalDate.expenseID);
      setPostingDate(
        new Date(initalDate.expenseDate).toISOString().split("T")[0],
      );
      setDescription(initalDate.remarks);
      setExpenseName(initalDate.expenseName);
      setExpenseCategory(initalDate.expenseCategory);
      setAmount(String(initalDate.expenseAmount));
    } else {
      setID("");
      setPostingDate("");
      setDescription("");
      setExpenseName("");
      setExpenseCategory("");
      setAmount("");
    }
  }, [initalDate, update]);

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
          filedID={setExpenseCategory}
          value={ExpenseCategory}
          onChange={setExpenseCategory}
          options={ExpenseCategoryList.map((item, index) => ({
            label: item.expenseCategory,
            value: item.expenseCategory,
            id: String(index),
          }))}
        />
        <InputFieldGeneric
          label="Expense Name"
          type="text"
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
              onClick={() => ExpenseModify()}
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
              onClick={() => ExpenseAdd()}
              disabled={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
