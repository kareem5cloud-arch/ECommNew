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
  Download,
} from "lucide-react";
import LedgerGetArrear from "@/api/lib/PosIntegration/Ledger/LedgerGetArrear/ledgerGetArrear";
import GetCustomer from "@/api/lib/PosIntegration/Customer/GetCustomer";
import {
  CustomerData,
  ResponseCustomerGetData,
} from "@/api/types/PosIntegration/Customer/CustomerType";
import { useRouter } from "next/navigation";
import AddLedgerCustomer from "@/api/lib/PosIntegration/Ledger/AddLedger/AddLedger";
import GetArrear from "@/api/lib/PosIntegration/SupplierLedegr/SupplierArrear";
import GetledgerCustomer from "@/api/lib/PosIntegration/Ledger/GetCustomerLedger/CustomerLedgerGet";
import {
  CustomerLedgerGet,
  ResponseCustomerLedgerGet,
} from "@/api/types/PosIntegration/ledger/ledger";
import Spinner from "@/component/spinner/page";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function CustomerledgerForm() {
  const router = useRouter();
  const [showList, setShowList] = useState(true);
  const [loading, setLoading] = useState(false);
  const [ledgerloading, setledgerLoading] = useState(false);
  const [customerID, setCustomerID] = useState("");
  const [CustomerList, setCustomerList] = useState<CustomerData[]>([]);
  const [LedgerList, setLedgerList] = useState<CustomerLedgerGet[]>([]);
  const [arrear, setArrear] = useState(0);
  const [amount, setAmount] = useState(0);
  const [remarks, setremarks] = useState("");
  const [postingDate, setPostingDate] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [ResponseBack, setResponseBack] = useState("");
  const [ShowMessage, setShowMessage] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const exportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // Title
    doc.setFontSize(14);
    doc.text("Customer Ledger Statement", 14, 15);

    // Table Columns
    const tableColumn = [
      "Date",
      "Type",
      "Description",
      "Debit",
      "Credit",
      "Balance",
    ];

    let runningBalance = 0;

    // Table Rows
    const tableRows = LedgerList.map((item) => {
      const debit = Number(item.debitAmount) || 0;
      const credit = Number(item.creditAmount) || 0;

      runningBalance += credit - debit;

      return [
        item.postingDate ? new Date(item.postingDate).toLocaleDateString() : "",
        item.entryType,
        item.additionalInfo || "",
        debit !== 0 ? debit.toFixed(2) : "",
        credit !== 0 ? credit.toFixed(2) : "",
        (item.creditAmount - item.debitAmount).toFixed(2),
      ];
    });

    // Generate Table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 22,
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185], // blue header
        textColor: 255,
      },
      columnStyles: {
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
      },
    });

    // Save PDF
    doc.save("Customer_Ledger.pdf");
  };

  const FetchArrear = async (ID: string) => {
    const token = localStorage.getItem("tokenPosSale");
    const response = await LedgerGetArrear(String(token), ID);
    if (response.status === 200) {
      const data = response.data as any;
      setArrear(data.arrear);
    } else {
      setArrear(0);
    }
  };
  const CustomerGet = async () => {
    const token = localStorage.getItem("tokenPosSale");
    const response = await GetCustomer(String(token));
    if (response.status === 200 || response.status === 201) {
      const data = response.data as ResponseCustomerGetData;
      setCustomerList(data.customerList || []);
      setCustomerID(data.customerList[0].customerID);
      FetchArrear(data.customerList[0].customerID);
    } else if (response.status === 401) {
      router.push("/sellerlogin");
    }
  };

  const addLedger = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("tokenPosSale");
      const formData = {
        customerID: customerID,
        postingDate: postingDate,
        amount: amount,
        remarks: remarks,
        remaningAmount: arrear,
      };
      const response = await AddLedgerCustomer(formData, String(token));
      if (response.status === 200) {
        FetchArrear(customerID);
        getLedger();
        setAmount(0);
        setremarks("");
        setResponseBack(response.data.message || "Record Added Successfully");
        setShowMessage(true);
      } else if (response.status === 400) {
        setResponseBack(
          response.data.message || "PLease Fill in All Required Fields",
        );
        setShowMessage(false);
      } else {
        setResponseBack(
          response.data.message ||
            "Something Went Wrong. Please Try Again later.",
        );
        setShowMessage(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const getLedger = async () => {
    try {
      setledgerLoading(true);
      const token = localStorage.getItem("tokenPosSale");
      const formData = {
        dateFrom: dateFrom,
        dateTo: dateTo,
      };
      const response = await GetledgerCustomer(
        formData,
        String(token),
        customerID,
      );
      if (response.status === 200 || response.status === 201) {
        const data = response.data as ResponseCustomerLedgerGet;
        console.log(data);
        setLedgerList(data.ledgerList || []);
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setledgerLoading(false);
    }
  };

  useEffect(() => {
    const date = new Date().toISOString().split("T")[0];
    setPostingDate(date);
    CustomerGet();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (ShowMessage) {
        setResponseBack("");
        setShowMessage(false);
      }
    }, 2000);
  }, [ShowMessage, ResponseBack]);
  return (
    <div className="w-full relative">
      <h2 className="text-2xl font-semibold text-gray-800">Customer Ledger</h2>
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
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
            Customer Name
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
            <User className="text-gray-400 mr-2" size={18} />
            <select
              onChange={(e) => {
                setCustomerID(e.target.value);
                FetchArrear(e.target.value);
              }}
              className="w-full bg-transparent outline-none text-gray-900"
            >
              {CustomerList.length > 0 ? (
                <>
                  {CustomerList.map((item) => (
                    <option key={item.customerID} value={item.customerID}>
                      {item.customerName}
                    </option>
                  ))}
                </>
              ) : (
                <option>No Record Found</option>
              )}
            </select>
          </div>
        </div>
        {showList ? (
          <>
            <div className="flex gap-2 w-full">
              <div className="w-full">
                <label className="block text-gray-700 font-medium mt-1">
                  Date From
                </label>
                <div className="flex items-center  rounded-lg">
                  <input
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    type="date"
                    className="text-black w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="w-full">
                <label className="block text-gray-700 font-medium mt-1">
                  Date To
                </label>
                <div className="flex items-center  rounded-lg ">
                  <input
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    type="date"
                    className="text-black w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end">
              <button
                onClick={() => getLedger()}
                className="flex items-center mt-2 mb-2 gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>
            <>
              {ledgerloading ? (
                <div className="flex justify-center py-10">
                  <Spinner />
                </div>
              ) : (
                <>
                  {LedgerList.length !== 0 ? (
                    <>
                      <button
                        onClick={exportPDF}
                        className="px-4 py-2 bg-green-600 text-white rounded-md"
                      >
                        <span className="flex gap-2 ">
                          <Download /> Export PDF
                        </span>
                      </button>

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
                                    item.postingDate,
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
                              // onClick={() => {
                              //   fetchData(item.ledgerID);
                              //   setID(item.ledgerID);
                              // }}
                              className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
                              title="Edit"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>
                            <button
                              // onClick={() => {
                              //   setIsOpen(true);
                              //   setID(item.ledgerID);
                              // }}
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
            {/* === Row: Customer Name + Arrear === */}
            <div className="flex flex-col md:flex-row gap-5">
              {/* Customer Name */}

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
                    className="w-full text-right bg-transparent outline-none text-gray-900"
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
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
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
                value={remarks}
                onChange={(e) => setremarks(e.target.value)}
                name="description"
                placeholder="Enter payment description"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none text-gray-900 resize-none"
                rows={3}
              />
            </div>
            {ResponseBack && (
              <div
                className={`w-full text-center px-4 py-3 mb-2 rounded ${
                  ShowMessage
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {ResponseBack}
              </div>
            )}
            {/* === Submit Button === */}
            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={addLedger}
                className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
