// AddProductForm.tsx
import { Check } from "lucide-react";
import { useMemo, useState } from "react";
import ProductBasicInfo from "./AddProduct/ProductBasicInfo";
import ProductCategroyInfo from "./AddProduct/ProductCategroyInfo";
import AddVarientInformation, {
  imagesData,
  listVarient,
  RowData,
  varientAttributes,
} from "./AddProduct/VarientInformation";
import AddProductImage from "./AddProduct/ProductImageInfo";
import PaymnetInfo from "./AddProduct/PaymnetInfo";
import { countryList } from "@/app/api/Types/Shipment/Country";
import { CategoryList } from "@/app/api/Types/PurchaserLogin/Codes/Category/Category";
import { subCategoryList } from "@/app/api/Types/PurchaserLogin/Codes/SubCategory/SubCategory";
import {
  furtherSubCategoryList,
  unitListSub,
} from "@/app/api/Types/PurchaserLogin/Codes/FurtherCategory/FurtherCategory";
import { SupplierListReponse } from "@/app/api/Types/PurchaserLogin/Supplier/supplier";
import { storeList } from "@/app/api/Types/AdminSetting/Store/Store";
import convertImageToWebPWithWatermark from "@/app/api/Controller/MiddleWare/WebConverter";
import { SendDataToApi } from "@/app/api/Controller/MiddleWare/CloudinaryUplaod";
import ProductAddApi from "@/app/api/Controller/PurchaserLogin/Codes/Product/AddProduct";

