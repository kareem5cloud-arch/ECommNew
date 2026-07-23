"use client";
import StoreSellerGetApi from "@/app/api/Controller/AdminController/Store/GetStoreSeller";
import FurtherAddApi from "@/app/api/Controller/PurchaserLogin/Codes/FurtherSubCategory/AddFurtherCategory";
import FurtherModifyApi from "@/app/api/Controller/PurchaserLogin/Codes/FurtherSubCategory/ModifyFurtherCategory";
import CategorySubGetApi from "@/app/api/Controller/PurchaserLogin/Codes/SubCategory/GetSubCategory";
import UnitGetApi from "@/app/api/Controller/PurchaserLogin/Codes/Unit/GetUnit";
import VarientsGetApi from "@/app/api/Controller/PurchaserLogin/Codes/Variants/GetVarient";
import {
  ResponseGetStore,
  storeList,
} from "@/app/api/Types/AdminSetting/Store/Store";
import { CategoryList } from "@/app/api/Types/OnlineSetting/Category/Category";
import {
  furtherSubCategoryList,
  unitReqesut,
} from "@/app/api/Types/OnlineSetting/FurtherCategory/FurtherCategory";
import {
  ResponseSubCategory,
  subCategoryList,
} from "@/app/api/Types/OnlineSetting/SubCategory/SubCategory";
import {
  RespopnseUInitListGet,
  unitList,
} from "@/app/api/Types/OnlineSetting/Unit/Unit";
import {
  ResponseVariantsListGet,
  VariantsList,
} from "@/app/api/Types/PurchaserLogin/Codes/Variants/Varints";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { Plus, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";

interface propsFurtherSubCatgeory {
  update: boolean;
  storeList: storeList[];
  initalData?: furtherSubCategoryList;
  categoryList: CategoryList[];
  onShowMessage: (message: string, type: "success" | "error") => void;
}

interface valueList {
  ID: string;
  value: string;
}
export default function FurtherSubCategoryAddForm({
  update,
  categoryList,
  storeList,
  onShowMessage,
  initalData,
}: propsFurtherSubCatgeory) {
  const [CategoryName, setCategoryName] = useState("");
  const [CategoryID, setCategoryID] = useState("");
  const [SubCategoryName, setSubCategoryName] = useState("");
  const [SubCategoryID, setSubCategoryID] = useState("");
  const [StoreName, setStoreName] = useState("");
  const [StoreID, setStoreID] = useState("");
  const [VarientName, setVarientName] = useState("");
  const [VarientID, setVarientID] = useState("");
  const [UnitID, setUnitID] = useState("");
  const [UnitName, setUnitName] = useState("");
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");

  const [UnitList, setUnitList] = useState<unitList[]>([]);
  const [FurtherSubCategoryName, setFurtherSubCategoryName] = useState("");

  const [SubCategoryList, setSubCategoryList] = useState<subCategoryList[]>([]);
  const [UnitTable, setUnitTable] = useState<unitReqesut[]>([]);
  const [VarinetList, setVarinetList] = useState<VariantsList[]>([]);
  const [valueList, setValueList] = useState<valueList[]>([]);

  useEffect(() => {
    if (CategoryID) {
      SubCategoryGet(CategoryID);
    }
  }, [CategoryID]);

  const VareintGet = async () => {
    const token = localStorage.getItem("PurchaserLoginToken");
    const response = await VarientsGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as ResponseVariantsListGet;
      setVarinetList(data.variantsList);
      console.log(data);
    } else {
      setVarinetList([]);
    }
  };

  const SubCategoryGet = async (ID: string) => {
    const token = localStorage.getItem("PurchaserLoginToken");
    const response = await CategorySubGetApi(ID, String(token));
    if (response.status == 200) {
      const data = response.data as ResponseSubCategory;
      setSubCategoryList(data.subCategoryList);
    } else {
      setSubCategoryList([]);
    }
  };

  useEffect(() => {
    VareintGet();
  }, []);
  useEffect(() => {
    if (StoreID) {
      UnitListGet(StoreID);
    }
  }, [StoreID]);
  const UnitListGet = async (ID: string) => {
    const token = localStorage.getItem("PurchaserLoginToken");
    const response = await UnitGetApi(ID, String(token));
    if (response.status == 200) {
      const data = response.data as RespopnseUInitListGet;
      setUnitList(data.unitList);
    } else {
      setUnitList([]);
    }
  };
  const AddStoreListDatainTable = (ID: string) => {
    if (!ID) return alert("Please Select a Unit");
    const storeToAdd = UnitList.find((item) => item.unitID === ID);

    if (!storeToAdd) {
      alert("Unit not found");
      setUnitID("");
      setUnitName("");
      return;
    }

    const exists = UnitTable.some((item) => item.unitID === ID);

    if (exists) {
      alert("Record Already Exists in Table");
      setUnitID("");
      setUnitName("");
      return;
    } else {
      setUnitID("");
      setUnitName("");
      setUnitTable([...UnitTable, storeToAdd]);
    }
  };

  const onDeleteStore = (ID: string) => {
    const storeToAdd = UnitTable.filter((item) => item.unitID !== ID);
    if (storeToAdd) {
      setUnitTable(storeToAdd);
    } else {
      alert("Could Not Delete Store.");
    }
  };

  const CategroyAdd = async () => {
    try {
      setLoading(true);
      if (!FurtherSubCategoryName || !SubCategoryID)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          subCategoryID: SubCategoryID,
          name: FurtherSubCategoryName,
          units: UnitTable.map((item) => ({
            unitID: item.unitID,
          })),
          varientslist: valueList.map((item) => ({
            values: item.value,
            id: item.ID,
          })),
        };
        //console.log(formData);
        const token = localStorage.getItem("PurchaserLoginToken");
        const response = await FurtherAddApi(formData, String(token));
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
  const CategroyModify = async () => {
    try {
      setLoading(true);
      if (!FurtherSubCategoryName || !SubCategoryID || !ID)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          subCategoryDetailID: ID,
          subCategoryID: SubCategoryID,
          name: FurtherSubCategoryName,
          units: UnitTable.map((item) => ({
            unitID: item.unitID,
          })),
          varientslist: valueList.map((item) => ({
            values: item.value,
            id: item.ID,
          })),
        };
        //console.log(formData);
        const token = localStorage.getItem("PurchaserLoginToken");
        const response = await FurtherModifyApi(formData, String(token));
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
      setCategoryName(initalData.categoryName || "");
      setCategoryID(initalData.categoryID || "");
      setSubCategoryID(initalData.subCategoryID || "");
      setSubCategoryName(initalData.subCategoryName || "");
      setID(initalData.subCategoryDetailID || "");
      setFurtherSubCategoryName(initalData.name || "");

      if (Array.isArray(initalData.unitListSub)) {
        setUnitTable(
          initalData.unitListSub.map((item) => ({
            unitID: item.unitID,
            unitName: item.unitName,
          })),
        );
      } else {
        setUnitTable([]);
      }
      setValueList(
        initalData.varientslist.map((item, index) => ({
          ID: item.id,
          value: item.values,
        })),
      );
    } else {
      setCategoryName("");
      setCategoryID("");
      setSubCategoryID("");
      setSubCategoryName("");
      setID("");
      setFurtherSubCategoryName("");
      setUnitTable([]);
      setValueList([]);
    }
  }, [initalData, update]);

  const AddVarientData = (ID: string, value: string) => {
    const data = valueList.find((item) => item.ID === ID);
    if (data) {
      setVarientID("");
      setVarientName("");
      return alert("Variant Already Exist");
    }
    if (!value.trim()) return;

    setValueList((prev) => [
      ...prev,
      {
        ID: ID,
        value: value,
      },
    ]);

    setVarientID("");
    setVarientName("");
  };

  const removerData = (ID: string) => {
    setValueList((prev) => prev.filter((item) => item.ID !== ID));
  };
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
          <DropDownList
            label="Sub-Category "
            placeholder="Enter Sub-Category"
            required={true}
            filedID={setSubCategoryID}
            value={SubCategoryName}
            onChange={setSubCategoryName}
            options={SubCategoryList.map((item) => ({
              label: item.subCategoryName,
              value: item.subCategoryName,
              id: item.subCategoryID,
            }))}
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

          <div className="flex gap-2">
            <DropDownList
              label="Unit "
              placeholder="Enter Unit"
              required={true}
              filedID={setUnitID}
              value={UnitName}
              onChange={setUnitName}
              options={UnitList.map((item) => ({
                label: item.unitName,
                value: item.unitName,
                id: item.unitID,
              }))}
            />
            <div className="mt-7">
              <button
                onClick={() => AddStoreListDatainTable(UnitID)}
                title="Add Unit"
                className="px-2 py-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded-md shadow-md"
              >
                <Plus />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <DropDownList
              label="Variant "
              placeholder="Enter Variant"
              required={true}
              filedID={setVarientID}
              value={VarientName}
              onChange={setVarientName}
              options={VarinetList.map((item) => ({
                label: item.variantsName,
                value: item.variantsName,
                id: item.variantsID,
              }))}
            />
            <div className="mt-7">
              <button
                onClick={() => AddVarientData(VarientID, VarientName)}
                title="Add Variant"
                className="px-2 py-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded-md shadow-md"
              >
                <Plus />
              </button>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {valueList.map((item, index) => (
              <div
                key={item.ID}
                className="flex gap-2 px-3 py-1 text-sm rounded-full bg-green-200 text-gray-800"
              >
                <p className="">{item.value}</p>
                <button
                  onClick={() => removerData(item.ID)}
                  className=" text-gray-800 hover:text-red-600"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
          <InputFieldGeneric
            label="Category Name"
            type="text"
            required={false}
            placeholder="Enter Category Name"
            SateChange={FurtherSubCategoryName}
            setSateChange={setFurtherSubCategoryName}
            disabled={false}
          />
          {/* <div className="flex gap-2 ">
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
          </div> */}
          {/* <TextAreaFieldGeneric
            label="Description"
            required={false}
            placeholder="Enter Description"
            SateChange={description}
            setSateChange={setDescription}
            disabled={false}
          /> */}

          {update ? (
            <div className="flex justify-end">
              <ActionButton
                text="Update"
                update={false}
                loading={loading}
                loadingtext="Updateing..."
                onClick={() => CategroyModify()}
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
                onClick={() => CategroyAdd()}
                disabled={false}
              />
            </div>
          )}
        </div>
        <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {UnitTable.map((store, index) => (
                <tr key={store.unitID} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {store.unitName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => onDeleteStore(store.unitID)}
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
