import RegionDeleteApi from "@/app/api/Controller/AdminController/Shipment/Region/DeleteRegion";
import RegionGetApi from "@/app/api/Controller/AdminController/Shipment/Region/RegionGet";
import {
  RegionGetListResposne,
  regionlist,
} from "@/app/api/Types/Shipment/Region";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface countryList {
  countryID: string;
  countryName: string;
}

interface propsForAddRegion {
  setDelete: (data: boolean) => void;
  update: (data: boolean) => void;
  setID: (data: string) => void;
  RegionList: (data: regionlist[]) => void;
  RegionnewList: regionlist[];
  RegionModifyList: (data: regionlist) => void;
  onShowMessage: (message: string, type: "success" | "error") => void;
  countryData: countryList[];
}

export default function GetRegionList({
  countryData,
  setID,
  setDelete,
  RegionList,
  RegionnewList,
  RegionModifyList,
  update,
}: propsForAddRegion) {
  const [isloading, setisLoading] = useState(false);
  const [countryID, setCountryID] = useState("");
  const [countryName, setCountryName] = useState("");
  const [optionList, setOptionList] = useState<countryList[]>([]);
  const [regionList, setRegionList] = useState<regionlist[]>([]);

  useEffect(() => {
    if (RegionnewList) {
      setRegionList(RegionnewList);
    }
  }, [RegionnewList]);

  const RegionGet = async () => {
    try {
      setisLoading(true);
      if (!countryID) return alert("Please Fill in Filed with *");
      else {
        const token = localStorage.getItem("adminToken");
        const response = await RegionGetApi(countryID, String(token));
        if (response.status == 200) {
          const data = response.data as RegionGetListResposne;
          setRegionList(data.regionlist);
        } else {
          setRegionList([]);
        }
      }
    } finally {
      setisLoading(false);
    }
  };

  const fetchData = (ID: string) => {
    const data = regionList.find((item) => item.regionID === ID);
    if (data) {
      RegionModifyList(data);
      update(true);
    }
  };

  return (
    <>
      <div className="mb-2">
        <DropDownList
          label="Country "
          placeholder="Enter Country"
          required={true}
          value={countryName}
          filedID={setCountryID}
          onChange={setCountryName}
          options={countryData.map((item) => ({
            label: item.countryName,
            value: item.countryName,
            id: item.countryID,
          }))}
        />
      </div>
      <div className="flex justify-end mb-2">
        <ActionButton
          text="Search "
          update={false}
          loading={false}
          loadingtext="Searching..."
          onClick={() => RegionGet()}
          disabled={false}
        />
      </div>
      <div className="space-y-4">
        {isloading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : regionList.length === 0 ? (
          <div className="flex justify-center py-10">
            <span className="text-lg font-semibold text-gray-500">
              No Record Found
            </span>
          </div>
        ) : (
          regionList.map((item) => (
            <div
              key={item.regionID}
              className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              {/* Left Side */}
              <div className="flex items-center gap-3">
                <div className="w-2 h-10 bg-blue-500 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800">
                    {item.regionName}
                  </span>
                  {/* <span className="text-sm text-gray-500">
                    Region ID: {item.regionID}
                  </span> */}
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchData(item.regionID)}
                  className="p-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                >
                  <Pencil />
                </button>

                <button
                  onClick={() => {
                    setID(item.regionID);
                    setDelete(true);
                    RegionList(regionList);
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
