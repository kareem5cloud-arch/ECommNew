"use client";
import AddZone from "@/api/lib/Shippment/Zone/AddZone";
import GetRegion from "@/api/lib/Shippment/Region/GetRegion";

import Spinner from "@/component/spinner/page";
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import ModifyZone from "@/api/lib/Shippment/Zone/ModifyZone";
import GetZone from "@/api/lib/Shippment/Zone/GetZone";
import DeleteZone from "@/api/lib/Shippment/Zone/DeleteZone";
import { Product, ProductApiResponse } from "@/api/types/product/getProduct";
import GetProduct from "@/api/lib/product/GetProduct/GetProduct";
import GetInitalStoreSalesMan from "@/api/lib/store/GetStoreSalesMan/GetStoreSalesMan";
import { StoreApiResponse, storeInital } from "@/api/types/storeGet";
import AddTillForPos from "@/api/lib/MainDashbaord/TillCreate/TillCreate";
import GetTillForPos from "@/api/lib/MainDashbaord/TillCreate/TillGet";
import ModifyTillForPos from "@/api/lib/MainDashbaord/TillCreate/ModifyTill";
import DeleteTillForPos from "@/api/lib/MainDashbaord/TillCreate/DeleteTill";
import GetInitalStore from "@/api/authentication/StoreGet";
import GetProductForTill from "@/api/lib/MainDashbaord/ProductForTill/ProductTill";

interface citylist {
  cityID: string;
  cityName: string;
}
interface NewList {
  varinetName: string;
  subVarientName: string;
  productName: string;
  qty: number;
  attributeID: string;
}

interface RespiosneGet {
  message: string;
  tillList: TillList[];
}
interface TillList {
  tillID: string;
  tillName: string;
  tillSubList: TillSubList[];
}
interface TillSubList {
  varinetName: string;
  subVarientName: string;
  productName: string;
  qty: number;
  attributeID: string;
}

interface ProductTill {
  message: string;
  productList: ProductList[];
}
interface ProductList {
  productID: string;
  productName: string;
  varient: varient[];
}
interface varient {
  varientID: string;
  variantName: string;
  varientSubList: varientSubList[];
}
interface varientSubList {
  attributeID: string;
  varientValue: string;
}

