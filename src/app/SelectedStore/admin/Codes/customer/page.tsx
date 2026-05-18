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
type CustomerFormProps = {
  storeID: string;
};
export default function CustomerForm({ storeID }: { storeID: string }) {
  const router = useRouter();
  const [showList, setShowList] = useState(true);
  const [loading, setLoading] = useState(true);
  const [Update, setUpdate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [CategoryMainID, setCategoryMainID] = useState("");
  const [subCatName, setsubCatName] = useState("");
  const [description, setdescription] = useState("");
  const [ID, setID] = useState("");
  const [responseBack, setResponseBack] = useState(0);

  const [catgeoryMainList, setCatgeoryMainList] = useState<CategoryMain[]>([]);
  const [catgeorySubList, setCatgeorySubList] = useState<CategorySub[]>([]);

  const getCategroyMain = async () => {
    const token = localStorage.getItem("token");
    const response = await GetCategoryMain(String(token));

    if (response.status === 200 || response.status === 201) {
      const data = response.data as CategoryMainApiResponse;
      setCatgeoryMainList(data.categoryList);
      setCategoryMainID(data.categoryList[0].categoryID);
      getCategorySub(data.categoryList[0].categoryID);
    }
    if (response.status === 401) {
      router.push("/sellerlogin");
    }
  };

  const addCatgeorySub = async () => {
    if (!subCatName || !CategoryMainID) return setResponseBack(2);
    else {
      const token = localStorage.getItem("token");
      const formData = {
        categoryID: CategoryMainID,
        storeID: storeID,
        subCategoryName: subCatName,
        description: description,
      };
      const response = await AddSubCategory(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        console.log(response);
        setResponseBack(1);
        setsubCatName("");
        getCategorySub(CategoryMainID);
        setdescription("");
      }
      if (response.status === 401) {
        router.push("/sellerlogin");
      } else if (response.status === 500) setResponseBack(3);
    }
  };

  const getCategorySub = async (categoryMainID: string) => {
    setLoading(true);
    try {
      const formData = {
        categoryID: categoryMainID,
        storeID: storeID,
      };
      const token = localStorage.getItem("token");
      const response = await GetCategorySub(String(token), formData);
      if (response.status === 200 || response.status === 201) {
        const data = response.data as CategorySubApiResponse;
        console.log(data.categoryList);
        setCatgeorySubList(data.categoryList);
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
    const data = catgeorySubList.find((item) => item.subCategoryID === ID);
    if (data) {
      setsubCatName(data.subCategoryName);
      setdescription(data.description);
      setCategoryMainID(data.categoryID);
      setID(ID);
    }
  };

  const ModifiedCatgeorySub = async () => {
    if (!subCatName || !CategoryMainID) return setResponseBack(2);
    else {
      const token = localStorage.getItem("token");
      const formData = {
        subCategoryID: ID,
        storeID: storeID,
        categoryID: CategoryMainID,
        subCategoryName: subCatName,
        description: description,
      };
      const response = await UpdateSubCategory(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        console.log(response);
        setUpdate(false);
        setShowList(true);
        setResponseBack(4);
        setsubCatName("");
        setdescription("");
        getCategorySub(CategoryMainID);
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
      storeID: storeID,
      subCategoryID: ID,
    };
    const response = await DeleteSubCategory(formData, String(token));
    if (response.status === 200 || response.status === 201) {
      console.log(response);
      setShowList(true);
      setID("");
      setCatgeorySubList((item) =>
        item.filter((emp) => emp.subCategoryID !== ID)
      );
    }
    if (response.status === 401) {
      router.push("/sellerlogin");
    } else if (response.status === 500) setResponseBack(3);
  };

  useEffect(() => {
    getCategroyMain();
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
        Main Categories Management
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
              setID("");
              setsubCatName("");
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
                {catgeorySubList.length > 0 ? (
                  <>
                    {catgeorySubList.map((item) => (
                      <div
                        className="p-4 border mt-2  border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition flex justify-between items-center"
                        key={item.subCategoryID}
                      >
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {item.subCategoryName}
                          </h3>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => fetchData(item.subCategoryID)}
                            className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
                            title="Edit"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setIsOpen(true);
                              setID(item.subCategoryID);
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
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Main Category <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <select
                  name="CategoryMain"
                  className="w-full bg-transparent outline-none text-gray-900 p-1"
                  onChange={(e) => setCategoryMainID(e.target.value)}
                >
                  {catgeoryMainList.map((cat) => (
                    <option key={cat.categoryID} value={cat.categoryID}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* === Column: Sub Category === */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                SubCategory Name <span className="text-red-500">*</span>
              </label>
              <input
                value={subCatName}
                onChange={(e) => setsubCatName(e.target.value)}
                type="text"
                name="SubCategory Name"
                placeholder="Enter SubCategory Name"
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
                  onClick={addCatgeorySub}
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
