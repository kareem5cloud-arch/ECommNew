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

export default function CustomerForm() {
  const router = useRouter();
  const [showList, setShowList] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [address, setAddress] = useState("");
  const [Email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [RescponseBack, setRersponseBack] = useState("");
  const [ID, setID] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [Update, setUpdate] = useState(false);

  const [CustomerList, setCustomerList] = useState<CustomerData[]>([]);

  const addCustoemr = async () => {
    const token = localStorage.getItem("tokenPosSale");
    if (!token) return router.push("/posSalePoint/login");
    try {
      setLoading(true);
      const formData = {
        customerName: customerName,
        phoneNo: phoneNo,
        email: Email,
        description: description,
        openingBalance: Number(openingBalance),
        address: address,
      };
      const response = await AddCustomer(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        SupplierGet();
        setEmail("");
        setAddress("");
        setDescription("");
        setOpeningBalance("");
        setCustomerName("");
        setPhoneNo("");
        setRersponseBack(
          response.data.message || "Customer Added Successfully",
        );
        setShowMessage(true);
      } else if (response.status === 400) {
        setRersponseBack(
          response.data.message || "PLease Fill in All Required Fields",
        );
        setShowMessage(false);
      } else {
        setRersponseBack(
          response.data.message ||
            "Something Went Wrong. Please Try Again later.",
        );
        setShowMessage(false);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const SupplierGet = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("tokenPosSale");
      const response = await GetCustomer(String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as ResponseCustomerGetData;
        setCustomerList(data.customerList || []);
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      }
    } catch (err) {
      // setResponseBack(3);
    } finally {
      setIsLoading(false);
    }
  };
  const CustomerDelete = async () => {
    setIsDelete(true);
    try {
      const token = localStorage.getItem("tokenPosSale");
      const response = await DeleteCustomer({ customerID: ID }, String(token));
      if (response.status === 200 || response.status === 201) {
        setIsOpen(false);
        setID("");
        setCustomerList((item) => item.filter((emp) => emp.customerID !== ID));
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      }
    } catch (err) {
      setIsOpen(true);
    } finally {
      setIsDelete(false);
    }
  };
  const fetchData = (customerID: string) => {
    setShowList(false);
    setUpdate(true);
    const data = CustomerList.find((item) => item.customerID === customerID);
    if (data) {
      setID(data.customerID);
      setEmail(data.email);
      setCustomerName(data.customerName);
      setOpeningBalance(String(data.remainingBalance));
      setDescription(data.description);
      setPhoneNo(data.phoneNo);
      setAddress(data.address);
    }
  };
  const CustomerModify = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("tokenPosSale");
      const payload = {
        customerID: ID,
        customerName: customerName,
        phoneNo: phoneNo,
        email: Email,
        description: description,
        openingBalance: Number(openingBalance),
        address: address,
      };
      const response = await ModifyCustomer(payload, String(token));
      if (response.status === 200 || response.status === 201) {
        SupplierGet();
        setShowMessage(true);
        setRersponseBack(
          response.data.message || "Customer Modified successfully",
        );
        setShowList(true);
        setCustomerName("");
        setID("");
        setEmail("");
        setPhoneNo("");
        setOpeningBalance("");
        setAddress("");
        setDescription("");
      } else {
        setShowMessage(false);
        setRersponseBack(
          response.data.message ||
            "SomeThing went Wrong. Please try Again later.",
        );
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
      if (showMessage) {
        setRersponseBack("");
        setShowMessage(false);
      }
    }, 2000);
  }, [showMessage, RescponseBack]);

  return (
    <div className="w-full relative">
      <h2 className="text-2xl font-semibold text-gray-800">
        Customer Management
      </h2>
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
                  CustomerDelete();
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
                            onClick={() => fetchData(item.customerID)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 mt-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <User className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  name="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter Customer Name"
                  className="w-full bg-transparent outline-none text-gray-900"
                />
              </div>
            </div>

            {/* Email */}

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <Phone className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  name="phone"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full bg-transparent outline-none text-gray-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <Mail className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  name="phone"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
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
                  name="address"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  placeholder="Enter Opening Balance"
                  className="w-full bg-transparent outline-none text-gray-900 resize-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Address
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <MapPin className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  name="address"
                  value={address}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter full address"
                  className="w-full bg-transparent outline-none text-gray-900 resize-none"
                  rows={3}
                />
              </div>
            </div>
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
                    onClick={CustomerModify}
                    className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
                  >
                    {loading ? "Updating..." : "Update"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={addCustoemr}
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
