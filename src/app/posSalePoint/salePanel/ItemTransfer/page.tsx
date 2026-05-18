"use client";
import { useEffect, useState } from "react";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  User,
  Tag,
  PlusCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Trash,
  Pencil,
  Coins,
  Contact,
  Notebook,
} from "lucide-react";
import AddCustomer from "@/api/lib/PosIntegration/Customer/AddCustomer";
import { useRouter } from "next/navigation";
import {
  CustomerData,
  ResponseCustomerGetData,
} from "@/api/types/PosIntegration/Customer/CustomerType";
import GetCustomer from "@/api/lib/PosIntegration/Customer/GetCustomer";
import Spinner from "@/component/spinner/page";
import DeleteCustomer from "@/api/lib/PosIntegration/Customer/DeleteCustomer";
import ModifyCustomer from "@/api/lib/PosIntegration/Customer/ModifyCustomer";
import GetTillForPos from "@/api/lib/MainDashbaord/TillCreate/TillGet";
import GetProductSalesMan from "@/api/lib/PosIntegration/ProductGet/productsGetSalesMan";
import {
  Product,
  ProductApiResponseSalesMan,
  varinetMessage,
} from "@/api/types/product/getProduct";
import GetTillForSalesMan from "@/api/lib/MainDashbaord/TillCreate/GetTillForSpecficSaleMan";
import AddTillTransferPosSale from "@/api/lib/PosIntegration/TillTransfer/AddTill/AddTill";
import GetProductVarient from "@/api/lib/PosIntegration/ProductGet/FecthProductVareint/FetchProductVareint";
import { VariantList } from "@/api/types/product/getVarinet";
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
  listID: string;
  productID: string;
  productName: string;
}
interface VarientsList {
  varientID: string;
  variantName: string;
  variantValues: variantValues[];
}
interface variantValues {
  attributeID: string;
  varientValue: string;
  costPrice: number;
  salePrice: number;
  qty: number;
  barcode: string;
}
interface VarintList {
  productName: string;
  varientID: string;
  variantName: string;
  discount: number;
  variantValues: variantValues[];
}
interface variantValues {
  attributeID: string;
  varientValue: string;
  costPrice: number;
  salePrice: number;
  qty: number;
  barcode: string;
}
export default function ItemTransferForm() {
  const router = useRouter();
  const [showList, setShowList] = useState(true);
  const [productName, setProductName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [address, setAddress] = useState("");
  const [Qty, setQty] = useState(0);
  const [Quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const [ProductID, setProductID] = useState("");
  const [loading, setLoading] = useState(false);
  const [RescponseBack, setRersponseBack] = useState("");
  const [ID, setID] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [Update, setUpdate] = useState(false);
  const [VarinetID, setVarinetID] = useState("");
  const [SubVarinetID, setSubVarinetID] = useState("");
  const [TillID, setTillID] = useState("");
  const [SelectedTill, setSelectedTill] = useState("");
  const [productList2, setProductList2] = useState<Product[]>([]);
  const [CustomerList, setCustomerList] = useState<CustomerData[]>([]);

  const [TillList, setTillList] = useState<TillList[]>([]);
  const [TillList2, setTillList2] = useState<TillList[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [VarientsList, setVarientsList] = useState<VarientsList[]>([]);
  const [AttributeList, setAttributeList] = useState<variantValues[]>([]);
  const [VarintListInPopUp, setVarintListInPopUp] = useState<VarintList[]>([]);

  const getTill = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("tokenPosSale");
      const response = await GetTillForPos(String(token));
      if (response.status === 200) {
        const data = response.data as RespiosneGet;
        console.log(data);
        if (data) {
          setTillList(data.tillList);
          getProduct(data.tillList[0].tillID);
        } else {
          setTillList([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getTillSender = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("tokenPosSale");
      const response = await GetTillForSalesMan(String(token));

      if (response.status === 200) {
        const data = response.data as RespiosneGet;

        if (data?.tillList?.length > 0) {
          setTillList2(data.tillList);

          // Auto select first till
          setSelectedTill(data.tillList[0].tillID);
          getProduct(data.tillList[0].tillID);
        } else {
          setTillList2([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (ID: string) => {
    const token = localStorage.getItem("tokenPosSale");

    if (!token) return;

    const response = await GetProductSalesMan(token, ID, productName);

    if (response.status === 200 || response.status === 201) {
      const data = response.data as ProductApiResponseSalesMan;
      console.log(data);
      const newData = data.productList.filter(
        (item) => item.storeSale !== "OnlineStore",
      );
      if (newData) {
        console.log(newData);
        setProductList(newData || []);
      } else {
        setProductList([]);
      }
    }
  };
  const varinetList = async (ID: string) => {
    const token = localStorage.getItem("tokenPosSale");
    const response = await GetProductVarient(String(token), ID);
    if (response.status === 200 || response.status === 201) {
      const data = response.data as varinetMessage;
      console.log(data);
      setVarintListInPopUp(data.variants);
    }
  };
  const fetchDataVarientList = (productID: string) => {
    for (var products of productList) {
      if (products) {
        const data = productList.find((p) => p.productID === productID);
        if (data) {
          setVarientsList(data.variants);
        }
      }
    }
  };

  const fetchDataAttributeList = (varientID: string) => {
    const data = VarientsList.find((p) => p.varientID === varientID);
    if (data) {
      setAttributeList(data.variantValues);
    } else {
      setAttributeList([]);
    }
  };
  const AddTillTransfer = async () => {
    try {
      setLoading(true);
      const formData = {
        senderID: SelectedTill,
        recieverID: TillID,
        attributeID: SubVarinetID,
        qty: Number(Quantity),
      };
      console.log(formData);
      const token = localStorage.getItem("tokenPosSale");
      const response = await AddTillTransferPosSale(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        setTillID("");
        setProductID("");
        setVarinetID("");
        setSubVarinetID("");
        setDescription("");
        setRersponseBack(
          response.data.message || "Till Transferd Successfully",
        );
        setShowMessage(true);
      } else if (response.status === 400) {
        setRersponseBack(
          response.data.message || "Please Fill in All Required Fields",
        );
        setShowMessage(false);
      } else {
        setRersponseBack(
          response.data.message ||
            "Something Went Wrong. Please Try Again later.",
        );
        setShowMessage(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTill();
    getTillSender();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (showMessage) {
        setRersponseBack("");
        setShowMessage(false);
      }
    }, 2000);
  }, [showMessage, RescponseBack]);

  return (
    <div className="w-full relative">
      <h2 className="text-2xl font-semibold text-gray-800">Item Transfer</h2>
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
            {/* {ResponseBack && (
              <div
                className={`w-full text-center px-4 py-3 mb-2 rounded ${
                  isSuccess
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {ResponseBack}
              </div>
            )} */}
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
                  //   CustomerDelete();
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                {isDelete ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-2 w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowList(!showList)}
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
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : (
              <>
                {CustomerList.length !== 0 ? (
                  <>
                    {CustomerList.map((item) => (
                      <div
                        key={item.customerID}
                        className="p-4 border mt-2 border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition flex justify-between items-center"
                      >
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {item.customerName}
                          </h3>
                          <p className="text-gray-600">Email: {item.email}</p>
                          <p className="text-gray-600">
                            Remaining Balance: {item.remainingBalance}
                          </p>
                          <p className="text-gray-600">
                            Address: {item.address}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <button
                            // onClick={() => fetchData(item.customerID)}
                            className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
                            title="Edit"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setID(item.customerID);
                              setIsOpen(true);
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
          <div className="">
            {/* Name */}
            <div className="flex gap-3">
              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-2">
                  Till Sender <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                  <User className="text-gray-400 mr-2" size={18} />
                  <select
                    value={SelectedTill}
                    onChange={(e) => {
                      setSelectedTill(e.target.value);
                      const value = e.target.value;
                      const data = TillList.find(
                        (item) => item.tillID === value,
                      );
                      if (data) {
                        getProduct(data.tillID);
                      }
                    }}
                    name="name"
                    className="w-full bg-transparent outline-none text-gray-900 p-1"
                  >
                    <option>Select Product</option>
                    {TillList2.length > 0 ? (
                      <>
                        {TillList2.map((item) => (
                          <option key={item.tillID} value={item.tillID}>
                            {item.tillName}
                          </option>
                        ))}
                      </>
                    ) : (
                      <option>No Record Found</option>
                    )}
                  </select>
                </div>
              </div>
              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-2">
                  Till Reciever <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                  <User className="text-gray-400 mr-2" size={18} />
                  <select
                    value={TillID}
                    onChange={(e) => {
                      setTillID(e.target.value);
                    }}
                    name="name"
                    className="w-full bg-transparent outline-none text-gray-900 p-1"
                  >
                    <option>Select Product</option>
                    {TillList.length > 0 ? (
                      <>
                        {TillList.map((item) => (
                          <option key={item.tillID} value={item.tillID}>
                            {item.tillName}
                          </option>
                        ))}
                      </>
                    ) : (
                      <option>No Record Found</option>
                    )}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 min-w-0">
                <label className="block text-gray-700 font-medium mb-2">
                  Product Name
                </label>
                <div className="flex gap-1">
                  <div className="flex items-center w-full border border-gray-200 rounded-lg bg-gray-50 px-3 py-2">
                    <Tag className="text-gray-400 mr-2" size={18} />
                    <input
                      type="text"
                      list="productList"
                      value={productName}
                      onChange={(e) => {
                        const value = e.target.value;
                        setProductName(value);
                        const data = productList2.find(
                          (item) => item.productName === value,
                        );
                        if (data) {
                          setProductID(data.productID);
                          varinetList(data.productID);
                        }
                      }}
                      placeholder="Select Product"
                      className="flex-1 bg-transparent outline-none text-gray-900 p-1 truncate"
                    />
                    <datalist id="productList">
                      {productList2.map((item) => (
                        <option key={item.productID} value={item.productName} />
                      ))}
                    </datalist>
                  </div>
                  <button
                    onClick={() => {
                      setProductName("");
                    }}
                    className="px-2 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                  >
                    <Notebook />
                  </button>
                </div>
              </div>
              <div className="w-full mt-2">
                <label className="block text-gray-700 font-medium mb-2">
                  Variant
                </label>

                <div className="flex items-center gap-2 w-full">
                  <div className="flex-1 border border-gray-200 rounded-lg bg-gray-50 px-3 py-2">
                    <select
                      value={VarinetID}
                      onChange={(e) => {
                        setVarinetID(e.target.value);
                        fetchDataAttributeList(e.target.value);
                      }}
                      className="w-full bg-transparent outline-none text-gray-900 p-1"
                    >
                      <option value="">Select Product</option>
                      {VarientsList.length === 0 ? (
                        <option value="">No Record Found</option>
                      ) : (
                        VarientsList.map((item) => (
                          <option key={item.varientID} value={item.varientID}>
                            {item.variantName}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-full mt-2">
                <label className="block text-gray-700 font-medium mb-2">
                  Sub-Variant
                </label>

                <div className="flex items-center gap-2 w-full">
                  <div className="flex-1 border border-gray-200 rounded-lg bg-gray-50 px-3 py-2">
                    <select
                      value={SubVarinetID}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSubVarinetID(e.target.value);
                        const data = AttributeList.find(
                          (item) => item.attributeID === value,
                        );
                        if (data) {
                          setQty(data.qty);
                        }
                      }}
                      className="w-full bg-transparent outline-none text-gray-900 p-1"
                    >
                      <option value="">Select Product</option>
                      {AttributeList.length === 0 ? (
                        <option value="">No Record Found</option>
                      ) : (
                        AttributeList.map((item) => (
                          <option
                            key={item.attributeID}
                            value={item.attributeID}
                          >
                            {item.varientValue}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              </div>
              <div className="w-full mt-2">
                <label className="block text-gray-700 font-medium mb-2">
                  Quantity
                </label>
                <div className="flex items-start border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                  <Notebook className="text-gray-400 mr-2 mt-1" size={18} />
                  <input
                    type="number"
                    name="address"
                    value={Quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    placeholder="Enter Qunatity"
                    className="w-full bg-transparent outline-none text-gray-900 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* <div className="md:col-span-2 mt-2">
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <div className="flex items-start border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <Notebook className="text-gray-400 mr-2 mt-1" size={18} />
                <textarea
                  name="address"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter Description"
                  className="w-full bg-transparent outline-none text-gray-900 resize-none"
                  rows={3}
                />
              </div>
            </div> */}
            {RescponseBack && (
              <div
                className={`w-full text-center px-4 py-3 mb-2 rounded ${
                  showMessage
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {RescponseBack}
              </div>
            )}

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-end mt-3">
              {Update ? (
                <>
                  <button
                    type="button"
                    // onClick={CustomerModify}
                    className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
                  >
                    {loading ? "Updating..." : "Update"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={AddTillTransfer}
                  className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
