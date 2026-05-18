"use client";
import { useState } from "react";
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
} from "lucide-react";

export default function SupplierledgerForm() {
  const [showList, setShowList] = useState(true);

  return (
    <div className="w-full relative">
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Supplier Ledger
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
        <div className="flex-1 mt-2 mb-2">
          <label className="block text-gray-700 font-medium mb-2">
            Supplier Name
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
            <User className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              name="name"
              placeholder="Enter supplier name"
              className="w-full bg-transparent outline-none text-gray-900"
            />
          </div>
        </div>
        {showList ? (
          <div className="p-4 border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">ABC_XYZ</h3>
              <p className="text-gray-600">Email: abc@email.com</p>
              <p className="text-gray-600">Remaining Balance: 20,100</p>
            </div>
            <div className="flex gap-4">
              <button
                //   onClick={() => FetchData(company.Id)}
                className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
                title="Edit"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
                title="Delete"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
          </div>
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
                name="description"
                placeholder="Enter Description"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none text-gray-900 resize-none"
                rows={3}
              />
            </div>

            {/* === Submit Button === */}
            <div className="flex justify-end pt-3">
              <button
                type="button"
                // onClick={insertCapital}
                className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
