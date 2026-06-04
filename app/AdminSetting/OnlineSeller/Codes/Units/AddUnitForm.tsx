import UnitAddApi from "@/app/api/Controller/OnlineSellerController/Unit/AddUnits";
import UnitGetApi from "@/app/api/Controller/OnlineSellerController/Unit/GetUnit";
import UnitModifyApi from "@/app/api/Controller/OnlineSellerController/Unit/ModifyUnit";
import { storeList } from "@/app/api/Types/AdminSetting/Store/Store";
import { unitList } from "@/app/api/Types/OnlineSetting/Unit/Unit";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { useEffect, useState } from "react";

interface unitProps {
  update: boolean;
  onShowMessage: (message: string, type: "success" | "error") => void;
  initalData?: unitList;
  storeList: storeList[];
}
export default function AddUnitForm({
  storeList,
  onShowMessage,
  initalData,
  update,
}: unitProps) {
  const [UnitName, setUnitName] = useState("");
  const [Abbreviation, setAbbreviation] = useState("");
  const [StoreID, setStoreID] = useState("");
  const [StoreName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");

  const UnitAdd = async () => {
    try {
      setLoading(true);
      if (!UnitName || !StoreID) return alert("Please Fill in Filed with *");
      else {
        const formData = {
          unitName: UnitName,
          storeID: StoreID,
          abbreviation: Abbreviation,
          description: description,
        };
        const token = localStorage.getItem("OnlineSellerToken");
        const response = await UnitAddApi(formData, String(token));
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
  const UnitModify = async () => {
    try {
      setLoading(true);
      if (!UnitName || !StoreID || !ID)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          unitID: ID,
          unitName: UnitName,
          storeID: StoreID,
          abbreviation: Abbreviation,
          description: description,
        };
        const token = localStorage.getItem("OnlineSellerToken");
        const response = await UnitModifyApi(formData, String(token));
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
        setUnitName(initalData.unitName);
        setAbbreviation(initalData.abbreviation);
        setDescription(initalData.description);
        setID(initalData.unitID);
        setStoreName(initalData.storeName);
        setStoreID(initalData.storeID);
      }
    } else {
      setUnitName("");
      setAbbreviation("");
      setDescription("");
      setID("");
      setStoreName("");
      setStoreID("");
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
            label="Unit Name"
            type="text"
            required={false}
            placeholder="Enter Unit Name"
            SateChange={UnitName}
            setSateChange={setUnitName}
            disabled={false}
          />
          <InputFieldGeneric
            label="Abbreviation"
            type="text"
            required={false}
            placeholder="Enter abbreviation"
            SateChange={Abbreviation}
            setSateChange={setAbbreviation}
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
                onClick={() => UnitModify()}
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
                onClick={() => UnitAdd()}
                disabled={false}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
