import UnitGetApi from "@/app/api/Controller/OnlineSellerController/Unit/GetUnit";
import { storeList } from "@/app/api/Types/AdminSetting/Store/Store";
import {
  RespopnseUInitListGet,
  unitList,
} from "@/app/api/Types/OnlineSetting/Unit/Unit";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
interface StoreList {
  storeID: string;
  storeName: string;
}
interface propsForAddRegion {
  setDelete: (data: boolean) => void;
  update: (data: boolean) => void;
  setID: (data: string) => void;
  storeList: storeList[];
  unitDataList: (data: unitList[]) => void;
  UnitDataListReturn: unitList[];
  UnitModifyList: (data: unitList) => void;
  onShowMessage: (message: string, type: "success" | "error") => void;
}
export default function GetUnitList({
  setDelete,
  update,
  setID,
  unitDataList,
  UnitModifyList,
  UnitDataListReturn,
  storeList,
}: propsForAddRegion) {
  const [isloading, setisLoading] = useState(false);
  const [StoreID, setStoreID] = useState("");
  const [StoreName, setStoreName] = useState("");
  const [UnitList, setUnitList] = useState<unitList[]>([]);

  useEffect(() => {
    if (UnitDataListReturn) {
      setUnitList(UnitDataListReturn);
    }
  }, [UnitDataListReturn]);

  const CategoryGet = async (ID: string) => {
    if (!ID) return alert("Please Select a store!");
    try {
      setisLoading(true);

      const token = localStorage.getItem("OnlineSellerToken");
      const response = await UnitGetApi(ID, String(token));
      if (response.status == 200) {
        const data = response.data as RespopnseUInitListGet;
        setUnitList(data.unitList);
      } else {
        setUnitList([]);
      }
    } finally {
      setisLoading(false);
    }
  };
  const fetchData = (ID: string) => {
    const data = UnitList.find((item) => item.unitID === ID);
    if (data) {
      UnitModifyList(data);
      update(true);
    }
  };
  return (
    <>
      <div className="mb-2">
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
      </div>
      <div className="flex justify-end">
        <ActionButton
          text="Search"
          update={false}
          loading={false}
          loadingtext="Fetching..."
          onClick={() => CategoryGet(StoreID)}
          disabled={false}
        />
      </div>
      <div className="space-y-4">
        {isloading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : UnitList.length === 0 ? (
          <div className="flex justify-center py-10">
            <span className="text-lg font-semibold text-gray-500">
              No Record Found
            </span>
          </div>
        ) : (
          UnitList.map((item) => (
            <div
              key={item.unitID}
              className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              {/* Left Side */}
              <div className="flex items-center gap-3">
                <div className="w-2 h-10 bg-blue-500 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800">
                    {item.unitName}
                  </span>
                  <span className="text-sm text-gray-500">
                    Abbreviation: {item.abbreviation}
                  </span>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchData(item.unitID)}
                  className="p-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                >
                  <Pencil />
                </button>

                <button
                  onClick={() => {
                    setID(item.unitID);
                    setDelete(true);
                    unitDataList(UnitList);
                  }}
                  className="p-2 text-red-600 border border-red-600 rounded hover:bg-red-50 transition"
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
