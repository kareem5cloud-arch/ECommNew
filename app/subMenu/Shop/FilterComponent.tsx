import {
  categoryListHomePageCustomerCategroy,
  subCategoryDetailListHomePageCustomerCategroy,
  subCategoryListHomePageCustomerCategroy,
} from "@/app/api/Types/Customer/HomePageCustomerCategroy";
import { Check, X } from "lucide-react";
import { useState } from "react";

interface FilterComponent {
  isFilterOpen: boolean;
  setIsFilterOpen: (data: boolean) => void;
  categroyInfo: categoryListHomePageCustomerCategroy[];
  categoryID: (data: string) => void;
  subCategoryID: (data: string) => void;
  furtherSubCategoryID: (data: string) => void;
}

export default function FilterComponent({
  isFilterOpen,
  setIsFilterOpen,
  categroyInfo,
  categoryID,
  subCategoryID,
  furtherSubCategoryID,
}: FilterComponent) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subSelectedCategory, setSubSelectedCategory] = useState("");
  const [furtherSelectedCategory, setFurtherSelectedCategory] = useState("");
  const [subCategoryList, setSubCategoryList] = useState<
    subCategoryListHomePageCustomerCategroy[]
  >([]);
  const [FurtherSubCategory, setFurtherSubCategory] = useState<
    subCategoryDetailListHomePageCustomerCategroy[]
  >([]);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [showStockOnly, setShowStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);

  const GetSubCategories = (ID: string) => {
    const data = categroyInfo.filter((item) => item.categoryID === ID);
    setSubCategoryList(data[0].subCategoryList);
  };
  const GetFurtherCategories = (ID: string) => {
    const data = subCategoryList.filter((item) => item.subCategoryID === ID);
    setFurtherSubCategory(data[0].subCategoryDetailList);
  };
  return (
    <>
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="bg-white rounded-xl p-5 sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSubCategoryList([]);
                setFurtherSubCategory([]);
                setSubSelectedCategory("");
                setFurtherSelectedCategory("");
                setPriceRange([0, 5000]);
                setShowStockOnly(false);
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Reset All
            </button>
          </div>

          {/* Category Filter */}
          <div className="mb-5">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Category</h4>
            <div className="space-y-1">
              {categroyInfo.map((cat) => (
                <button
                  key={cat.categoryID}
                  onClick={() => {
                    categoryID(cat.categoryID);
                    subCategoryID("");
                    setFurtherSelectedCategory("");
                    GetSubCategories(cat.categoryID);
                    setFurtherSubCategory([]);
                    setSelectedCategory(cat.categoryName);
                  }}
                  className={`flex items-center justify-between w-full text-sm py-1.5 px-2 rounded-lg transition ${
                    selectedCategory === cat.categoryName
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>{cat.categoryName}</span>
                  {selectedCategory === cat.categoryName && (
                    <Check className="w-3 h-3" />
                  )}
                </button>
              ))}
            </div>
          </div>
          {subCategoryList.length > 0 && (
            <div className="mb-5">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Sub-Category
              </h4>
              <div className="space-y-1">
                {subCategoryList.map((cat) => (
                  <button
                    key={cat.subCategoryID}
                    onClick={() => {
                      subCategoryID(cat.subCategoryID);
                      furtherSubCategoryID("");
                      GetFurtherCategories(cat.subCategoryID);
                      setSubSelectedCategory(cat.subCategoryName);
                    }}
                    className={`flex items-center justify-between w-full text-sm py-1.5 px-2 rounded-lg transition ${
                      subSelectedCategory === cat.subCategoryName
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{cat.subCategoryName}</span>
                    {subSelectedCategory === cat.subCategoryName && (
                      <Check className="w-3 h-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          {FurtherSubCategory.length > 0 && (
            <div className="mb-5">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                More Options
              </h4>
              <div className="space-y-1">
                {FurtherSubCategory.map((cat) => (
                  <button
                    key={cat.subCategoryDetailID}
                    onClick={() => {
                      furtherSubCategoryID(cat.subCategoryDetailID);
                      setFurtherSelectedCategory(cat.name);
                    }}
                    className={`flex items-center justify-between w-full text-sm py-1.5 px-2 rounded-lg transition ${
                      furtherSelectedCategory === cat.name
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{cat.name}</span>
                    {furtherSelectedCategory === cat.name && (
                      <Check className="w-3 h-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Price Range */}
          {/* <div className="mb-5">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Price Range
            </h4>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}+</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      {isFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-xl p-5 overflow-y-auto lg:hidden">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button onClick={() => setIsFilterOpen(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile filters content (same as desktop) */}
            <div className="mb-5">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Category
              </h4>
              <div className="space-y-1">
                {categroyInfo.map((cat) => (
                  <button
                    key={cat.categoryID}
                    onClick={() => {
                      categoryID(cat.categoryID);
                      subCategoryID("");
                      furtherSubCategoryID("");
                      GetSubCategories(cat.categoryID);
                      setSelectedCategory(cat.categoryName);
                    }}
                    className={`flex items-center justify-between w-full text-sm py-2 px-2 rounded-lg ${
                      selectedCategory === cat.categoryName
                        ? "bg-gray-100 font-medium"
                        : ""
                    }`}
                  >
                    {cat.categoryName}
                    {selectedCategory === cat.categoryName && (
                      <Check className="w-3 h-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            {subCategoryList.length > 0 && (
              <div className="mb-5">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Sub-Category
                </h4>
                <div className="space-y-1">
                  {subCategoryList.map((cat) => (
                    <button
                      key={cat.subCategoryID}
                      onClick={() => {
                        subCategoryID(cat.subCategoryID);
                        furtherSubCategoryID("");
                        GetFurtherCategories(cat.subCategoryID);
                        setSubSelectedCategory(cat.subCategoryName);
                      }}
                      className={`flex items-center justify-between w-full text-sm py-2 px-2 rounded-lg ${
                        subSelectedCategory === cat.subCategoryName
                          ? "bg-gray-100 font-medium"
                          : ""
                      }`}
                    >
                      {cat.subCategoryName}
                      {subSelectedCategory === cat.subCategoryName && (
                        <Check className="w-3 h-3" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {FurtherSubCategory.length > 0 && (
              <div className="mb-5">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  More Options
                </h4>
                <div className="space-y-1">
                  {FurtherSubCategory.map((cat) => (
                    <button
                      key={cat.subCategoryDetailID}
                      onClick={() => {
                        furtherSubCategoryID(cat.subCategoryDetailID);
                        setFurtherSelectedCategory(cat.name);
                      }}
                      className={`flex items-center justify-between w-full text-sm py-2 px-2 rounded-lg ${
                        furtherSelectedCategory === cat.name
                          ? "bg-gray-100 font-medium"
                          : ""
                      }`}
                    >
                      {cat.name}
                      {furtherSelectedCategory === cat.name && (
                        <Check className="w-3 h-3" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setIsFilterOpen(false)}
              className="w-full mt-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium"
            >
              Apply Filters
            </button>
          </div>
        </>
      )}
    </>
  );
}
