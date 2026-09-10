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
  initalData?: DamageList;
  onShowMessage: (message: string, type: "success" | "error") => void;
}
export default function AddDamageProduct({
  update,
  onShowMessage,
  initalData,
}: propsForAddRegion) {
  const [StoreName, setStoreName] = useState("");
  const [StoreID, setStoreID] = useState("");
  const [productID, setProductID] = useState("");
  const [productName, setProductName] = useState("");
  const [varientID, setVarientID] = useState("");
  const [varientName, setVarientName] = useState("");
  const [Qty, setQty] = useState("");
  const [PostingDate, setPostingDate] = useState("");
  const [Description, setDescription] = useState("");
  const [productList, setProductList] = useState<productList[]>([]);
  const [varientList, setVarientList] = useState<variantsList[]>([]);
  const [StoreList, setStoreList] = useState<storeList[]>([]);
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");

  const getStores = async () => {
    const token = localStorage.getItem("OnlineSellerToken");
    const response = await StoreSellerGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as ResponseGetStore;
      setStoreList(data.storeList);
      setStoreID(data.storeList[0].storeID);
      getProducts(data.storeList[0].storeID);
      setStoreName(data.storeList[0].storeName);
    } else {
      setStoreList([]);
    }
  };
  const getProducts = async (ID: string) => {
    const token = localStorage.getItem("OnlineSellerToken");
    const response = await ProductIDGetApi(ID, String(token));
    if (response.status == 200) {
      const data = response.data as responseGetProduct;
      setProductList(data.productList);
      const filterData = data.productList.find(
        (item) => item.productID === productID,
      );
      if (filterData) {
        setProductID(filterData.productID);
        setProductName(filterData.productName);
      }
    } else {
      setProductList([]);
    }
  };

  const DamageAdd = async () => {
    try {
      setLoading(true);
      if (!PostingDate || !varientID || !Qty || !Description)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          varientID: varientID,
          qty: Number(Qty),
          remarks: Description,
          postingDate: PostingDate,
        };
        const token = localStorage.getItem("OnlineSellerToken");
        const response = await AddDamageProductApi(formData, String(token));
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
  const DamageModify = async () => {
    try {
      setLoading(true);
      if (!ID || !PostingDate || !varientID || !Qty || !Description)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          dID: ID,
          varientID: varientID,
          qty: Number(Qty),
          remarks: Description,
          postingDate: PostingDate,
        };
        // console.log(formData);
        const token = localStorage.getItem("OnlineSellerToken");
        const response = await ModifyDamageProductApi(formData, String(token));
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
    if (update && initalData) {
      setID(initalData.dID);
      setPostingDate(
        new Date(initalData.postingDate).toISOString().split("T")[0],
      );
      setDescription(initalData.remarks);
      setStoreID(initalData.storeID);
      setStoreName(initalData.storeName);
      setProductID(initalData.productID);
      setProductName(initalData.productName);
      setVarientID(initalData.varientID);
      setQty(String(initalData.qty));
      setVarientName(initalData.valuesList.map((item) => item.value).join("-"));
    } else {
      setID("");
      setPostingDate("");
      setDescription("");
      setStoreID("");
      setStoreName("");
      setProductID("");
      setProductName("");
      setVarientID("");
      setQty("");
      setVarientName("");
    }
  }, [initalData, update]);

  useEffect(() => {
    getStores();
  }, []);

  useEffect(() => {
    const data = productList.find((item) => item.productID === productID);
    if (data) {
      setVarientList(data.variants);
    }
  }, [productID]);
  useEffect(() => {
    const data = varientList.find((item) => item.varientID === varientID);
    if (data) {
      setVarientID(data.varientID);
    }
  }, [varientID]);
  return (
    <div className="w-full flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:max-w-md space-y-4">
        <InputFieldGeneric
          label={`PostingDate`}
          type="date"
          required={true}
          placeholder="Enter PostingDate"
          SateChange={PostingDate}
          setSateChange={setPostingDate}
          disabled={false}
        />
        <DropDownList
          label="Store"
          placeholder="Select Store"
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
        <DropDownList
          label="Product "
          placeholder="Enter Product"
          required={true}
          filedID={setProductID}
          value={productName}
          onChange={setProductName}
          options={productList.map((item) => ({
            label: item.productName,
            value: item.productName,
            id: item.productID,
          }))}
        />
        <DropDownList
          label="Variant"
          placeholder="Select Variant"
          required={true}
          filedID={setVarientID}
          value={varientName}
          onChange={setVarientName}
          options={varientList.map((item) => ({
            label: item.values.map((v) => v.varientValue).join(" - "),
            value: item.values.map((v) => v.varientValue).join(" - "),
            id: item.varientID,
          }))}
        />
        <InputFieldGeneric
          label={`Qty`}
          type="text"
          required={true}
          placeholder="Enter Qty"
          SateChange={Qty}
          setSateChange={setQty}
          disabled={false}
        />
        <TextAreaFieldGeneric
          label="Description"
          required={false}
          placeholder="Enter Description"
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
              onClick={() => DamageModify()}
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
              onClick={() => DamageAdd()}
              disabled={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
