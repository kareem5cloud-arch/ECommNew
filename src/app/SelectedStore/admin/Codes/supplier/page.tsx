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
  Notebook,
} from "lucide-react";
import GetSupplier from "@/api/lib/PosIntegration/Supplier/GetSupplier";
import { useRouter } from "next/navigation";
import AddSupplier from "@/api/lib/PosIntegration/Supplier/AddSupplier";
import {
  ResponseSupplierGetData,
  SupplierData,
} from "@/api/types/PosIntegration/Suppplier/addSupplier";
import Spinner from "@/component/spinner/page";
import DeleteSupplier from "@/api/lib/PosIntegration/Supplier/DeleteSupplier";
import ModifySupplier from "@/api/lib/PosIntegration/Supplier/ModifySupplier";

export default function SupplierForm() {
  const router = useRouter();

  const [ID, setID] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showList, setShowList] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [supplierName, setSupplierName] = useState("");
  const [CompanyName, setCompanyName] = useState("");
  const [Email, setEmail] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [OpeningBalance, setOpeningBalance] = useState("");
  const [Address, setAddress] = useState("");
  const [Description, setDescription] = useState("");
  const [update, setUpdate] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ResponseBack, setResponseBack] = useState("");

  const [SupplierList, setSupplierList] = useState<SupplierData[]>([]);

  const SuppleirAdd = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const payload = {
        supplierName: supplierName,
        phoneNo: PhoneNo,
        email: Email,
        description: Description,
        openingBalance: Number(OpeningBalance),
        address: Address,
      };
      const response = await AddSupplier(payload, String(token));
      if (response.status === 200 || response.status === 201) {
        setIsSuccess(true);
        SupplierGet();
        setResponseBack(response.data.message || "Supplier added successfully");
        setSupplierName("");
        setCompanyName("");
        setEmail("");
        setPhoneNo("");
        setOpeningBalance("");
        setAddress("");
        setDescription("");
      } else {
        setIsSuccess(false);
        setResponseBack(response.data.message || "Supplier added successfully");
      }
    } catch (err: unknown) {
      setIsSuccess(false);
      setResponseBack("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const SupplierGet = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await GetSupplier(String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as ResponseSupplierGetData;
        setSupplierList(data.supplierList || []);
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      }
    } catch (err) {
      // setResponseBack(3);
    } finally {
      setLoading(false);
    }
  };
  const SupplierDelete = async () => {
    setIsDelete(true);
    try {
      const token = localStorage.getItem("token");
      const response = await DeleteSupplier({ supplierID: ID }, String(token));
      if (response.status === 200 || response.status === 201) {
        setIsOpen(false);
        setID("");
        setSupplierList((item) => item.filter((emp) => emp.supplierID !== ID));
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      }
    } catch (err) {
      setIsOpen(true);
    } finally {
      setIsDelete(false);
    }
  };
  const fetchData = (ID: string) => {
    setShowList(false);
    setUpdate(true);
    const data = SupplierList.find((item) => item.supplierID === ID);
    if (data) {
      setSupplierName(data.supplierName);
      setEmail(data.email);
      setPhoneNo(data.phoneNo);
      setOpeningBalance(data.remainingBalance.toString());
      setAddress(data.address);
      setDescription(data.description);
    }
  };
  const SuppleirModify = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const payload = {
        supplierID: ID,
        supplierName: supplierName,
        phoneNo: PhoneNo,
        email: Email,
        description: Description,
        openingBalance: Number(OpeningBalance),
        address: Address,
      };
      const response = await ModifySupplier(payload, String(token));
      if (response.status === 200 || response.status === 201) {
        setIsSuccess(true);
        setResponseBack(response.data.message || "Supplier added successfully");
        setShowList(true);
        SupplierGet();
        setSupplierName("");
        setID("");
        setCompanyName("");
        setEmail("");
        setPhoneNo("");
        setOpeningBalance("");
        setAddress("");
        setDescription("");
      } else {
        setIsSuccess(false);
        setResponseBack(response.data.message || "Request Failed");
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    SupplierGet();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setResponseBack("");
    }, 2000);
  }, [ResponseBack]);
  return (
    <div className="w-full relative">
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
            {ResponseBack && (
              <div
                className={`w-full text-center px-4 py-3 mb-2 rounded ${
                  isSuccess
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {ResponseBack}
              </div>
            )}
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
                  SupplierDelete();
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                {isDelete ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      <h2 className="text-2xl font-semibold text-gray-800">
        Supplier Management
      </h2>
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => {
              setShowList(!showList);
              setCompanyName("");
              setSupplierName("");
              setEmail("");
              setPhoneNo("");
              setOpeningBalance("");
              setAddress("");
              setDescription("");
              setUpdate(false);
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
                {SupplierList.length !== 0 ? (
                  <>
                    {SupplierList.map((item) => (
                      <div
                        key={item.supplierID}
                        className="mt-2 mb-2 p-4 border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition flex justify-between items-center"
                      >
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {item.supplierName}
                          </h3>
                          <p className="text-gray-600 mt-2">
                            Email: {item.email}
                          </p>
                          <p className="text-gray-600 mt-2">
                            PhoneNo: {item.phoneNo}
                          </p>
                          <p className="text-gray-600 mt-2">
                            Remaining Balance: {item.remainingBalance}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => {
                              fetchData(item.supplierID);
                              setID(item.supplierID);
                            }}
                            className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
                            title="Edit"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setIsOpen(true);
                              setID(item.supplierID);
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
          <div className="flex flex-col mt-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Supplier Name *
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <User className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  name="name"
                  placeholder="Enter supplier name"
                  className="w-full bg-transparent outline-none text-gray-900"
                />
              </div>
            </div>

            {/* Company */}
            {/* <div>
              <label className="block text-gray-700 font-medium mb-2">
                Company Name *
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <Building2 className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  value={CompanyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  name="company"
                  placeholder="Enter company name"
                  className="w-full bg-transparent outline-none text-gray-900"
                />
              </div>
            </div> */}

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <Mail className="text-gray-400 mr-2" size={18} />
                <input
                  type="email"
                  name="email"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="supplier@example.com"
                  className="w-full bg-transparent outline-none text-gray-900"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Phone
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <Phone className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  value={PhoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  name="phone"
                  placeholder="+92 300 1234567"
                  className="w-full bg-transparent outline-none text-gray-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Opening Balance
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <Coins className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  value={OpeningBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  name="address"
                  placeholder="Enter Opening Balance"
                  className="w-full bg-transparent outline-none text-gray-900 resize-none"
                />
              </div>
            </div>
            {/* <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <Tag className="text-gray-400 mr-2" size={18} />
                <select
                  name="category"
                  className="w-full p-1 bg-transparent outline-none text-gray-900"
                >
                  <option value="">Select category</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Food">Food</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
            </div> */}

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Address
              </label>
              <div className="flex items-start border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <MapPin className="text-gray-400 mr-2 mt-1" size={18} />
                <input
                  type="text"
                  name="address"
                  value={Address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full address"
                  className="w-full bg-transparent outline-none text-gray-900 resize-none"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <div className="flex items-start border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <Notebook className="text-gray-400 mr-2 mt-1" size={18} />
                <textarea
                  name="address"
                  value={Description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter full address"
                  className="w-full bg-transparent outline-none text-gray-900 resize-none"
                />
              </div>
            </div>

            {ResponseBack && (
              <div
                className={`w-full text-center px-4 py-3 mb-2 rounded ${
                  isSuccess
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {ResponseBack}
              </div>
            )}

            {/* Submit Button */}
            {update ? (
              <div className="md:col-span-2 flex justify-end mt-3">
                <button
                  type="button"
                  onClick={SuppleirModify}
                  className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            ) : (
              <div className="md:col-span-2 flex justify-end mt-3">
                <button
                  type="button"
                  onClick={SuppleirAdd}
                  className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
