"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Trash } from "lucide-react";
import GetCategoryMain from "@/api/lib/category/CategorySeller/CategoryMain";
import { useRouter } from "next/navigation";
import {
  CategoryMain,
  CategoryMainApiResponse,
} from "@/api/types/categoryTypes/CategoryMain";
import AddSubCategory from "@/api/lib/category/addCategorySub/catSub";
import GetCategorySub from "@/api/lib/category/getCategorySub/categorySubGet";
import {
  CategorySub,
  CategorySubApiResponse,
} from "@/api/types/categoryTypes/CategorySub";
import Spinner from "@/component/spinner/page";
import UpdateSubCategory from "@/api/lib/category/updateCategorySub/updateSub";
import DeleteSubCategory from "@/api/lib/category/deleteCategorySub/subCategeoryDelete";
import AddUnits from "@/api/lib/unit/addUnit/page";
import GetUnit from "@/api/lib/unit/getUnit/page";
import { UnitApiResponse, UnitList } from "@/api/types/unit/getUnit";
import UpdateUnit from "@/api/lib/unit/updateUnit/page";
import DeleteUnits from "@/api/lib/unit/deleteUnit/page";

export default function UnitForm({ storeID }: { storeID: string }) {
  const router = useRouter();

  const [showList, setShowList] = useState(true);
  const [loading, setLoading] = useState(true);
  const [Update, setUpdate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [UnitName, setUnitName] = useState("");
  const [abbreviation, setabbreviation] = useState("");
  const [description, setdescription] = useState("");
  const [ID, setID] = useState("");
  const [responseBack, setResponseBack] = useState(0);

  const [UnitList, setUnitList] = useState<UnitList[]>([]);

  const addUnit = async () => {
    if (!UnitName) return setResponseBack(2);
    else {
      const token = localStorage.getItem("token");
      const formData = {
        abbreviation: abbreviation,
        storeID: storeID,
        unitName: UnitName,
        description: description,
      };
      const response = await AddUnits(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        console.log(response);
        setResponseBack(1);
        setUnitName("");
        setabbreviation("");
        setdescription("");
        getUnit();
      }
      if (response.status === 401) {
        router.push("/sellerlogin");
      } else if (response.status === 500) setResponseBack(3);
    }
  };

  const getUnit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await GetUnit(String(token), String(storeID));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as UnitApiResponse;
        console.log(data.categoryList);
        setUnitList(data.categoryList);
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
    const data = UnitList.find((item) => item.unitID === ID);
    if (data) {
      setUnitName(data.unitName);
      setdescription(data.description);
      setabbreviation(data.abbreviation);
      setID(ID);
    }
  };

  const ModifiedUnit = async () => {
    if (!UnitName) return setResponseBack(2);
    else {
      const token = localStorage.getItem("token");
      const formData = {
        unitID: ID,
        storeID: storeID,
        unitName: UnitName,
        abbreviation: abbreviation,
        description: description,
      };
      const response = await UpdateUnit(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        console.log(response);
        setShowList(true);
        setResponseBack(4);
        setUnitName("");
        setdescription("");
        getUnit();
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
      unitID: ID,
      storeID: storeID,
    };
    const response = await DeleteUnits(formData, String(token));
    if (response.status === 200 || response.status === 201) {
      console.log(response);
      setShowList(true);
      setID("");
      setUnitList((item) => item.filter((emp) => emp.unitID !== ID));
    }
    if (response.status === 401) {
      router.push("/sellerlogin");
    } else if (response.status === 500) setResponseBack(3);
  };

  useEffect(() => {
    getUnit();
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Unit Management</h1>
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
              setID("");
              setUnitName("");
              setabbreviation("");
              setdescription("");
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
            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : (
              <>
                {UnitList.length > 0 ? (
                  <>
                    {UnitList.map((item) => (
                      <div
                        className="p-4 border mt-2  border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition flex justify-between items-center"
                        key={item.unitID}
                      >
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {item.unitName}
                          </h3>
                          <p className="text-gray-600">
                            Short Code: {item.abbreviation}
                          </p>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => fetchData(item.unitID)}
                            className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
                            title="Edit"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setIsOpen(true);
                              setID(item.unitID);
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
                  <div className="w-full bg-red-100 text-red-800 text-center px-4 py-3 mb-2 rounded">
                    No Record Found
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="space-y-5 mt-2">
            {/* === Column: Sub Category === */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Unit Name <span className="text-red-500">*</span>
              </label>
              <input
                value={UnitName}
                onChange={(e) => setUnitName(e.target.value)}
                type="text"
                name="Unit Name"
                placeholder="Enter SubCategory Name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Abbreviation
              </label>
              <input
                value={abbreviation}
                onChange={(e) => setabbreviation(e.target.value)}
                type="text"
                name="Unit Name"
                placeholder="Enter Abbreviation eg:- pcs, pck etc"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none text-gray-900"
              />
            </div>

            {/* === Column: Description === */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setdescription(e.target.value)}
                name="description"
                placeholder="Enter Description"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none text-gray-900 resize-none"
                rows={3}
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
                  onClick={ModifiedUnit}
                  className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
                >
                  Update
                </button>
              </div>
            ) : (
              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={addUnit}
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
