import GetCountryApi from "@/app/api/Controller/AdminController/Shipment/Country/CountryGet";
import StoreSellerGetApi from "@/app/api/Controller/AdminController/Store/GetStoreSeller";
import CategoryGetApi from "@/app/api/Controller/OnlineSellerController/Category/CategoryGet";
import FurtherGetApi from "@/app/api/Controller/OnlineSellerController/FurtherSubCategory/GetFurtherCategory";
import ProductModifyApi from "@/app/api/Controller/OnlineSellerController/Product/ModifyProduct/ModifyProduct";

import CategorySubGetApi from "@/app/api/Controller/OnlineSellerController/SubCategory/GetSubCategory";
import {
  ResponseGetStore,
  storeList,
} from "@/app/api/Types/AdminSetting/Store/Store";
import {
  CategoryList,
  ResponseCategory,
} from "@/app/api/Types/OnlineSetting/Category/Category";
import {
  furtherSubCategoryList,
  RespopnseFurtherListGet,
  unitListSub,
} from "@/app/api/Types/OnlineSetting/FurtherCategory/FurtherCategory";
import { productList } from "@/app/api/Types/OnlineSetting/Product/Product";
import {
  ResponseSubCategory,
  subCategoryList,
} from "@/app/api/Types/OnlineSetting/SubCategory/SubCategory";
import {
  countryList,
  GetCountryListResponse,
} from "@/app/api/Types/Shipment/Country";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import GenericCheckbox from "@/app/ui/CheckBox/CheckBox";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import GenericRadio from "@/app/ui/RadioButton/RadioButton";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

interface MoidifyProductBasicInfo {
  initalData?: productList;
  refreshevent: (data: boolean) => void;
  onShowMessage: (message: string, type: "success" | "error") => void;
}

