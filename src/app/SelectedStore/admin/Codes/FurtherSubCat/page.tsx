"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import GetCategorySub from "@/api/lib/category/getCategorySub/categorySubGet";
import {
  CategorySub,
  CategorySubApiResponse,
} from "@/api/types/categoryTypes/CategorySub";
import Spinner from "@/component/spinner/page";
import UpdateSubCategory from "@/api/lib/category/updateCategorySub/updateSub";
import DeleteSubCategory from "@/api/lib/category/deleteCategorySub/subCategeoryDelete";
import { UnitApiResponse, UnitList } from "@/api/types/unit/getUnit";
import GetUnit from "@/api/lib/unit/getUnit/page";
import FurterSub from "@/api/lib/subCategory/addSub/page";
import GetFurtherSub from "@/api/lib/subCategory/GetSub/getSub";
import {
  FurtherSub,
  FurtherSubApiResponse,
} from "@/api/types/subCategory/getSub";
import UpdateFurtherSubCategory from "@/api/lib/subCategory/updateSub/updateSub";
import DeleteFurtherSubCategory from "@/api/lib/subCategory/deleteSub/deleteSub";
import GetCategoryMain from "@/api/lib/category/CategorySeller/CategoryMain";
import { CategoryMainApiResponse } from "@/api/types/categoryTypes/CategoryMain";

