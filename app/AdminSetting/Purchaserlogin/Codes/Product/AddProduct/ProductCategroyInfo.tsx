// ProductCategroyInfo.tsx
import GetCountryApi from "@/app/api/Controller/AdminController/Shipment/Country/CountryGet";
import StoreSellerGetApi from "@/app/api/Controller/AdminController/Store/GetStoreSeller";
import CategoryGetApi from "@/app/api/Controller/PurchaserLogin/Codes/Category/CategoryGet";
import FurtherGetApi from "@/app/api/Controller/PurchaserLogin/Codes/FurtherSubCategory/GetFurtherCategory";
import CategorySubGetApi from "@/app/api/Controller/PurchaserLogin/Codes/SubCategory/GetSubCategory";
import {
  ResponseGetStore,
  storeList,
} from "@/app/api/Types/AdminSetting/Store/Store";
import {
  CategoryList,
  ResponseCategory,
} from "@/app/api/Types/PurchaserLogin/Codes/Category/Category";
import {
  furtherSubCategoryList,
  RespopnseFurtherListGet,
  unitListSub,
} from "@/app/api/Types/PurchaserLogin/Codes/FurtherCategory/FurtherCategory";
import {
  ResponseSubCategory,
  subCategoryList,
} from "@/app/api/Types/PurchaserLogin/Codes/SubCategory/SubCategory";
import { unitList } from "@/app/api/Types/PurchaserLogin/Codes/Unit/Unit";
import {
  countryList,
  GetCountryListResponse,
} from "@/app/api/Types/Shipment/Country";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import GenericRadio from "@/app/ui/RadioButton/RadioButton";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductCategoryInfoProps {
  // Country Display
  FeaturedProduct: string;
  setFeaturedProduct: (value: string) => void;

  // Country Lists
  conuntryDataListShowCountry: countryList[];
  setConuntryDataListShowCountry: (value: countryList[]) => void;
  conuntryDataListHideCountry: countryList[];
  setConuntryDataListHideCountry: (value: countryList[]) => void;

  // Category
  CategoryName: string;
  setCategoryName: (value: string) => void;
  CategoryID: string;
  setCategoryID: (value: string) => void;
  CategoryList: CategoryList[];
  setCategoryList: (value: CategoryList[]) => void;

  // Sub Category
  SubCategoryName: string;
  setSubCategoryName: (value: string) => void;
  SubCategoryID: string;
  setSubCategoryID: (value: string) => void;
  SubCategoryList: subCategoryList[];
  setSubCategoryList: (value: subCategoryList[]) => void;

  // Further Sub Category
  furtherSubCategoryName: string;
  setfurtherSubCategoryName: (value: string) => void;
  furtherSubCategoryID: string;
  setfurtherSubCategoryID: (value: string) => void;
  FurtherSubCategoryList: furtherSubCategoryList[];
  setFurtherSubCategoryList: (value: furtherSubCategoryList[]) => void;

  // Unit
  UnitName: string;
  setUnitName: (value: string) => void;
  UnitID: string;
  setUnitID: (value: string) => void;
  unitList: unitListSub[];
  setunitList: (value: unitListSub[]) => void;

  // Country Data
  countryData: countryList[];
  setCountryData: (value: countryList[]) => void;

  // Temporary form states
  countryName: string;
  setCountryName: (value: string) => void;
  countryID: string;
  setCountryID: (value: string) => void;

  // Temporary Country states
  StoreName: string;
  setStoreName: (value: string) => void;
  StoreID: string;
  setStoreID: (value: string) => void;
  StoreList: storeList[];
  setStoreList: (value: storeList[]) => void;
}