export default function TillManagement() {
  const router = useRouter();
  const [showList, setShowList] = useState(true);
  const [loading, setLoading] = useState(true);
  const [Update, setUpdate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isTrue, setIsTrue] = useState(false);
  const [responseBack, setResponseBack] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const [TillName, setTillName] = useState("");
  const [ProductName, setProductName] = useState("");
  const [VarientName, setVarientName] = useState("");
  const [SubVartient, setSubVartient] = useState("");
  const [attributeID, setAttributeID] = useState("");
  const [productList, setProductList] = useState<ProductList[]>([]);
  const [storeList, setStoreList] = useState<storeInital[]>([]);
  const [newList, setNewList] = useState<NewList[]>([]);
  const [newList2, setNewList2] = useState<NewList[]>([]);
  const [storeID, setStoreID] = useState("");
  const [ID, setID] = useState("");
  const [zonelist, setZoneList] = useState<citylist[]>([]);
  const [TillList, setTillList] = useState<TillList[]>([]);
  const [VarientList, setVareintList] = useState<varient[]>([]);
  const [SubVarientList, setSubVareintList] = useState<varientSubList[]>([]);
  const [Qty, setQty] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  const storesget = async () => {
    const token = localStorage.getItem("token");
    const response = await GetInitalStore(String(token));
    if (response.status === 200 || response.status === 201) {
      const data = response.data as StoreApiResponse;
      setStoreList(data.storeList);
      getProduct(data.storeList[0].storeID);
    }
  };

  const getProduct = async (ID: string) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const response = await GetProductForTill(token, ID);

    if (response.status === 200 || response.status === 201) {
      const data = response.data as ProductTill;
      if (data.productList.length > 0) {
        setProductName(data.productList[0].productName);
        setProductList(data.productList);
      }
    }
  };
  useEffect(() => {
    if (productList.length > 0) {
      fetchVarinet(productList[0].productID);
    }
  }, [productList]);

  const fetchVarinet = (ID: string) => {
    const data = productList.find((item) => item.productID === ID);
    if (data) {
      setVareintList(data.varient || []);
      setVarientName(data.varient[0].variantName);
    }
  };

  useEffect(() => {
    if (VarientList.length > 0) {
      fetchSubVarinet(VarientList[0].varientID);
    }
  }, [VarientList]);

  const fetchSubVarinet = (ID: string) => {
    const data = VarientList.find((item) => item.varientID === ID);
    if (data) {
      setSubVareintList(data.varientSubList);
      if (data.varientSubList && data.varientSubList.length > 0) {
        setSubVartient(data.varientSubList[0].varientValue);
        setAttributeID(data.varientSubList[0].attributeID);
      }
    } else {
      setSubVareintList([]);
    }
  };

  const AddToList = (
    productName: string,
    variantName: string,
    subVariantValue: string,
    attributeID: string,
    qty: number,
  ) => {
    const fromData = {
      productName,
      variantName,
      subVariantValue,
      attributeID,
      qty,
    };
    console.log(fromData);
    // Optional: find product in productList for validation or extra data
    const selectedProduct = productList.find(
      (item) => item.productName.toLowerCase() === productName.toLowerCase(),
    );

    if (!selectedProduct) {
      // maybe show error or return early
      console.warn("Product not found in list");
      return;
    }
    setNewList((prev) => [
      ...prev,
      {
        productName,
        varinetName: variantName,
        subVarientName: subVariantValue,
        attributeID: attributeID,
        qty,
      },
    ]);
    setProductName("");
    setAttributeID("");
    setVarientName("");
    setSubVartient("");
    setQty("");
  };

  const removeItem = (productName: string) => {
    const list = newList.filter((item) => item.attributeID !== productName);
    if (list) {
      setNewList(list);
    }
  };

  const addTill = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("token");
      const formData = {
        tillName: TillName,
        listProduct: newList.map((item) => ({
          attributeID: item.attributeID,
          qty: item.qty,
        })),
      };
      console.log(formData);
      const response = await AddTillForPos(formData, String(token));
      if (response.status === 200) {
        storesget();
        setTillName("");
        getTill();
        setNewList([]);
        setIsTrue(false);
        setResponseBack("Record Added Successfully");
      } else if (response.status === 400) {
        setIsTrue(true);
        setResponseBack("Please Fill in Required Fields");
      } else {
        setIsTrue(true);
        setResponseBack("Something Went Wrong. Please try again later.");
      }
    } finally {
      setisLoading(false);
    }
  };

  const getTill = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await GetTillForPos(String(token));
      if (response.status === 200) {
        const data = response.data as RespiosneGet;
        if (data) {
          console.log(data);
          setTillList(data.tillList);
        } else {
          setTillList([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  const fetchData = (ID: string) => {
    setShowList(false);
    setUpdate(true);
    const data = TillList.find((item) => item.tillID === ID);
    if (data) {
      setID(data.tillID);
      setTillName(data.tillName);
      setNewList(data.tillSubList);
      // setNewList(data.tillSubList);
    }
  };
  const ModifyTill = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("token");
      const formData = {
        TillID: ID,
        tillName: TillName,
        listProduct: newList.map((item) => ({
          attributeID: item.attributeID,
          qty: item.qty,
        })),
      };
      const response = await ModifyTillForPos(formData, String(token));
      if (response.status === 200) {
        setUpdate(false);
        setShowList(true);
        setTillName("");
        getTill();
        setNewList([]);
        setProductName("");
        setIsTrue(true);
        setResponseBack("Record Added Successfully");
      } else if (response.status === 400) {
        setIsTrue(true);
        setResponseBack("PLease Fill in Required Fields");
      } else {
        setIsTrue(true);
        setResponseBack("Something Went Wrong. Please try again later.");
      }
    } finally {
      setisLoading(false);
    }
  };
  const deleteTill = async (ID: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = {
        TillID: ID,
      };
      const response = await DeleteTillForPos(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        setTillList(TillList.filter((item) => item.tillID !== ID));
        setID("");
        setUpdate(false);
        setShowList(true);
        setIsTrue(true);
        setResponseBack(response.data[0].message);
      } else {
        setUpdate(true);
        setShowList(false);
        setIsTrue(false);
        setResponseBack(response.data[0].message);
      }
    } catch (error) {
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    storesget();
    getTill();
  }, []);

  useEffect(() => {
    if (!responseBack) return;

    const timer = setTimeout(() => {
      setIsTrue(false);
      setResponseBack("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [responseBack]);

  return (
    <div className="w-full relative">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Till Management</h1>
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
                  deleteTill(ID);
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
                {TillList.length !== 0 ? (
                  <>
                    {TillList.map((item) => (
                      <div
                        className="p-4 border mt-2 border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition flex justify-between items-center"
                        key={item.tillID}
                      >
                        <div className="flex flex-col">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {item.tillName}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {item.tillSubList.length !== 0 ? (
                              <>
                                {item.tillSubList.map((subItem, index) => (
                                  <span
                                    key={subItem.attributeID}
                                    className="inline-block bg-green-300 text-green-800 text-xs font-semibold px-2 py-1 rounded-full"
                                  >
                                    {subItem.productName}
                                  </span>
                                ))}
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => fetchData(item.tillID)}
                            className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
                            title="Edit"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setIsOpen(true);
                              setID(item.tillID);
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
            {/* <div>
              <label className="block text-gray-700 font-medium mb-2">
                Stores
              </label>
              <div className="flex items-center w-full border border-gray-200 rounded-lg bg-gray-50 px-3 py-2">
                <select
                  value={storeID}
                  onChange={(e) => {
                    setStoreID(e.target.value);
                    getProduct(e.target.value);
                  }}
                  className="flex-1 bg-transparent outline-none text-gray-900 p-1"
                >
                  {storeList.length > 0 ? (
                    <>
                      {storeList.map((item) => (
                        <option key={item.storeID} value={item.storeID}>
                          {item.storeName}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option value="">No Record Found</option>
                  )}
                </select>
              </div>
            </div> */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Till Name <span className="text-red-500">*</span>
              </label>
              <input
                value={TillName}
                onChange={(e) => setTillName(e.target.value)}
                type="text"
                name="Zone Name"
                placeholder="Enter Till Name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none text-gray-900"
              />
            </div>
            <div className="flex gap-4">
              {/* First Select */}
              <div className="w-1/2">
                <label className="block text-gray-700 font-semibold mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <select
                  value={ProductName}
                  onChange={(e) => {
                    setProductName(e.target.value);
                    const value = e.target.value;
                    const data = productList.find(
                      (item) => item.productName === value,
                    );
                    if (data) {
                      fetchVarinet(data.productID);
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option>Select Product</option>
                  {productList.length > 0 ? (
                    productList.map((item) => (
                      <option key={item.productID} value={item.productName}>
                        {item.productName}
                      </option>
                    ))
                  ) : (
                    <option disabled>No Record Found</option>
                  )}
                </select>
              </div>

              {/* Second Select */}
              <div className="w-1/2">
                <label className="block text-gray-700 font-semibold mb-2">
                  Variant Name <span className="text-red-500">*</span>
                </label>
                <select
                  value={VarientName}
                  onChange={(e) => {
                    setVarientName(e.target.value);
                    const value = e.target.value;
                    const data = VarientList.find(
                      (item) => item.variantName === value,
                    );
                    if (data) {
                      fetchSubVarinet(data.varientID);
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option>Select Varient</option>
                  {VarientList.length > 0 ? (
                    VarientList.map((item) => (
                      <option key={item.varientID} value={item.variantName}>
                        {item.variantName}
                      </option>
                    ))
                  ) : (
                    <option disabled>No Record Found</option>
                  )}
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              {/* Sub-Variant Select */}
              <div className="w-1/2">
                <label className="block text-gray-700 font-semibold mb-2">
                  Sub-Variant <span className="text-red-500">*</span>
                </label>
                <select
                  value={SubVartient}
                  onChange={(e) => {
                    setSubVartient(e.target.value);
                    const value = e.target.value;
                    const item = SubVarientList.find(
                      (item) => item.varientValue === value,
                    );
                    if (item) {
                      setAttributeID(item.attributeID);
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option>Select Sub-Varient</option>
                  {SubVarientList.length > 0 ? (
                    SubVarientList.map((item) => (
                      <option key={item.attributeID} value={item.varientValue}>
                        {item.varientValue}
                      </option>
                    ))
                  ) : (
                    <option disabled>No Record Found</option>
                  )}
                </select>
              </div>

              {/* Qty Input */}
              <div className="w-1/2">
                <label className="block text-gray-700 font-semibold mb-2">
                  Qty <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-1">
                  <input
                    value={Qty}
                    onChange={(e) => setQty(e.target.value)}
                    type="text"
                    name="Zone Name"
                    placeholder="Enter Qty"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none text-gray-900"
                  />
                  <button
                    onClick={() => {
                      AddToList(
                        ProductName,
                        VarientName,
                        SubVartient,
                        attributeID,
                        Number(Qty),
                      );
                    }}
                    className="px-2 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
                  >
                    <Plus />
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border border-gray-300 rounded-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">
                      #
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">
                      Product Name
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">
                      Variant Name
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">
                      Sub-Variant Name
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">
                      Quantity
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {newList.map((item, index) => (
                    <tr
                      key={item.attributeID}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="py-2 px-4 border-b border-gray-300">
                        {index + 1}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-300">
                        {item.productName}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-300">
                        {item.varinetName}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-300">
                        {item.subVarientName}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-300">
                        {item.qty}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-300">
                        <button
                          onClick={() => {
                            removeItem(item.attributeID);
                          }}
                          className="px-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                        >
                          <Trash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isTrue && (
              <>
                {responseBack && (
                  <div
                    className={`w-full text-center px-4 py-3 mb-2 rounded ${
                      responseBack === "Record Added successfully" ||
                      responseBack === "Login Successfully" ||
                      responseBack === "Request successful"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {responseBack}
                  </div>
                )}
              </>
            )}

            {Update ? (
              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={ModifyTill}
                  className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
                >
                  {isLoading ? "Updating...." : "Update"}
                </button>
              </div>
            ) : (
              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={addTill}
                  className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
                >
                  {isLoading ? "Saving...." : "Save"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