export default function ModifyBasicInfo({
  initalData,
  onShowMessage,
  refreshevent,
}: MoidifyProductBasicInfo) {
  const [ProductName, setProductName] = useState("");
  const [ShortCode, setShortCode] = useState("");
  const [Discount, setDiscount] = useState("");
  const [Weight, setWeight] = useState("");
  const [Depth, setDepth] = useState("");
  const [Width, setWidth] = useState("");
  const [Height, setHeight] = useState("");
  const [Threshold, setThreshold] = useState("");
  const [FeaturedProduct, setFeaturedProduct] = useState("Yes");
  const [FeaturedProduct2, setFeaturedProduct2] = useState("ShowAllCountry");
  const [description, setDescription] = useState("");
  const [checked, setChecked] = useState(false);
  const [storeSale, setStoreSale] = useState("Both");
  //CategoryStates
  const [conuntryDataListShowCountry, setConuntryDataListShowCountry] =
    useState<countryList[]>([]);
  const [conuntryDataListHideCountry, setConuntryDataListHideCountry] =
    useState<countryList[]>([]);
  const [CategoryName, setCategoryName] = useState("");
  const [CategoryID, setCategoryID] = useState("");
  const [CategoryList, setCategoryList] = useState<CategoryList[]>([]);
  const [SubCategoryName, setSubCategoryName] = useState("");
  const [SubCategoryID, setSubCategoryID] = useState("");
  const [SubCategoryList, setSubCategoryList] = useState<subCategoryList[]>([]);
  const [furtherSubCategoryName, setfurtherSubCategoryName] = useState("");
  const [furtherSubCategoryID, setfurtherSubCategoryID] = useState("");
  const [FurtherSubCategoryList, setFurtherSubCategoryList] = useState<
    furtherSubCategoryList[]
  >([]);
  const [StoreName, setStoreName] = useState("");
  const [storeID, setStoreID] = useState("");
  const [StoreList, setStoreList] = useState<storeList[]>([]);
  const [UnitName, setUnitName] = useState("");
  const [UnitID, setUnitID] = useState("");
  const [unitList, setunitList] = useState<unitListSub[]>([]);
  const [countryData, setCountryData] = useState<countryList[]>([]);
  const [countryName, setCountryName] = useState("");
  const [countryID, setCountryID] = useState("");
  const [ID, setID] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initalData) return;

    const loadData = async () => {
      setID(initalData.productID);
      setProductName(initalData.productName ?? "");
      setShortCode(initalData.shortCode ?? "");
      setDiscount(String(initalData.discount ?? ""));
      setWeight(String(initalData.weight ?? ""));
      setDepth(String(initalData.depth ?? ""));
      setWidth(String(initalData.width ?? ""));
      setHeight(String(initalData.height ?? ""));
      setThreshold(String(initalData.threshold ?? ""));

      //   // Featured Product
      setFeaturedProduct(initalData.feturedProduct ? "Yes" : "No");

      setDescription(initalData.description ?? "");
      setChecked(initalData.isStock);
      setStoreSale(initalData.storeSale ?? "Both");

      // Country Display Mode
      setFeaturedProduct2(
        initalData.showinAllCountry
          ? "ShowAllCountry"
          : initalData.showinCountry
            ? "ShowCountry"
            : initalData.notShowinCountry
              ? "HideCountry"
              : "ShowAllCountry",
      );

      // Countries
      setConuntryDataListShowCountry(
        initalData.countriesAllowedList?.map((item) => ({
          countryID: item.countryID,
          countryName: item.countryName,
        })) ?? [],
      );

      setConuntryDataListHideCountry(
        initalData.countriesNotAllowedList?.map((item) => ({
          countryID: item.countryID,
          countryName: item.countryName,
        })) ?? [],
      );

      // Load dropdown data
      await getStores();
      await CategoryGet();
      await SubCategoryGet(initalData.categoryID);
      await FurtherSubCategoryGet(initalData.subCategoryID);

      // Set selected values
      setStoreID(initalData.storeID ?? "");
      setStoreName(initalData.storeName ?? "");

      setCategoryID(initalData.categoryID ?? "");
      setCategoryName(initalData.categoryName ?? "");

      setSubCategoryID(initalData.subCategoryID ?? "");
      setSubCategoryName(initalData.subCategoryName ?? "");

      setfurtherSubCategoryID(initalData.subCategoryDetailID ?? "");
      setfurtherSubCategoryName(initalData.furtherSubCategoryName ?? "");

      setUnitID(initalData.unitID ?? "");
      setUnitName(initalData.unitName ?? "");
    };

    loadData();
  }, [initalData]);
  const getCountries = async () => {
    const token = localStorage.getItem("OnlineSellerToken");
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
    const token = localStorage.getItem("OnlineSellerToken");
    const response = await CategoryGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as ResponseCategory;
      setCategoryList(data.categoryList);
    } else {
      setCategoryList([]);
    }
  };

  const SubCategoryGet = async (ID: string) => {
    const token = localStorage.getItem("OnlineSellerToken");
    const response = await CategorySubGetApi(ID, String(token));
    if (response.status == 200) {
      const data = response.data as ResponseSubCategory;
      setSubCategoryList(data.subCategoryList);
    } else {
      setSubCategoryList([]);
    }
  };

  const FurtherSubCategoryGet = async (ID: string) => {
    const token = localStorage.getItem("OnlineSellerToken");
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
    const token = localStorage.getItem("OnlineSellerToken");
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

  const modifyProductInfo = async () => {
    try {
      setLoading(true);

      const formData = {
        productID: ID,
        storeID: storeID,
        isStock: checked,
        supplierID: "",
        invoiceNo: "",
        purchaseDate: new Date().toISOString().split("T")[0],
        totalBill: 0,
        amountPaid: 0,
        adjustments: 0,
        categoryID: CategoryID,
        unitID: UnitID,
        productName: ProductName,
        subCategoryDetailID: furtherSubCategoryID,
        subCategoryID: SubCategoryID,
        storeSale: storeSale,
        discount: Number(Discount),
        threshold: Number(Threshold),
        showinAllCountry:
          FeaturedProduct2 === "ShowAllCountry" ? "true" : "false",
        feturedProduct: FeaturedProduct === "Yes" ? true : false,
        showinCountry: FeaturedProduct2 === "ShowCountry" ? "true" : "false",
        notShowinCountry: FeaturedProduct2 === "HideCountry" ? "true" : "false",
        description: description,
        width: Number(Width),
        height: Number(Height),
        depth: Number(Depth),
        weight: Number(Weight),
        listCountry:
          FeaturedProduct2 === "ShowAllCountry"
            ? []
            : FeaturedProduct2 === "ShowCountry"
              ? conuntryDataListShowCountry.map((item) => ({
                  countryID: item.countryID,
                  countryName: item.countryName,
                }))
              : FeaturedProduct2 === "HideCountry"
                ? conuntryDataListHideCountry.map((item) => ({
                    countryID: item.countryID,
                    countryName: item.countryName,
                  }))
                : [],
        listImage: [],
        listVarient: [],
      };
      const token = localStorage.getItem("OnlineSellerToken");
      const response = await ProductModifyApi(formData, String(token));
      if (response.status == 200) {
        onShowMessage(response.data.message, "success");
        refreshevent(true);
      } else {
        onShowMessage(response.data.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 flex gap-6">
          {/* First Section */}
          <div className="flex-1">
            <div>
              <label className="block mb-2">Store Sale</label>
              <div className="flex gap-5">
                <GenericRadio
                  label="Both"
                  name="storeSale"
                  value="Both"
                  checked={storeSale === "Both"}
                  onChange={() => setStoreSale("Both")}
                />
                <GenericRadio
                  label="Online Store"
                  name="storeSale"
                  value="OnlineStore"
                  checked={storeSale === "OnlineStore"}
                  onChange={() => setStoreSale("OnlineStore")}
                />
                <GenericRadio
                  label="Offline Store"
                  name="storeSale"
                  value="OfflineStore"
                  checked={storeSale === "OfflineStore"}
                  onChange={() => setStoreSale("OfflineStore")}
                />
              </div>
            </div>

            <div className="mt-2">
              <label className="block mb-2">Featured Product</label>
              <div className="flex gap-5">
                <GenericRadio
                  label="Yes"
                  name="Featured"
                  value="Yes"
                  checked={FeaturedProduct === "Yes"}
                  onChange={() => setFeaturedProduct("Yes")}
                />
                <GenericRadio
                  label="No"
                  name="Featured"
                  value="No"
                  checked={FeaturedProduct === "No"}
                  onChange={() => setFeaturedProduct("No")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputFieldGeneric
                label="Product Name"
                type="text"
                required={true}
                placeholder="Enter Product Name"
                SateChange={ProductName}
                setSateChange={setProductName}
                disabled={false}
              />
              <InputFieldGeneric
                label="ShortCode"
                type="text"
                required={true}
                placeholder="Enter ShortCode"
                SateChange={ShortCode}
                setSateChange={setShortCode}
                disabled={false}
              />
              <InputFieldGeneric
                label="Discount"
                type="number"
                required={true}
                placeholder="Enter Discount"
                SateChange={Discount}
                setSateChange={setDiscount}
                disabled={false}
              />
              <InputFieldGeneric
                label="Threshold"
                type="number"
                required={true}
                placeholder="Enter Threshold"
                SateChange={Threshold}
                setSateChange={setThreshold}
                disabled={false}
              />
              <InputFieldGeneric
                label="Weight"
                type="number"
                required={true}
                placeholder="Enter Weight"
                SateChange={Weight}
                setSateChange={setWeight}
                disabled={false}
              />
              <InputFieldGeneric
                label="Height"
                type="number"
                required={true}
                placeholder="Enter Height"
                SateChange={Height}
                setSateChange={setHeight}
                disabled={false}
              />
              <InputFieldGeneric
                label="Depth"
                type="number"
                required={true}
                placeholder="Enter Depth"
                SateChange={Depth}
                setSateChange={setDepth}
                disabled={false}
              />
              <InputFieldGeneric
                label="Width"
                type="number"
                required={true}
                placeholder="Enter Width"
                SateChange={Width}
                setSateChange={setWidth}
                disabled={false}
              />
            </div>

            <TextAreaFieldGeneric
              label="Description"
              required={false}
              placeholder="Enter Description"
              SateChange={description}
              setSateChange={setDescription}
              disabled={false}
            />
            <GenericCheckbox
              label="Show Stock"
              checked={checked}
              onChange={setChecked}
            />
          </div>

          {/* Second Section */}
          <div className="flex-1">
            <div className="mb-2">
              <label className="block mb-2">Country Display</label>

              <div className="flex gap-5">
                <GenericRadio
                  label="Show All Country"
                  name="ShowAllCountry"
                  value="ShowAllCountry"
                  checked={FeaturedProduct2 === "ShowAllCountry"}
                  onChange={setFeaturedProduct2}
                />

                <GenericRadio
                  label="Show Country"
                  name="ShowCountry"
                  value="ShowCountry"
                  checked={FeaturedProduct2 === "ShowCountry"}
                  onChange={() => {
                    setFeaturedProduct2("ShowCountry");
                    setConuntryDataListHideCountry([]);
                  }}
                />
                <GenericRadio
                  label="Hide Country"
                  name="HideCountry"
                  value="HideCountry"
                  checked={FeaturedProduct2 === "HideCountry"}
                  onChange={() => {
                    setFeaturedProduct2("HideCountry");
                    setConuntryDataListShowCountry([]);
                  }}
                />
              </div>
            </div>
            {FeaturedProduct2 === "ShowCountry" && (
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
            {FeaturedProduct2 === "HideCountry" && (
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
        <div className="flex justify-end p-2">
          <ActionButton
            text="Save"
            update={false}
            size={true}
            loading={loading}
            loadingtext="Saving..."
            onClick={() => modifyProductInfo()}
            disabled={false}
          />
        </div>
      </div>
    </>
  );
}
