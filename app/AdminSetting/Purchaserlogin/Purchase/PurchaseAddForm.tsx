import StoreSellerGetApi from "@/app/api/Controller/AdminController/Store/GetStoreSeller";
import SuppliergetApi from "@/app/api/Controller/PurchaserLogin/Codes/Supplier/SupplierGet";
import ProductIDGetApi from "@/app/api/Controller/PurchaserLogin/Codes/Product/GetProductByStore";
import {
  ResponseGetStore,
  storeList,
} from "@/app/api/Types/AdminSetting/Store/Store";
import {
  ResponseGetSupplpierlist,
  SupplierListReponse,
} from "@/app/api/Types/PurchaserLogin/Supplier/supplier";

import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import {
  productList,
  responseGetProduct,
  variantsList,
  variantValues,
} from "@/app/api/Types/PurchaserLogin/Codes/Product/Product";
import PurchaseAddApi from "@/app/api/Controller/PurchaserLogin/Purchase/AddPurchase";
import PurchaseModifyApi from "@/app/api/Controller/PurchaserLogin/Purchase/ModifyPurchase";
import { GetPurchaseList } from "@/app/api/Types/PurchaserLogin/Purchase/Purchase";
interface tableData {
  productID: string;
  productName: string;
  varientID: string;
  varientName: string;
  costPrice: string;
  salePrice: string;
  qty: string;
}
interface AddPurchaseProps {
  update: boolean;
  initalData?: GetPurchaseList;
  onShowMessage: (message: string, type: "success" | "error") => void;
}
export default function PurchaseAddForm({
  update,
  onShowMessage,
  initalData,
}: AddPurchaseProps) {
  const [postingDate, setPostingDate] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierID, setSupplierID] = useState("");
  const [StoreName, setStoreName] = useState("");
  const [StoreID, setStoreID] = useState("");
  const [description, setDescription] = useState("");
  const [productID, setProductID] = useState("");
  const [productName, setProductName] = useState("");
  const [varientID, setVarientID] = useState("");
  const [varientName, setVarientName] = useState("");
  const [ID, setID] = useState("");
  const [Qty, setQty] = useState("");
  const [CostPrice, setCostPrice] = useState("");
  const [SalePrice, setSalePrice] = useState("");
  const [TotalBill, setTotalBill] = useState("");
  const [AmountPaid, setAmountPaid] = useState("");
  const [loading, setLoading] = useState(false);

  const [supplierList, setSupplierList] = useState<SupplierListReponse[]>([]);
  const [StoreList, setStoreList] = useState<storeList[]>([]);
  const [productList, setProductList] = useState<productList[]>([]);
  const [varientList, setVarientList] = useState<variantsList[]>([]);

  const [tableData, setTableData] = useState<tableData[]>([]);

  const GetSupplier = async () => {
    const token = localStorage.getItem("PurchaserLoginToken");
    const response = await SuppliergetApi(String(token));
    if (response.status === 200) {
      const data = response.data as ResponseGetSupplpierlist;
      setSupplierList(data.supplierList);
    } else {
      setSupplierList([]);
    }
  };
  const getStores = async () => {
    const token = localStorage.getItem("PurchaserLoginToken");
    const response = await StoreSellerGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as ResponseGetStore;
      setStoreList(data.storeList);
    } else {
      setStoreList([]);
    }
  };
  const getProducts = async (ID: string) => {
    const token = localStorage.getItem("PurchaserLoginToken");
    const response = await ProductIDGetApi(ID, String(token));
    if (response.status == 200) {
      const data = response.data as responseGetProduct;
      setProductList(data.productList);
    } else {
      setProductList([]);
    }
  };
  useEffect(() => {
    getProducts(StoreID);
  }, [StoreID]);
  useEffect(() => {
    GetSupplier();
    getStores();
  }, []);

  const resetFunctionTable = () => {
    setProductID("");
    setProductName("");
    setVarientID("");
    setVarientName("");
    setQty("");
    setCostPrice("");
    setSalePrice("");
  };
  const AddRecord = (ID: string) => {
    if (!ID || !StoreID || !varientID || !Qty || !CostPrice || !SalePrice)
      return alert("Please Fill in All Required Fields");
    const isExist = tableData.find((item) => item.varientID === ID);
    if (isExist) {
      setTableData((prev) =>
        prev.map((item) =>
          item.varientID === ID
            ? { ...item, qty: (Number(item.qty) + 1).toString() }
            : item,
        ),
      );
      resetFunctionTable();
    } else {
      const newRecord: tableData = {
        productID,
        productName,
        varientID,
        varientName,
        costPrice: CostPrice,
        salePrice: SalePrice,
        qty: Qty,
      };
      setTableData((prev) => [...prev, newRecord]);
      resetFunctionTable();
    }
  };

  const CategoryAdd = async () => {
    try {
      setLoading(true);
      if (!supplierID || !postingDate)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          postingDate: postingDate,
          remarks: description,
          totalBill: Number(TotalBill),
          amountPaid: Number(AmountPaid),
          supplierID: supplierID,
          productList: tableData.map((item) => ({
            varientID: item.varientID,
            costPrice: Number(item.costPrice),
            salePrice: Number(item.salePrice),
            qty: Number(item.qty),
          })),
        };
        const token = localStorage.getItem("PurchaserLoginToken");
        const response = await PurchaseAddApi(formData, String(token));
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
      console.log("IDis ", ID);
      if (!supplierID || !postingDate)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          ledgerID: ID,
          postingDate: postingDate,
          remarks: description,
          totalBill: Number(TotalBill),
          amountPaid: Number(AmountPaid),
          supplierID: supplierID,
          productList: tableData.map((item) => ({
            varientID: item.varientID,
            costPrice: Number(item.costPrice),
            salePrice: Number(item.salePrice),
            qty: Number(item.qty),
          })),
        };
        const token = localStorage.getItem("PurchaserLoginToken");
        const response = await PurchaseModifyApi(formData, String(token));
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
  const DeleteRecord = (ID: string) => {
    const data = tableData.filter((item) => item.varientID !== ID);
    if (data) {
      setTableData(data);
    }
  };
  useEffect(() => {
    const data = productList.find((item) => item.productID === productID);
    if (data) {
      setVarientList(data.variants);
    }
  }, [productID]);

  useEffect(() => {
    const totalBill = tableData.reduce((sum, item) => {
      return sum + Number(item.qty) * Number(item.costPrice);
    }, 0);
    setTotalBill(String(totalBill));
    setAmountPaid(String(totalBill));
  }, [tableData]);

  useEffect(() => {
    if (update) {
      if (initalData) {
        console.log(initalData);
        setID(initalData.ledgerID);
        setDescription(initalData.remarks);
        setPostingDate(
          new Date(initalData.postingDate).toISOString().split("T")[0],
        );
        setSupplierID(initalData.supplierID);
        setSupplierName(initalData.supplierName);
        setTotalBill(String(initalData.totalBill));
        setAmountPaid(String(initalData.amountPaid));
        setTableData(
          initalData.detailList.map((item) => ({
            productID: item.productID,
            productName: item.productName,
            varientID: item.varientID,
            varientName: item.attributeValues
              .map((attr) => attr.value)
              .join("-"),
            costPrice: String(item.costPrice),
            salePrice: String(item.salePrice),
            qty: String(item.qty),
          })),
        );
      }
    } else {
      setDescription("");
      setID("");
      setPostingDate("");
      setSupplierID("");
      setSupplierName("");
      setTotalBill("");
      setAmountPaid("");
      setStoreName("");
      setStoreID("");
      setTableData([]);
    }
  }, [initalData, update]);

  return (
    <>
      <div className="w-full flex  flex-col lg:flex-row gap-8">
        <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-md ">
          <h1 className="text-lg font-medium text-gray-600">Purchase Info</h1>
          <hr className="text-gray-200 mt-2" />
          <div className="w-full flex  flex-col lg:flex-row gap-2 ">
            <div className="w-full">
              <InputFieldGeneric
                label="Purchase Date"
                type="date"
                required={true}
                placeholder="Enter Purchase Date"
                SateChange={postingDate}
                setSateChange={setPostingDate}
                disabled={false}
              />
            </div>
            <div className="w-full mt-5">
              <DropDownList
                label="Supplier "
                placeholder="Enter Supplier"
                required={true}
                filedID={setSupplierID}
                value={supplierName}
                onChange={setSupplierName}
                options={supplierList.map((item) => ({
                  label: item.supplierName,
                  value: item.supplierName,
                  id: item.supplierID,
                }))}
              />
            </div>
          </div>
          <div className="w-full flex  mt-1 flex-col lg:flex-row gap-2 ">
            <div className="w-full">
              <InputFieldGeneric
                label="Total Bill"
                type="text"
                required={true}
                placeholder="Enter Total Bill"
                SateChange={TotalBill}
                readonly
                setSateChange={setTotalBill}
                disabled={false}
              />
            </div>
            <div className="w-full">
              <InputFieldGeneric
                label="Amount Paid"
                type="text"
                required={true}
                placeholder="Enter Amount Paid"
                SateChange={AmountPaid}
                setSateChange={setAmountPaid}
                disabled={false}
              />
            </div>
          </div>
          <TextAreaFieldGeneric
            label="Description"
            required={false}
            placeholder="Enter Description"
            SateChange={description}
            setSateChange={setDescription}
            disabled={false}
          />
        </div>
        <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-md">
          <h1 className="text-lg font-medium text-gray-600">Product Info</h1>
          <hr className="text-gray-200 mt-2" />

          <DropDownList
            label="Store "
            placeholder="Enter Store"
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
          <div className="w-full mt-4 flex  flex-col lg:flex-row gap-2 ">
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
          </div>
          <div className="w-full flex  flex-col lg:flex-row gap-2 ">
            <div className="w-full">
              <InputFieldGeneric
                label="Qty"
                type="text"
                required={true}
                placeholder="Enter Qty"
                SateChange={Qty}
                setSateChange={setQty}
                disabled={false}
              />
            </div>
            <div className="w-full">
              <InputFieldGeneric
                label="Cost Price"
                type="text"
                required={true}
                placeholder="Enter Cost Price"
                SateChange={CostPrice}
                setSateChange={setCostPrice}
                disabled={false}
              />
            </div>
          </div>
          <div className="w-full flex  flex-col lg:flex-row gap-2 ">
            <div className="w-full">
              <InputFieldGeneric
                label="Sale Price"
                type="text"
                required={true}
                placeholder="Enter Sale Price"
                SateChange={SalePrice}
                setSateChange={setSalePrice}
                disabled={false}
              />
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <ActionButton
              text="Add Record"
              update={false}
              loading={false}
              loadingtext=""
              size={true}
              onClick={() => AddRecord(varientID)}
              disabled={false}
            />
          </div>
        </div>
      </div>
      <div className="w-full mt-5 overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full bg-white">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Variant
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sale Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map((store, index) => (
              <tr key={store.varientID} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {store.productName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {store.varientName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {store.qty}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {store.costPrice}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {store.salePrice}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => DeleteRecord(store.varientID)}
                    className="text-red-600 hover:text-red-900 transition p-1 rounded hover:bg-red-50"
                    title="Delete Store"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    </>
  );
}
