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
  Calendar,
  List,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AddExpense from "@/api/lib/PosIntegration/Expense/AddExpense";
import {
  ExpenseData,
  ResponseExpenseGetData,
} from "@/api/types/PosIntegration/Expense/expense";
import GetExpense from "@/api/lib/PosIntegration/Expense/GetExpense";
import Spinner from "@/component/spinner/page";
import DeleteExpense from "@/api/lib/PosIntegration/Expense/DeleteExpense";
import ModifyExpense from "@/api/lib/PosIntegration/Expense/ExpenseModify";
import GetExpenseList from "@/api/lib/PosIntegration/Expense/GetExpenseList";

interface expenseResponse {
  message: string;
  expenseTypeList: expenseTypeList[];
}
interface expenseTypeList {
  expenseType: string;
}

export default function ExpenseForm() {
  const router = useRouter();
  const [showList, setShowList] = useState(true);
  const [ExpenseName, setExpenseName] = useState("");
  const [ExpenseDate, setExpenseDate] = useState("");
  const [ExpenseType, setExpenseType] = useState("");
  const [ExpenseAmount, setExpenseAmount] = useState("");
  const [Description, setDescription] = useState("");
  const [ResponseBack, setResponseBack] = useState("");
  const [ID, setID] = useState("");
  const [loading, setLoading] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [ShowMessage, setShowMessage] = useState(false);

  const [update, setUpdate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const [ExpenseList, setExpenseList] = useState<ExpenseData[]>([]);
  const [ExpenseTypeList, setExpenseTypeList] = useState<expenseTypeList[]>([]);

  const addExpense = async () => {
    const token = localStorage.getItem("tokenPosSale");
    if (!token) return router.push("/posSalePoint/login");
    try {
      setLoading(true);
      const formData = {
        expenseName: ExpenseName,
        expenseType: ExpenseType,
        amount: Number(ExpenseAmount),
        description: Description,
        expenseDate: ExpenseDate,
      };
      const response = await AddExpense(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        // SupplierGet();
        ExpenseGet();
        ExpenseListGet();
        setExpenseType("");
        setDescription("");
        setExpenseName("");
        setExpenseAmount("");
        setResponseBack(response.data.message || "Expense Added Successfully");
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
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const ExpenseGet = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("tokenPosSale");
      const response = await GetExpense(String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as ResponseExpenseGetData;
        setExpenseList(data.expenseList || []);
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      }
    } catch (err) {
      // setResponseBack(3);
    } finally {
      setIsLoading(false);
    }
  };
  const ExpenseListGet = async () => {
    try {
      const token = localStorage.getItem("tokenPosSale");
      const response = await GetExpenseList(String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as expenseResponse;
        setExpenseTypeList(data.expenseTypeList || []);
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      }
    } catch (err) {
      // setResponseBack(3);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = (customerID: string) => {
    setShowList(false);
    setUpdate(true);
    const data = ExpenseList.find((item) => item.expenseID === customerID);
    if (data) {
      setID(data.expenseID);
      setExpenseName(data.expenseName);
      const date = new Date(data.postingDate);
      setExpenseDate(date.toISOString().split("T")[0]);
      setExpenseType(data.expenseType);
      setDescription(data.description);
      setExpenseAmount(String(data.amount));
    }
  };

  const ExpenseDelete = async () => {
    try {
      setIsDelete(true);
      const token = localStorage.getItem("tokenPosSale");
      const response = await DeleteExpense(ID, String(token));
      if (response.status === 200 || response.status === 201) {
        setExpenseList((item) => item.filter((emp) => emp.expenseID !== ID));
        setIsOpen(false);
        setID("");
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      }
    } catch (err) {
      setIsOpen(true);
    } finally {
      setIsDelete(false);
    }
  };
  const ExpenseModify = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("tokenPosSale");
      const formData = {
        expenseID: ID,
        expenseName: ExpenseName,
        expenseType: ExpenseType,
        amount: Number(ExpenseAmount),
        description: Description,
        expenseDate: ExpenseDate,
      };
      const response = await ModifyExpense(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        ExpenseGet();
        ExpenseListGet();
        setID("");
        setExpenseType("");
        setDescription("");
        setExpenseName("");
        setExpenseAmount("");
        setResponseBack(
          response.data.message || "Expense Modified Successfully",
        );
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
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    ExpenseGet();
    ExpenseListGet();
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
                  ExpenseDelete();
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                {isDelete ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Expense Management
          </h2>
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
            {isloading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : (
              <>
                {ExpenseList.length !== 0 ? (
                  <>
                    {ExpenseList.map((item) => (
                      <div
                        key={item.expenseID}
                        className="p-4 border mt-2 border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition flex justify-between items-center"
                      >
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {item.expenseName}
                          </h3>
                          <p className="text-gray-600">
                            Expense Type: {item.expenseType}
                          </p>
                          <p className="text-gray-600">
                            Expense Amount: {item.amount}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => fetchData(item.expenseID)}
                            className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
                            title="Edit"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setID(item.expenseID);
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
          <div className="gap-5 mt-2">
            {/* Expense Name */}
            <div className="mt-2">
              <label className="block text-gray-700 font-medium mb-2">
                Expense Date
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <Calendar className="text-gray-400 mr-2" size={18} />
                <input
                  type="date"
                  value={ExpenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  name="address"
                  placeholder="Enter Expense Date"
                  className="w-full bg-transparent outline-none text-gray-900 resize-none"
                />
              </div>
            </div>
            <div className="mt-2">
              <label className="block text-gray-700 font-medium mb-2">
                Expense Name
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <User className="text-gray-400 mr-2" size={18} />
                <input
                  value={ExpenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  type="text"
                  name="name"
                  placeholder="Enter Expense Name"
                  className="w-full bg-transparent outline-none text-gray-900"
                />
              </div>
            </div>

            {/* Expense Type */}
            <div className="mt-2">
              <label className="block text-gray-700 font-medium mb-2">
                Expense Type
              </label>

              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <List className="text-gray-400 mr-2" size={18} />

                <input
                  value={ExpenseType}
                  onChange={(e) => setExpenseType(e.target.value)}
                  list="expense-types"
                  type="text"
                  placeholder="Enter Expense Type"
                  className="w-full bg-transparent outline-none text-gray-900"
                />
              </div>

              <datalist id="expense-types">
                {ExpenseTypeList.map((item) => (
                  <option value={item.expenseType} />
                ))}
              </datalist>
            </div>

            {/* Expense Amount */}
            <div className="mt-2">
              <label className="block text-gray-700 font-medium mb-2">
                Expense Amount
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <Coins className="text-gray-400 mr-2" size={18} />
                <input
                  value={ExpenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  type="text"
                  name="phone"
                  placeholder="Enter Expense Amount"
                  className="w-full bg-transparent outline-none text-gray-900"
                />
              </div>
            </div>

            {/* Expense Date */}

            {/* Description (Full width) */}
            <div className="w-full">
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <div className="flex items-start border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <Notebook className="text-gray-400 mr-2 mt-1" size={18} />
                <textarea
                  value={Description}
                  onChange={(e) => setDescription(e.target.value)}
                  name="address"
                  placeholder="Enter Description"
                  className="w-full bg-transparent outline-none text-gray-900 resize-none"
                  rows={3}
                />
              </div>
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
            {/* Submit Button (Full width) */}
            <div className="w-full flex justify-end mt-3">
              {update ? (
                <>
                  <button
                    type="button"
                    onClick={ExpenseModify}
                    className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
                  >
                    {loading ? "Updating..." : "Update"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={addExpense}
                    className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