interface propsForAddRegion {
  images: imagesData[];
  imageRowID: (data: string) => void;
  setImages: (data: File[]) => void;
  showPopupModel: (data: boolean) => void;
  onShowMessage: (message: string, type: "success" | "error") => void;
}
export default function AddProductForm({
  showPopupModel,
  imageRowID,
  images,
  setImages,
  onShowMessage,
}: propsForAddRegion) {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [StoreName, setStoreName] = useState("");
  const [storeID, setStoreID] = useState("");
  const [StoreList, setStoreList] = useState<storeList[]>([]);
  // Define the actual state here in the parent
  const [ProductName, setProductName] = useState("");
  const [ShortCode, setShortCode] = useState("");
  const [Discount, setDiscount] = useState("");
  const [Weight, setWeight] = useState("");
  const [Depth, setDepth] = useState("");
  const [Width, setWidth] = useState("");
  const [Height, setHeight] = useState("");
  const [Threshold, setThreshold] = useState("");
  const [FeaturedProduct, setFeaturedProduct] = useState("Yes");
  const [description, setDescription] = useState("");
  const [checked, setChecked] = useState(false);
  const [storeSale, setStoreSale] = useState("Both");

  //CategoryStates
  const [ShowCountry, setShowCountry] = useState("ShowAllCountry");
  const [conuntryDataListShowCountry, setConuntryDataListShowCountry] =
    useState<countryList[]>([]);
  const [conuntryDataListHideCountry, setConuntryDataListHideCountry] =
    useState<countryList[]>([]);
  const [CategoryName, setCategoryName] = useState("");
  const [CategoryID, setCategoryID] = useState("");
  const [CategoryList, setCategoryList] = useState<CategoryList[]>([]);
  const [combinationList, setCombinationList] = useState<RowData[]>([]);

  const [SubCategoryName, setSubCategoryName] = useState("");
  const [SubCategoryID, setSubCategoryID] = useState("");
  const [SubCategoryList, setSubCategoryList] = useState<subCategoryList[]>([]);
  const [furtherSubCategoryName, setfurtherSubCategoryName] = useState("");
  const [furtherSubCategoryID, setfurtherSubCategoryID] = useState("");
  const [FurtherSubCategoryList, setFurtherSubCategoryList] = useState<
    furtherSubCategoryList[]
  >([]);
  const [UnitName, setUnitName] = useState("");
  const [UnitID, setUnitID] = useState("");
  const [unitList, setunitList] = useState<unitListSub[]>([]);
  const [countryData, setCountryData] = useState<countryList[]>([]);
  const [countryName, setCountryName] = useState("");
  const [countryID, setCountryID] = useState("");

  //Image Component States
  // const [images, setImages] = useState<File[]>([]);
  // const [dragIndex, setDragIndex] = useState<number | null>(null);
  // const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  // const [isDragOver, setIsDragOver] = useState(false);

  //PaymentInfo Component State
  const [PurcahseAdd, setPurcahseAdd] = useState("Yes");
  const [SupplierID, setSupplierID] = useState("");
  const [SupplierName, setSupplierName] = useState("");
  const [supplierList, setSupplierList] = useState<SupplierListReponse[]>([]);
  const [TotalBill, setTotalBill] = useState("");
  const [AmountPaid, setAmountPaid] = useState("");
  const [Adjustment, setAdjustment] = useState("");

  const steps = [
    { number: 1, title: "Product Information" },
    { number: 2, title: "Variant Information" },
    { number: 3, title: "Confirm" },
  ];

  const calculatedTotalBill = combinationList.reduce((sum, item) => {
    return sum + Number(item.costPrice) * Number(item.qty);
  }, 0);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
    }
  };
  const AddProduct = async () => {
    try {
      setLoading(true);
      const listVarient = await Promise.all(
        combinationList.map(async (item) => ({
          attributeList: item.attributeID.map((item2) => ({
            attributeID: item2.values,
          })),
          qty: Number(item.qty),
          costPrice: Number(item.costPrice),
          salePrice: Number(item.salePrice),
          barcode: item.barcode,

          imageUrl:
            item.file.length > 0
              ? await Promise.all(
                  item.file.map(async (file) => {
                    const response = await SendDataToApi(file.file);

                    return {
                      url: response.data,
                    };
                  }),
                )
              : [],
        })),
      );
      const formData = {
        storeID: storeID,
        isStock: checked,
        supplierID: SupplierID,
        invoiceNo: "",
        purchaseDate: new Date().toISOString().split("T")[0],
        totalBill: PurcahseAdd === "Yes" ? Number(TotalBill) : 0,
        amountPaid: PurcahseAdd === "Yes" ? Number(AmountPaid) : 0,
        adjustments: PurcahseAdd === "Yes" ? Number(Adjustment) : 0,
        categoryID: CategoryID,
        unitID: UnitID,
        productName: ProductName,
        subCategoryDetailID: furtherSubCategoryID,
        subCategoryID: SubCategoryID,
        storeSale: storeSale,
        discount: Number(Discount),
        threshold: Number(Threshold),
        showinAllCountry: ShowCountry === "ShowAllCountry" ? "true" : "false",
        feturedProduct: FeaturedProduct === "Yes" ? true : false,
        showinCountry: ShowCountry === "ShowCountry" ? "true" : "false",
        notShowinCountry: ShowCountry === "HideCountry" ? "true" : "false",
        description: description,
        width: Number(Width),
        height: Number(Height),
        depth: Number(Depth),
        weight: Number(Weight),
        listCountry:
          ShowCountry === "ShowAllCountry"
            ? []
            : ShowCountry === "ShowCountry"
              ? conuntryDataListShowCountry.map((item) => ({
                  countryID: item.countryID,
                  countryName: item.countryName,
                }))
              : ShowCountry === "HideCountry"
                ? conuntryDataListHideCountry.map((item) => ({
                    countryID: item.countryID,
                    countryName: item.countryName,
                  }))
                : [],
        listVarient: listVarient,
      };
      //console.log(formData);
      const token = localStorage.getItem("PurchaserLoginToken");
      const response = await ProductAddApi(formData, String(token));
      if (response.status == 200) {
        onShowMessage(response.data.message, "success");
      } else {
        onShowMessage(response.data.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        {/* Stepper Component */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    onClick={() => handleStepClick(step.number)}
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all duration-200 cursor-pointer
                    ${
                      currentStep > step.number
                        ? "bg-blue-500 text-white"
                        : currentStep === step.number
                          ? "bg-blue-600 text-white ring-2 ring-blue-200"
                          : "bg-gray-100 text-gray-400 border border-gray-300"
                    }
                  `}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>

                  <div
                    className={`
                    text-xs mt-2 hidden sm:block
                    ${
                      currentStep >= step.number
                        ? "text-gray-700 font-medium"
                        : "text-gray-400"
                    }
                  `}
                  >
                    {step.title}
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`
                    flex-1 h-px mx-2 transition-all duration-200
                    ${currentStep > step.number ? "bg-blue-300" : "bg-gray-200"}
                  `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mt-2">
              {currentStep === 1 && (
                <div className="flex flex-col lg:flex-row gap-4 w-full">
                  <ProductBasicInfo
                    ProductName={ProductName}
                    setProductName={setProductName}
                    ShortCode={ShortCode}
                    setShortCode={setShortCode}
                    Discount={Discount}
                    setDiscount={setDiscount}
                    Weight={Weight}
                    setWeight={setWeight}
                    Depth={Depth}
                    setDepth={setDepth}
                    Width={Width}
                    setWidth={setWidth}
                    Height={Height}
                    setHeight={setHeight}
                    Threshold={Threshold}
                    setThreshold={setThreshold}
                    FeaturedProduct={FeaturedProduct}
                    setFeaturedProduct={setFeaturedProduct}
                    description={description}
                    setDescription={setDescription}
                    checked={checked}
                    setChecked={setChecked}
                    storeSale={storeSale}
                    setStoreSale={setStoreSale}
                  />

                  <ProductCategroyInfo
                    FeaturedProduct={ShowCountry}
                    setFeaturedProduct={setShowCountry}
                    conuntryDataListShowCountry={conuntryDataListShowCountry}
                    setConuntryDataListShowCountry={
                      setConuntryDataListShowCountry
                    }
                    conuntryDataListHideCountry={conuntryDataListHideCountry}
                    setConuntryDataListHideCountry={
                      setConuntryDataListHideCountry
                    }
                    CategoryName={CategoryName}
                    setCategoryName={setCategoryName}
                    CategoryID={CategoryID}
                    setCategoryID={setCategoryID}
                    CategoryList={CategoryList}
                    setCategoryList={setCategoryList}
                    SubCategoryName={SubCategoryName}
                    setSubCategoryName={setSubCategoryName}
                    SubCategoryID={SubCategoryID}
                    setSubCategoryID={setSubCategoryID}
                    SubCategoryList={SubCategoryList}
                    setSubCategoryList={setSubCategoryList}
                    furtherSubCategoryName={furtherSubCategoryName}
                    setfurtherSubCategoryName={setfurtherSubCategoryName}
                    furtherSubCategoryID={furtherSubCategoryID}
                    setfurtherSubCategoryID={setfurtherSubCategoryID}
                    FurtherSubCategoryList={FurtherSubCategoryList}
                    setFurtherSubCategoryList={setFurtherSubCategoryList}
                    UnitName={UnitName}
                    setUnitName={setUnitName}
                    UnitID={UnitID}
                    setUnitID={setUnitID}
                    unitList={unitList}
                    setunitList={setunitList}
                    countryData={countryData}
                    setCountryData={setCountryData}
                    countryName={countryName}
                    setCountryName={setCountryName}
                    countryID={countryID}
                    setCountryID={setCountryID}
                    setStoreID={setStoreID}
                    setStoreName={setStoreName}
                    setStoreList={setStoreList}
                    StoreID={storeID}
                    StoreName={StoreName}
                    StoreList={StoreList}
                  />
                </div>
              )}
              {currentStep === 2 && (
                <AddVarientInformation
                  furtherSubCategoryID={furtherSubCategoryID}
                  FurtherSubCategoryList={FurtherSubCategoryList}
                  setCombinationList={setCombinationList}
                  combinationList={combinationList}
                  showPopupModel={showPopupModel}
                  setRowID={imageRowID}
                />
              )}
              {/* {currentStep === 3 && (
                <AddProductImage
                  images={images}
                  setImages={setImages}
                  dragIndex={dragIndex}
                  setDragIndex={setDragIndex}
                  hoverIndex={hoverIndex}
                  setHoverIndex={setHoverIndex}
                  isDragOver={isDragOver}
                  setIsDragOver={setIsDragOver}
                />
              )} */}
              {currentStep === 3 && (
                <PaymnetInfo
                  PurcahseAdd={PurcahseAdd}
                  setPurcahseAdd={setPurcahseAdd}
                  SupplierID={SupplierID}
                  setSupplierID={setSupplierID}
                  SupplierName={SupplierName}
                  setSupplierName={setSupplierName}
                  supplierList={supplierList}
                  setSupplierList={setSupplierList}
                  TotalBill={TotalBill}
                  setTotalBill={setTotalBill}
                  AmountPaid={AmountPaid}
                  setAmountPaid={setAmountPaid}
                  Adjustment={Adjustment}
                  setAdjustment={setAdjustment}
                  calculatedTotalBill={calculatedTotalBill}
                />
              )}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-3">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`
              px-5 py-2 rounded-lg font-medium transition-all
              ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
            `}
            >
              Previous
            </button>

            <button
              onClick={() => {
                if (currentStep !== steps.length) {
                  handleNext();
                } else {
                  AddProduct();
                }
              }}
              className={`
              px-5 py-2 rounded-lg font-medium transition-all
              ${
                currentStep === steps.length
                  ? "bg-blue-600 text-white hover:bg-blue-700 "
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }
            `}
            >
              {currentStep === steps.length
                ? loading
                  ? "Saving..."
                  : "Save"
                : "Next"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
