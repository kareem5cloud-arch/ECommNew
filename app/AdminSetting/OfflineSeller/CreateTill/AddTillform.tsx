import ProductIDGetApi from "@/app/api/Controller/OnlineSellerController/Product/GetProductByStore";
import { storeList } from "@/app/api/Types/AdminSetting/Store/Store";
import {
  productList,
  responseGetProduct,
  variantsList,
  variantValues,
} from "@/app/api/Types/OnlineSetting/Product/Product";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import { Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
interface tableData {
  productID: string;
  productName: string;
  attributeID: string;
  attributeName: string;
  varientID: string;
  varientName: string;
  qty: string;
}
interface TillForm {
  storeList: storeList[];
}
export default function AddTillform({ storeList }: TillForm) {
  const [TillName, setTillName] = useState("");
  const [StoreName, setStoreName] = useState("");
  const [StoreID, setStoreID] = useState("");
  const [productID, setProductID] = useState("");
  const [productName, setProductName] = useState("");
  const [varientID, setVarientID] = useState("");
  const [varientName, setVarientName] = useState("");
  const [attriubuteID, setattriubuteID] = useState("");
  const [attriubuteName, setattriubuteName] = useState("");
  const [SearchText, setSearchText] = useState("");
  const [Qty, setQty] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<tableData[]>([]);

  const [productList, setProductList] = useState<productList[]>([]);
  const [varientList, setVarientList] = useState<variantsList[]>([]);
  const [attriubuteList, setattriubuteList] = useState<variantValues[]>([]);

  const getProducts = async (ID: string) => {
    const token = localStorage.getItem("OfflineSellerToken");
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
    const data = productList.find((item) => item.productID === productID);
    if (data) {
      setVarientList(data.variants);
    }
  }, [productID]);
  useEffect(() => {
    const data = varientList.find((item) => item.varientID === varientID);
    if (data) {
      setattriubuteList(data.variantValues);
    }
  }, [varientID]);

  const resetFunctionTable = () => {
    setProductID("");
    setProductName("");
    setVarientID("");
    setVarientName("");
    setattriubuteID("");
    setattriubuteName("");
    setQty("");
  };
  const AddRecord = (ID: string) => {
    if (!ID || !StoreID || !varientID || !attriubuteID || !Qty)
      return alert("Please Fill in All Required Fields");
    const isExist = tableData.find((item) => item.productID === ID);
    if (isExist) {
      setTableData((prev) =>
        prev.map((item) =>
          item.productID === ID
            ? { ...item, qty: (Number(item.qty) + 1).toString() }
            : item,
        ),
      );
      resetFunctionTable();
    } else {
      const newRecord: tableData = {
        productID,
        productName,
        attributeID: attriubuteID,
        attributeName: attriubuteName,
        varientID,
        varientName,
        qty: Qty,
      };
      setTableData((prev) => [...prev, newRecord]);
      resetFunctionTable();
    }
  };
  const DeleteRecord = (ID: string) => {
    const data = tableData.filter((item) => item.productID !== ID);
    if (data) {
      setTableData(data);
    }
  };
  const filterData = tableData.filter((item) => {
    return item.productName
      .toLocaleLowerCase()
      .includes(SearchText.toLocaleUpperCase());
  });

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <InputFieldGeneric
            label="Till Name"
            type="text"
            required={true}
            placeholder="Enter Till Name"
            SateChange={TillName}
            setSateChange={setTillName}
            disabled={false}
          />
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
            label="Varient "
            placeholder="Enter Varient"
            required={true}
            filedID={setVarientID}
            value={varientName}
            onChange={setVarientName}
            options={varientList.map((item) => ({
              label: item.variantName,
              value: item.variantName,
              id: item.varientID,
            }))}
          />
          <DropDownList
            label="Attribute "
            placeholder="Enter Attribute"
            required={true}
            filedID={setattriubuteID}
            value={attriubuteName}
            onChange={setattriubuteName}
            options={attriubuteList.map((item) => ({
              label: item.varientValue,
              value: item.varientValue,
              id: item.attributeID,
            }))}
          />
          <div className="w-full flex gap-2">
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
            <div className="mt-7">
              <button
                onClick={() => AddRecord(productID)}
                title="Add Product"
                className="px-2 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md cursor-pointer"
              >
                <Plus />
              </button>
            </div>
          </div>
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
        </div>
        <div className="w-full mt-5 p-2 overflow-x-auto bg-white rounded-lg shadow-md">
          <div className="mt-2 mb-2 ">
            <InputFieldGeneric
              label=""
              type="text"
              required={false}
              placeholder="Search By Product Name"
              SateChange={SearchText}
              setSateChange={setSearchText}
              disabled={false}
            />
          </div>
          <table className="w-full bg-white border-collapse mt-2">
            <thead className="bg-white">
              <tr className="border border-neutral-200">
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
                  Attribute
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterData.map((store, index) => (
                <tr
                  key={store.productID}
                  className="border-b border-neutral-100  hover:bg-gray-50 transition"
                >
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
                      {store.attributeName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {store.qty}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => DeleteRecord(store.productID)}
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
      </div>
    </>
  );
}