export default function ProductCategroyInfo({
  FeaturedProduct,
  setFeaturedProduct,
  conuntryDataListShowCountry,
  setConuntryDataListShowCountry,
  conuntryDataListHideCountry,
  setConuntryDataListHideCountry,
  CategoryName,
  setCategoryName,
  CategoryID,
  setCategoryID,
  CategoryList,
  setCategoryList,
  SubCategoryName,
  setSubCategoryName,
  SubCategoryID,
  setSubCategoryID,
  SubCategoryList,
  setSubCategoryList,
  furtherSubCategoryName,
  setfurtherSubCategoryName,
  furtherSubCategoryID,
  setfurtherSubCategoryID,
  FurtherSubCategoryList,
  setFurtherSubCategoryList,
  UnitName,
  setUnitName,
  UnitID,
  setUnitID,
  unitList,
  setunitList,
  countryData,
  setCountryData,
  countryName,
  setCountryName,
  countryID,
  setCountryID,
  StoreID,
  StoreName,
  setStoreID,
  setStoreName,
  StoreList,
  setStoreList,
}: ProductCategoryInfoProps) {
  const getCountries = async () => {
    const token = localStorage.getItem("PurchaserLoginToken");
    const response = await GetCountryApi(String(token));
    if (response.status === 200) {
      const data = response.data as GetCountryListResponse;
      setCountryData(data.countryList);
    } else {
      setCountryData([]);
    }
  };

  const AddCountryShowListDatainTable = (ID: string) => {
    if (!ID) return alert("Please Select a Country");
    const storeToAdd = countryData.find((item) => item.countryID === ID);

    if (!storeToAdd) {
      alert("Country not found");
      setCountryName("");
      setCountryID("");
      return;
    }

    const exists = conuntryDataListShowCountry.some(
      (item) => item.countryID === ID,
    );

    if (exists) {
      alert("Record Already Exists in Table");
      setCountryName("");
      setCountryID("");
      return;
    } else {
      setCountryName("");
      setCountryID("");
      setConuntryDataListShowCountry([
        ...conuntryDataListShowCountry,
        storeToAdd,
      ]);
    }
  };

  const AddCountryHideListDatainTable = (ID: string) => {
    if (!ID) return alert("Please Select a Country");
    const storeToAdd = countryData.find((item) => item.countryID === ID);

    if (!storeToAdd) {
      alert("Country not found");
      setCountryName("");
      setCountryID("");
      return;
    }

    const exists = conuntryDataListHideCountry.some(
      (item) => item.countryID === ID,
    );

    if (exists) {
      alert("Record Already Exists in Table");
      setCountryName("");
      setCountryID("");
      return;
    } else {
      setCountryName("");
      setCountryID("");
      setConuntryDataListHideCountry([
        ...conuntryDataListHideCountry,
        storeToAdd,
      ]);
    }
  };

  const onDeleteCountryShow = (ID: string) => {
    const storeToAdd = conuntryDataListShowCountry.filter(
      (item) => item.countryID !== ID,
    );
    if (storeToAdd) {
      setConuntryDataListShowCountry(storeToAdd);
    } else {
      alert("Could Not Delete Country.");
    }
  };

  const onDeleteStoreCountryHide = (ID: string) => {
    const storeToAdd = conuntryDataListHideCountry.filter(
      (item) => item.countryID !== ID,
    );
    if (storeToAdd) {
      setConuntryDataListHideCountry(storeToAdd);
    } else {
      alert("Could Not Delete Country.");
    }
  };

  const CategoryGet = async () => {
    const token = localStorage.getItem("PurchaserLoginToken");
    const response = await CategoryGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as ResponseCategory;
      setCategoryList(data.categoryList);
    } else {
      setCategoryList([]);
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

  const FurtherSubCategoryGet = async (ID: string) => {
    const token = localStorage.getItem("PurchaserLoginToken");
    const response = await FurtherGetApi(ID, String(token));
    if (response.status == 200) {
      const data = response.data as RespopnseFurtherListGet;
      setFurtherSubCategoryList(data.furtherSubCategoryList);
      if (data.furtherSubCategoryList.length > 0) {
        setunitList(data.furtherSubCategoryList[0].unitListSub);
      }
    } else {
      setFurtherSubCategoryList([]);
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

  useEffect(() => {
    getStores();
    CategoryGet();
    getCountries();
  }, []);

  useEffect(() => {
    if (CategoryID) {
      SubCategoryGet(CategoryID);
    }
  }, [CategoryID]);

  useEffect(() => {
    if (SubCategoryID) {
      FurtherSubCategoryGet(SubCategoryID);
    }
  }, [SubCategoryID]);

  return (
    <>
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="">
            <div className="mb-2">
              <label className="block mb-2">Country Display</label>

              <div className="flex gap-5">
                <GenericRadio
                  label="Show All Country"
                  name="ShowAllCountry"
                  value="ShowAllCountry"
                  checked={FeaturedProduct === "ShowAllCountry"}
                  onChange={setFeaturedProduct}
                />

                <GenericRadio
                  label="Show Country"
                  name="ShowCountry"
                  value="ShowCountry"
                  checked={FeaturedProduct === "ShowCountry"}
                  onChange={() => {
                    setFeaturedProduct("ShowCountry");
                    setConuntryDataListHideCountry([]);
                  }}
                />
                <GenericRadio
                  label="Hide Country"
                  name="HideCountry"
                  value="HideCountry"
                  checked={FeaturedProduct === "HideCountry"}
                  onChange={() => {
                    setFeaturedProduct("HideCountry");
                    setConuntryDataListShowCountry([]);
                  }}
                />
              </div>
            </div>
            {FeaturedProduct === "ShowCountry" && (
              <div>
                <div className="flex gap-2 mb-2">
                  <DropDownList
                    label="ShowCountry List "
                    placeholder="Enter Country Name"
                    required={true}
                    filedID={setCountryID}
                    value={countryName}
                    onChange={setCountryName}
                    options={countryData.map((item) => ({
                      label: item.countryName,
                      value: item.countryName,
                      id: item.countryID,
                    }))}
                  />
                  <div className="mt-7">
                    <button
                      onClick={() => AddCountryShowListDatainTable(countryID)}
                      title="Add Store"
                      className="px-2 py-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded-md shadow-md"
                    >
                      <Plus />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {conuntryDataListShowCountry.map((item) => (
                    <span
                      key={item.countryID}
                      className="flex items-center justify-between gap-3 bg-green-400 text-white rounded-full px-3 py-1 max-w-full"
                    >
                      <span className="text-sm break-words">
                        {item.countryName}
                      </span>

                      <button
                        onClick={() => onDeleteCountryShow(item.countryID)}
                        className="text-white/80 hover:text-white flex-shrink-0"
                      >
                        <X size={15} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {FeaturedProduct === "HideCountry" && (
              <div>
                <div className="flex gap-2 mb-2">
                  <DropDownList
                    label="HideCountry List "
                    placeholder="Enter Country Name"
                    required={true}
                    filedID={setCountryID}
                    value={countryName}
                    onChange={setCountryName}
                    options={countryData.map((item) => ({
                      label: item.countryName,
                      value: item.countryName,
                      id: item.countryID,
                    }))}
                  />
                  <div className="mt-7">
                    <button
                      onClick={() => AddCountryHideListDatainTable(countryID)}
                      title="Add Store"
                      className="px-2 py-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded-md shadow-md"
                    >
                      <Plus />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {conuntryDataListHideCountry.map((item) => (
                    <span
                      key={item.countryID}
                      className="flex items-center justify-between gap-3 bg-green-400 text-white rounded-full px-3 py-1 max-w-full"
                    >
                      <span className="text-sm break-words">
                        {item.countryName}
                      </span>

                      <button
                        onClick={() => onDeleteStoreCountryHide(item.countryID)}
                        className="text-white/80 hover:text-white flex-shrink-0"
                      >
                        <X size={15} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="mb-2">
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
            </div>
            <div className="mb-2">
              <DropDownList
                label="Category "
                placeholder="Enter Category"
                required={true}
                filedID={setCategoryID}
                value={CategoryName}
                onChange={setCategoryName}
                options={CategoryList.map((item) => ({
                  label: item.categoryName,
                  value: item.categoryName,
                  id: item.categoryID,
                }))}
              />
            </div>
            <div className="mb-2">
              <DropDownList
                label="Sub Category "
                placeholder="Enter Sub Category"
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
            </div>
            <div className="mb-2">
              <DropDownList
                label="Further Sub-Category "
                placeholder="Enter Further Sub-Category "
                required={true}
                filedID={setfurtherSubCategoryID}
                value={furtherSubCategoryName}
                onChange={setfurtherSubCategoryName}
                options={FurtherSubCategoryList.map((item) => ({
                  label: item.name,
                  value: item.name,
                  id: item.subCategoryDetailID,
                }))}
              />
            </div>
            <div className="mb-2">
              <DropDownList
                label="Unit "
                placeholder="Enter Unit"
                required={true}
                filedID={setUnitID}
                value={UnitName}
                onChange={setUnitName}
                options={unitList.map((item) => ({
                  label: item.unitName,
                  value: item.unitName,
                  id: item.unitID,
                }))}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
