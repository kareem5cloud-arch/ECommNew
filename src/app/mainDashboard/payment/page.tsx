"use client";

import AddPayment from "@/api/lib/payment/addPayment/addPayment";
import DeletePaymentApi from "@/api/lib/payment/deletePayment/deletePayment";
import GetPayment from "@/api/lib/payment/getPayment/getPayment";
import UpdatePaymentApi from "@/api/lib/payment/updatePayment/updatePayment";
import {
  paymentget,
  paymentgetApiResponse,
} from "@/api/types/payment/getpayment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SubCategoryMobileModern() {
  const router = useRouter();
  const [mode, setMode] = useState("list");
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [responseBack, setResponseBack] = useState(0);

  const [bankName, setBankName] = useState("");
  const [accountTitle, setAccountTitle] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ID, setID] = useState("");

  const [paymentList, setPaymentList] = useState<paymentget[]>([]);

  const addPayment = async () => {
    if (!bankName || !accountTitle || !accountNumber) return setResponseBack(2);
    else {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = {
        bankName: bankName,
        accountTitle: accountTitle,
        accountNumber: accountNumber,
      };
      const response = await AddPayment(formData, String(token));
      console.log(response);
      if (response.status === 200 || response.status == 201) {
        setLoading(false);
        getpayment();
        setResponseBack(1);
        setBankName("");
        setAccountTitle("");
        setAccountNumber("");
        return;
      } else if (response.status == 401) {
        router.push("/sellerlogin");
        return;
      } else {
        setResponseBack(3);
        setLoading(false);
        return;
      }
    }
  };

  const getpayment = async () => {
    const token = localStorage.getItem("token");
    const response = await GetPayment(String(token), {});
    if (response.status === 200 || response.status == 201) {
      const data = response.data as paymentgetApiResponse;
      setPaymentList(data.paymentMethod);
    } else if (response.status == 401) {
      router.push("/sellerlogin");
      return;
    }
  };

  const fetchData = (ID: string) => {
    setMode("form");
    setUpdate(true);
    const data = paymentList.find((item) => item.paymentID === ID);
    if (data) {
      setBankName(data.bankName);
      setAccountNumber(data.accountNumber);
      setAccountTitle(data.accountTitle);
      setID(ID);
    }
  };

  const UpdatePayment = async () => {
    if (!bankName || !accountTitle || !accountNumber) return setResponseBack(2);
    else {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = {
        paymentID: ID,
        bankName: bankName,
        accountTitle: accountTitle,
        accountNumber: accountNumber,
      };
      const response = await UpdatePaymentApi(formData, String(token));
      console.log(response);
      if (response.status === 200 || response.status == 201) {
        getpayment();
        setLoading(false);
        setBankName("");
        setAccountTitle("");
        setAccountNumber("");
        setID("");
        setMode("list");
        setUpdate(false);
        return;
      } else if (response.status == 401) {
        router.push("/sellerlogin");
        return;
      } else {
        setResponseBack(3);
        setLoading(false);
        return;
      }
    }
  };

  const deletePayment = async (ID: string) => {
    const token = localStorage.getItem("token");
    const formData = {
      paymentID: ID,
    };
    const response = await DeletePaymentApi(formData, String(token));
    if (response.status === 200 || response.status === 201) {
      console.log(response);
      setID("");
      setPaymentList((item) => item.filter((emp) => emp.paymentID !== ID));
    }
    if (response.status === 401) {
      router.push("/sellerlogin");
    } else if (response.status === 500) setResponseBack(3);
  };

  useEffect(() => {
    getpayment();
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
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payment Management</h1>
        <button
          onClick={() => {
            setMode(mode === "list" ? "form" : "list");
            setBankName("");
            setAccountNumber("");
            setAccountTitle("");
            setID("");
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          {mode === "list" ? "Add New" : "Back"}
        </button>
      </div>
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
                  deletePayment(ID);
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
      {/* LIST VIEW */}
      {mode === "list" && (
        <div className="space-y-4">
          <div className="space-y-4">
            {paymentList?.length === 0 ? (
              <div className="w-full bg-red-100 text-red-800 text-center px-4 py-3 mb-2 rounded">
                No Record Found
              </div>
            ) : (
              paymentList?.map((item) => (
                <div
                  key={item.paymentID}
                  className="bg-white rounded-xl p-4 shadow flex justify-between items-center hover:shadow-lg transition"
                >
                  <div>
                    <h2 className="font-semibold text-gray-800">
                      {item.accountTitle}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {item.accountNumber}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchData(item.paymentID)}
                      className="px-3 py-1 text-yellow-500 border border-yellow-500 rounded hover:bg-yellow-50 transition hover:bg-yellow-500 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setIsOpen(true);
                        setID(item.paymentID);
                      }}
                      className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50 transition hover:bg-red-500 hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* FORM VIEW (Modern) */}
      {mode === "form" && (
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Add Bank Account
          </h2>
          <div className="space-y-5">
            {/* Bank Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Bank Name
              </label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className={`w-full px-3 py-3 border rounded-md ${
                  responseBack === 2 && !bankName
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
              />
            </div>

            {/* Account Title */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Account Title
              </label>
              <input
                type="text"
                required
                value={accountTitle}
                onChange={(e) => setAccountTitle(e.target.value)}
                className={`w-full px-3 py-3 border rounded-md ${
                  responseBack === 2 && !accountTitle
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Account Number
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className={`w-full px-3 py-3 border rounded-md ${
                  responseBack === 2 && !accountNumber
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
              />
            </div>

            {/* Response Messages */}
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
                Record Added Successfully
              </div>
            )}
            {responseBack === 4 && (
              <div className="w-full bg-green-100 text-green-800 text-center px-4 py-3 mb-2 rounded">
                Record Modified Successfully
              </div>
            )}

            {/* Submit Button */}
            {update ? (
              <button
                onClick={UpdatePayment}
                type="button"
                className="w-full py-3 bg-indigo-500 text-white rounded-xl font-semibold shadow-lg hover:bg-indigo-600 transition-all"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            ) : (
              <button
                onClick={addPayment}
                type="button"
                className="w-full py-3 bg-indigo-500 text-white rounded-xl font-semibold shadow-lg hover:bg-indigo-600 transition-all"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
