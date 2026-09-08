import RegionGetApi from "@/app/api/Controller/AdminController/Shipment/Region/RegionGet";
import ZoneGetApi from "@/app/api/Controller/AdminController/Shipment/Zone/ZoneGet";
import { countryList } from "@/app/api/Types/Shipment/Country";
import {
  RegionGetListResposne,
  regionlist,
} from "@/app/api/Types/Shipment/Region";
import { ZoneGetListResposne, zonelist } from "@/app/api/Types/Shipment/Zone";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  setDelete: (data: boolean) => void;
  update: (data: boolean) => void;
  setID: (data: string) => void;
  zoneListRecord: (data: zonelist[]) => void;
  zoneListnewRecord: zonelist[];
  zoneModifyListRecord: (data: zonelist) => void;
  onShowMessage: (message: string, type: "success" | "error") => void;
  countryData: countryList[];
}
export default function GetZoneList({
  update,
  countryData,
  zoneListRecord,
  setID,
  zoneModifyListRecord,
  zoneListnewRecord,
  setDelete,
}: propsForAddRegion) {
  const [isloading, setisLoading] = useState(false);
  const [optionList, setOptionList] = useState<countryList[]>([]);
  const [regionList, setRegionList] = useState<regionlist[]>([]);
  const [zoneList, setzoneList] = useState<zonelist[]>([]);
  const [countryID, setCountryID] = useState("");

  const [countryName, setCountryName] = useState("");
  const [RegionID, setRegionID] = useState("");
  const [regionName, setRegionName] = useState("");

  useEffect(() => {
    if (zoneListnewRecord) {
      setzoneList(zoneListnewRecord);
    }
  }, [zoneListnewRecord]);

  const RegionGet = async () => {
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
  };

  const ZoneGet = async () => {
    try {
      setisLoading(true);
      if (!countryID) return alert("Please Fill in Filed with *");
      else {
        const token = localStorage.getItem("adminToken");
        const response = await ZoneGetApi(RegionID, String(token));
        if (response.status == 200) {
          const data = response.data as ZoneGetListResposne;
          setzoneList(data.zonelist);
        } else {
          setzoneList([]);
        }
      }
    } finally {
      setisLoading(false);
    }
  };

  const fetchData = (ID: string) => {
    const data = zoneList.find((item) => item.zoneID === ID);
    if (data) {
      zoneModifyListRecord(data);
      update(true);
    }
  };
  useEffect(() => {
    if (countryID) {
      RegionGet();
    }
  }, [countryID]);

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
      <div className="mb-2">
        <DropDownList
          label="Region "
          placeholder="Enter Region"
          required={true}
          value={regionName}
          filedID={setRegionID}
          onChange={setRegionName}
          options={regionList.map((item) => ({
            label: item.regionName,
            value: item.regionName,
            id: item.regionID,
          }))}
        />
      </div>
      <div className="flex justify-end mb-2">
        <ActionButton
          text="Search "
          update={false}
          loading={false}
          loadingtext="Searching..."
          onClick={() => ZoneGet()}
          disabled={false}
        />
      </div>

      <div className="space-y-4">
        {isloading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : zoneList.length === 0 ? (
          <div className="flex justify-center py-10">
            <span className="text-lg font-semibold text-gray-500">
              No Record Found
            </span>
          </div>
        ) : (
          zoneList.map((item) => (
            <div
              key={item.zoneID}
              className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              {/* Left Side */}
              <div className="flex items-center gap-3">
                <div className="w-2 h-10 bg-blue-500 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800">
                    {item.zoneName}
                  </span>
                  {/* <span className="text-sm text-gray-500">
                          Region ID: {item.regionID}
                        </span> */}
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchData(item.zoneID)}
                  className="p-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                >
                  <Pencil />
                </button>

                <button
                  onClick={() => {
                    setID(item.zoneID);
                    setDelete(true);
                    zoneListRecord(zoneList);
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
