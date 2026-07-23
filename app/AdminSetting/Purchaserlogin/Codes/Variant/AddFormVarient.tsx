"use client";
import VarientsAddApi from "@/app/api/Controller/PurchaserLogin/Codes/Variants/AddVarient";
import VarientsModifyApi from "@/app/api/Controller/PurchaserLogin/Codes/Variants/ModifyVarient";
import { storeList } from "@/app/api/Types/AdminSetting/Store/Store";
import { VariantsList } from "@/app/api/Types/PurchaserLogin/Codes/Variants/Varints";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface valueList {
  ID: string;
  value: string;
}
interface propsForAddRegion {
  update: boolean;
  onShowMessage: (message: string, type: "success" | "error") => void;
  initalData?: VariantsList;
}

export default function AddFormVarient({
  update,
  initalData,
  onShowMessage,
}: propsForAddRegion) {
  const [CategoryName, setCategoryName] = useState("");
  const [Values, setValues] = useState("");
  const [description, setDescription] = useState("");
  const [ID, setID] = useState("");
  const [SortingOrder, setSortingOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const [valueList, setValueList] = useState<valueList[]>([]);

  const CategoryAdd = async () => {
    try {
      setLoading(true);
      if (!CategoryName) return alert("Please Fill in Filed with *");
      else {
        const formData = {
          variantsName: CategoryName,
          description: description,
          varientList: valueList.map((item) => ({
            value: item.value,
          })),
        };
        const token = localStorage.getItem("PurchaserLoginToken");
        const response = await VarientsAddApi(formData, String(token));
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
      if (!CategoryName || !ID) return alert("Please Fill in Filed with *");
      else {
        const formData = {
          variantsID: ID,
          variantsName: CategoryName,
          description: description,
          sortingOrder: Number(SortingOrder),
          varientList: valueList.map((item) => ({
            value: item.value,
          })),
        };
        const token = localStorage.getItem("PurchaserLoginToken");
        const response = await VarientsModifyApi(formData, String(token));
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
  const AddRecord = (value: string) => {
    if (!value.trim()) return;

    setValueList((prev) => [
      ...prev,
      {
        ID: String(prev.length + 1),
        value,
      },
    ]);

    setValues("");
  };
  const onDeleteStore = (ID: string) => {
    setValueList((item) => item.filter((item2) => item2.ID !== ID));
  };
  useEffect(() => {
    if (update) {
      if (initalData) {
        setID(initalData.variantsID);
        setCategoryName(initalData.variantsName);
        setDescription(initalData.description);
        setSortingOrder(String(initalData.sortingOrder));
        setValueList(
          initalData.varientList.map((item, index) => ({
            ID: String(index + 1),
            value: item.value,
          })),
        );
      }
    } else {
      setCategoryName("");
      setDescription("");
      setValueList([]);
      setID("");
    }
  }, [initalData, update]);
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <InputFieldGeneric
            label="Variants Name"
            type="text"
            required={true}
            placeholder="Enter Variants Name"
            SateChange={CategoryName}
            setSateChange={setCategoryName}
            disabled={false}
          />
          {update && (
            <InputFieldGeneric
              label="Sorting Order"
              type="text"
              required={true}
              placeholder="Enter Sorting Order"
              SateChange={SortingOrder}
              setSateChange={setSortingOrder}
              disabled={false}
            />
          )}
          <div className="flex gap-2">
            <div className="w-full">
              <InputFieldGeneric
                label="Variants Value"
                type="text"
                required={true}
                placeholder="Enter Variants Value"
                SateChange={Values}
                setSateChange={setValues}
                disabled={false}
              />
            </div>
            <div className="mt-7">
              <button
                onClick={() => AddRecord(Values)}
                title="Add Unit"
                className="px-2 py-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded-md shadow-md"
              >
                <Plus />
              </button>
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
        <div className="w-full overflow-x-auto overflow-y-auto bg-white rounded-lg shadow max-h-80">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {valueList.map((store, index) => (
                <tr key={store.ID} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {store.value}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => onDeleteStore(store.ID)}
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