export default function FurtherSubCategory({ storeID }: { storeID: string }) {
  const router = useRouter();

  const [showList, setShowList] = useState(true);
  const [loading, setLoading] = useState(true);
  const [Update, setUpdate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [unitID, setUnitID] = useState("");
  const [categorySubID, setCategorySubID] = useState("");
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [currentUnit, setCurrentUnit] = useState("");

  const [name, setName] = useState("");
  const [ID, setID] = useState("");
  const [responseBack, setResponseBack] = useState(0);

  const [catgeorySubList, setCatgeorySubList] = useState<CategorySub[]>([]);
  const [FurtherSubList, setFurtherSubList] = useState<FurtherSub[]>([]);
  const [UnitList, setUnitList] = useState<UnitList[]>([]);

  const getCategroyMain = async () => {
    const token = localStorage.getItem("token");
    const response = await GetCategoryMain(String(token));

    if (response.status === 200 || response.status === 201) {
      const data = response.data as CategoryMainApiResponse;
      setCategorySubID(data.categoryList[0].categoryID);
      getCategorySub(data.categoryList[0].categoryID);
    }
    if (response.status === 401) {
      router.push("/sellerlogin");
    }
  };
  const getUnit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await GetUnit(String(token), String(storeID));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as UnitApiResponse;
        setUnitList(data.categoryList);
        setUnitID(data.categoryList[0].unitID);
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      }
    } catch (err) {
      setResponseBack(3);
    } finally {
      setLoading(false);
    }
  };

  const getCategorySub = async (ID: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = {
        categoryID: ID,
        storeID: storeID,
      };
      const response = await GetCategorySub(String(token), formData);
      if (response.status === 200 || response.status === 201) {
        const data = response.data as CategorySubApiResponse;
        console.log(data);
        setCatgeorySubList(data.categoryList);
        setCategorySubID(data.categoryList[0].subCategoryID);
        getFurtherSub(data.categoryList[0].subCategoryID);
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      }
    } catch (err) {
      setResponseBack(3);
    } finally {
      setLoading(false);
    }
  };

  const addSubCategory = async () => {
    if (!categorySubID || selectedUnits.length === 0 || !name)
      return setResponseBack(2);

    const token = localStorage.getItem("token");

    const formData = {
      subCategoryID: categorySubID,
      units: selectedUnits.map((id) => ({
        unitID: id,
      })),
      name,
    };
    console.log(formData);
    const response = await FurterSub(formData, String(token));

    if (response.status === 200 || response.status === 201) {
      setResponseBack(1);
      setName("");
      setSelectedUnits([]);
      getFurtherSub(categorySubID);
    }
  };

  const getFurtherSub = async (ID: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = {
        subCategoryID: ID || categorySubID,
        storeID: storeID,
      };
      const response = await GetFurtherSub(String(token), formData);
      if (response.status === 200 || response.status === 201) {
        const data = response.data as FurtherSubApiResponse;

        // Make sure every item has units array
        const safeList = data.categoryList.map((item) => ({
          ...item,
          units: Array.isArray(item.unit) ? item.unit : [],
        }));
        console.log(data.categoryList);
        setFurtherSubList(safeList);
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      }
    } catch (err) {
      setResponseBack(3);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = (ID: string) => {
    setUpdate(true);
    setShowList(false);
    const data = FurtherSubList.find((item) => item.subCategoryDetailID === ID);
    if (data) {
      setSelectedUnits(data.unit.map((u) => u.unitID));
      setCategorySubID(data.subCategoryID);
      setName(data.name);
      setID(ID);
    }
  };

  const ModifiedCatgeorySub = async () => {
    if (!categorySubID || !name || selectedUnits.length === 0)
      return setResponseBack(2);
    else {
      const token = localStorage.getItem("token");
      const formData = {
        subCategoryDetailID: ID,
        subCategoryID: categorySubID,
        units: selectedUnits.map((id) => ({
          unitID: id,
        })),
        name: name,
      };
      const response = await UpdateFurtherSubCategory(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        getFurtherSub(categorySubID);
        setShowList(true);
        setResponseBack(4);
        setName("");
        setID("");
      }
      if (response.status === 401) {
        router.push("/sellerlogin");
      } else if (response.status === 500) setResponseBack(3);
    }
  };

  const DeleteCatgeorySub = async (ID: string) => {
    const token = localStorage.getItem("token");
    const formData = {
      subCategoryDetailID: ID,
    };
    const response = await DeleteFurtherSubCategory(formData, String(token));
    if (response.status === 200 || response.status === 201) {
      console.log(response);
      setShowList(true);
      setID("");
      setFurtherSubList((item) =>
        item.filter((emp) => emp.subCategoryDetailID !== ID)
      );
    }
    if (response.status === 401) {
      router.push("/sellerlogin");
    } else if (response.status === 500) setResponseBack(3);
  };

  useEffect(() => {
    getCategroyMain();
    getUnit();
    // getCategorySub();
  }, []);

  useEffect(() => {
    if (
      responseBack === 1 ||
      responseBack === 2 ||
      responseBack === 3 ||
      responseBack === 4
    ) {
      setTimeout(() => {
        setResponseBack(0);
      }, 2000);
    }
  }, [responseBack]);

  return (
    <div className="w-full relative">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Sub Categories Management
      </h1>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center">
            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-800">
              Delete Confirmation
            </h2>
            <p className="text-gray-500 mt-2">
              Are you sure you want to delete this record? <br />
              This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  DeleteCatgeorySub(ID);
                  setIsOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          {/* <h2 className="text-2xl font-semibold text-gray-800">
            Supplier Ledger
          </h2> */}
          <button
            onClick={() => {
              setShowList(!showList);
              setName("");
              setSelectedUnits([]);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {showList ? (
              <>
                <ChevronRight size={18} /> Add New
              </>
            ) : (
              <>
                <ChevronLeft size={18} /> Show List
              </>
            )}
          </button>
        </div>
        {showList ? (
          <>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Main Category <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <select
                  name="CategoryMain"
                  value={categorySubID}
                  className="w-full bg-transparent outline-none text-gray-900 p-1"
                  onChange={(e) => {
                    setCategorySubID(e.target.value);
                    getFurtherSub(e.target.value);
                  }}
                >
                  {catgeorySubList.length > 0 ? (
                    <>
                      {catgeorySubList.map((cat) => (
                        <option
                          key={cat.subCategoryID}
                          value={cat.subCategoryID}
                        >
                          {cat.subCategoryName}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option>No Record found</option>
                  )}
                </select>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : (
              <>
                {FurtherSubList.length > 0 ? (
                  <>
                    {FurtherSubList.map((item) => (
                      <div
                        className="p-4 border mt-2 border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition flex justify-between items-center"
                        key={item.subCategoryDetailID}
                      >
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {item.name}
                          </h3>

                          {/* Loop units array */}
                          <div className="flex gap-2 flex-wrap mt-1">
                            {(item.unit ?? []).map((u) => (
                              <span
                                key={u.unitID}
                                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                              >
                                {u.unitName}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <button
                            onClick={() => fetchData(item.subCategoryDetailID)}
                            className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
                            title="Edit"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>

                          <button
                            onClick={() => {
                              setIsOpen(true);
                              setID(item.subCategoryDetailID);
                            }}
                            className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
                            title="Delete"
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="w-full mt-2 bg-red-100 text-red-800 text-center px-4 py-3 mb-2 rounded">
                    No Record Found
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="space-y-5 mt-2">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Main Category <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <select
                  name="CategoryMain"
                  value={categorySubID}
                  className="w-full bg-transparent outline-none text-gray-900 p-1"
                  onChange={(e) => setCategorySubID(e.target.value)}
                >
                  {catgeorySubList.length > 0 ? (
                    <>
                      {catgeorySubList.map((cat) => (
                        <option
                          key={cat.subCategoryID}
                          value={cat.subCategoryID}
                        >
                          {cat.subCategoryName}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option>No Record found</option>
                  )}
                </select>
              </div>
            </div>
            {/* Unit Selector */}
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Unit <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center gap-2">
                {/* Dropdown */}
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 w-full">
                  <select
                    name="unitSelect"
                    value={currentUnit}
                    className="w-full bg-transparent outline-none text-gray-900 p-1"
                    onChange={(e) => setCurrentUnit(e.target.value)}
                  >
                    <option value="">Select Unit</option>

                    {UnitList.map((unit) => (
                      <option key={unit.unitID} value={unit.unitID}>
                        {unit.unitName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (!currentUnit) return;

                    if (selectedUnits.includes(currentUnit)) return; // prevent duplicate

                    setSelectedUnits((prev) => [...prev, currentUnit]);
                    setCurrentUnit("");
                  }}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  +
                </button>
              </div>

              {/* Badge List */}
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedUnits.map((id) => {
                  const unit = UnitList.find((u) => u.unitID === id);

                  return (
                    <span
                      key={id}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full flex items-center gap-2"
                    >
                      {unit?.unitName}

                      <button
                        onClick={() =>
                          setSelectedUnits((prev) =>
                            prev.filter((u) => u !== id)
                          )
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* === Column: Sub Category === */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                SubCategory Name <span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                name="SubCategory Name"
                placeholder="Enter SubCategory Name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none text-gray-900"
              />
            </div>

            {responseBack === 2 && (
              <div className="w-full bg-red-100 text-red-800 text-center px-4 py-3 mb-2 rounded">
                Fill in All Required Fields
              </div>
            )}
            {responseBack === 3 && (
              <div className="w-full bg-red-100 text-red-800 text-center px-4 py-3 mb-2 rounded">
                Network Error
              </div>
            )}
            {responseBack === 1 && (
              <div className="w-full bg-green-100 text-green-800 text-center px-4 py-3 mb-2 rounded">
                Record Added Successful
              </div>
            )}
            {responseBack === 4 && (
              <div className="w-full bg-green-100 text-green-800 text-center px-4 py-3 mb-2 rounded">
                Record Modified Successful
              </div>
            )}

            {/* === Submit Button === */}

            {Update ? (
              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={ModifiedCatgeorySub}
                  className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
                >
                  Update
                </button>
              </div>
            ) : (
              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={addSubCategory}
                  className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
