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
  Calendar,
} from "lucide-react";
import {
  ResponseSupplierGetData,
  SupplierData,
} from "@/api/types/PosIntegration/Suppplier/addSupplier";
import { useRouter } from "next/navigation";
import GetSupplier from "@/api/lib/PosIntegration/Supplier/GetSupplier";
import Getledger from "@/api/lib/PosIntegration/SupplierLedegr/GetLedger";
import {
  ResponseSupplierLedgerGet,
  supplierLedgerGet,
} from "@/api/types/PosIntegration/SupplierLedger/SupplierLedger";
import Spinner from "@/component/spinner/page";
import AddLedger from "@/api/lib/PosIntegration/SupplierLedegr/AddLedger";
import ModifyLedger from "@/api/lib/PosIntegration/SupplierLedegr/ModifySupplier";
import Deleteledger from "@/api/lib/PosIntegration/SupplierLedegr/DeleteLedger";
import GetArrear from "@/api/lib/PosIntegration/SupplierLedegr/SupplierArrear";

export default function SupplierledgerForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [update, setUpdate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const [ResponseBack, setResponseBack] = useState("");
  const [SupplierList, setSupplierList] = useState<SupplierData[]>([]);
  const [LedgerList, setLedgerList] = useState<supplierLedgerGet[]>([]);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [ID, setID] = useState("");
  const [supplierID, setSupplierID] = useState("");
  const [postingDate, setPostingDate] = useState("");
  const [Amount, setAmount] = useState("");
  const [Description, setDescription] = useState("");
  const [arrear, setArrear] = useState("");

  const SupplierGet = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await GetSupplier(String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as ResponseSupplierGetData;
        setSupplierList(data.supplierList || []);
        setSupplierID(data.supplierList[0].supplierID);
        // Ledgerget(data.supplierList[0].supplierID);
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      }
    } catch (err) {
      // setResponseBack(3);
    }
  };
  const Ledgerget = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const paylaod = {
        dateFrom: dateFrom,
        dateTo: dateTo,
      };
      const response = await Getledger(paylaod, String(token), supplierID);
      if (response.status === 200 || response.status === 201) {
        const data = response.data as ResponseSupplierLedgerGet;
        console.log(data);
        setLedgerList(data.ledgerList || []);
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const ArrearGet = async (ID: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await GetArrear(String(token), ID);
      if (response.status === 200 || response.status === 201) {
        const data = response.data as any;
        setArrear(data.supplierArrear[0].remaningAmount);
        console.log(data);
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const LedgerAdd = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const payload = {
        supplierID: supplierID,
        postingDate: postingDate,
        debitAmount: Number(Amount),
        additionalInfo: Description,
      };
      const response = await AddLedger(payload, String(token));

      if (response.status === 200 || response.status === 201) {
        Ledgerget();
        setIsSuccess(true);
        setResponseBack(response.data.message || "Supplier added successfully");
        setAmount("");
        setDescription("");
        setPostingDate("");
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
  const LedgerModify = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const payload = {
        ledgerID: ID,
        supplierID: supplierID,
        postingDate: postingDate,
        debitAmount: Number(Amount),
        additionalInfo: Description,
      };
      const response = await ModifyLedger(payload, String(token));

      if (response.status === 200 || response.status === 201) {
        setIsSuccess(true);
        Ledgerget();
        setResponseBack(response.data.message || "Supplier added successfully");
        setAmount("");
        setID("");
        setDescription("");
        setPostingDate("");
        setShowList(true);
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

  const fetchData = (ID: string) => {
    setUpdate(true);
    setShowList(false);
    const data = LedgerList.find((item) => item.ledgerID === ID);
    if (data) {
      setDescription(data.additionalInfo);
      setAmount(String(data.debitAmount));
      setPostingDate(data.postingDate ? data.postingDate.split("T")[0] : "");
    }
  };
  const LedgerDelete = async () => {
    setIsDelete(true);
    try {
      const token = localStorage.getItem("token");
      const response = await Deleteledger(String(token), ID);
      if (response.status === 200 || response.status === 201) {
        setIsOpen(false);
        setIsSuccess(true);
        setResponseBack(response.data.message || "Supplier added successfully");
        LedgerList.filter((item) => item.ledgerID !== ID);
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      } else {
        setIsSuccess(false);
        setResponseBack(response.data.message || "Supplier added successfully");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsDelete(false);
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
                  LedgerDelete();
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                {isDelete ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      <h2 className="text-2xl font-semibold text-gray-800">Supplier Ledger</h2>
      <div className="mt-5  w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
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
        <div className="flex-1 mt-2 mb-2">
          <label className="block text-gray-700 font-medium mb-2">
            Supplier Name
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
            <User className="text-gray-400 mr-2" size={18} />
            <select
              value={supplierID}
              onChange={(e) => {
                setSupplierID(e.target.value);
                ArrearGet(e.target.value);
              }}
              className="text-black w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SupplierList.length !== 0 ? (
                <>
                  {SupplierList.map((item) => (
                    <option className="p-2" value={item.supplierID}>
                      {item.supplierName}
                    </option>
                  ))}
                </>
              ) : (
                <option value="">No Record Found</option>
              )}
            </select>
          </div>
        </div>

        {showList ? (
          <>
            <div className="flex gap-2 w-full">
              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-2">
                  Date From
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 ">
                  <Calendar className="text-gray-400 mr-2" size={18} />
                  <input
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    type="date"
                    className="text-black w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-2">
                  Date To
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 ">
                  <Calendar className="text-gray-400 mr-2" size={18} />
                  <input
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    type="date"
                    className="text-black w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => Ledgerget()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Search
            </button>
            <>
              {loading ? (
                <div className="flex justify-center py-10">
                  <Spinner />
                </div>
              ) : (
                <>
                  {LedgerList.length !== 0 ? (
                    <>
                      {LedgerList.map((item) => (
                        <div
                          key={item.ledgerID}
                          className="mt-2 mb-2 p-4 border border-gray-200 rounded-md shadow-sm hover: transition flex justify-between items-center"
                        >
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {item.postingDate === "" ? (
                                <></>
                              ) : (
                                <>
                                  {new Date(
                                    item.postingDate
                                  ).toLocaleDateString("en-US", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </>
                              )}
                            </h3>

                            <p className="text-gray-600 mt-2">
                              <span className="font-bold">
                                Running Balance:{" "}
                              </span>
                              {item.creditAmount}
                            </p>
                            <p className="text-gray-600 mt-2">
                              <span className="font-bold">Debit Amount: </span>
                              {item.debitAmount}
                            </p>
                            <p className="text-gray-600 mt-2"></p>
                            <p className="text-gray-600 mt-2">
                              <span className="font-bold">Description:</span>{" "}
                              {item.additionalInfo}
                            </p>
                          </div>
                          <div className="flex gap-4">
                            <button
                              onClick={() => {
                                fetchData(item.ledgerID);
                                setID(item.ledgerID);
                              }}
                              className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
                              title="Edit"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                setIsOpen(true);
                                setID(item.ledgerID);
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
          </>
        ) : (
          <div className="space-y-5 mt-2">
            {/* === Row: Supplier Name + Arrear === */}
            <div className="flex flex-col md:flex-row gap-5">
              {/* Supplier Name */}

              {/* Arrear */}
              <div className="flex-1">
                <label className="block text-gray-700 font-medium mb-2">
                  Arrear
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                  <Building2 className="text-gray-400 mr-2" size={18} />
                  <input
                    value={arrear}
                    type="text"
                    name="arrear"
                    placeholder="0"
                    className="w-full bg-transparent outline-none text-gray-900"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* === Column: Payment Date === */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Payment Date
              </label>
              <input
                value={postingDate}
                onChange={(e) => setPostingDate(e.target.value)}
                type="date"
                name="paymentDate"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none text-gray-900"
              />
            </div>

            {/* === Column: Amount === */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Amount
              </label>
              <input
                value={Amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                name="amount"
                placeholder="Enter amount"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none text-gray-900"
              />
            </div>

            {/* === Column: Description === */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                value={Description}
                onChange={(e) => setDescription(e.target.value)}
                name="description"
                placeholder="Enter Description"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none text-gray-900 resize-none"
                rows={3}
              />
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
            {/* === Submit Button === */}
            {update ? (
              <div className="md:col-span-2 flex justify-end mt-3">
                <button
                  type="button"
                  onClick={LedgerModify}
                  className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            ) : (
              <div className="md:col-span-2 flex justify-end mt-3">
                <button
                  type="button"
                  onClick={LedgerAdd}
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
