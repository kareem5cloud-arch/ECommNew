"use client";
import React, { useState } from "react";
import { Info, Trash2, Plus, ChevronRight, ChevronLeft, X } from "lucide-react";

interface PurchaseItem {
  id: number;
  name: string;
  qty: number;
  price: number;
  total: number;
}

export default function PurchaseReturnModule() {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [returnType, setReturnType] = useState("refund");
  const [returnDate, setReturnDate] = useState(""); // New state for return date
  const [selectedOption, setSelectedOption] = useState("invoice");

  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [returnItems, setReturnItems] = useState<PurchaseItem[]>([]);
  const [exchangeItems, setExchangeItems] = useState<PurchaseItem[]>([]);
  const [newExchange, setNewExchange] = useState({
    name: "",
    qty: 0,
    price: 0,
  });
  const [showList, setShowList] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  // Dummy Data for Purchase Invoices (from suppliers)
  const dummyPurchases: Record<string, PurchaseItem[]> = {
    PUR001: [
      { id: 1, name: "Raw Cotton Fabric", qty: 10, price: 50, total: 500 },
      { id: 2, name: "Dye Chemicals", qty: 5, price: 200, total: 1000 },
      { id: 3, name: "Thread Spools", qty: 20, price: 10, total: 200 },
    ],
    PUR002: [
      { id: 4, name: "Buttons Pack", qty: 100, price: 5, total: 500 },
      { id: 5, name: "Zippers", qty: 50, price: 15, total: 750 },
    ],
  };

  const handleFetchInvoice = () => {
    if (dummyPurchases[invoiceNo]) {
      setPurchaseItems(dummyPurchases[invoiceNo]);
      setShowPopup(true);
    } else {
      alert("Please select a valid purchase invoice.");
    }
  };
  function handleQtyChange(id: number, value: string) {
    const qty = parseInt(value);
    if (!isNaN(qty) && qty >= 0) {
      setReturnItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, qty, total: qty * item.price } : item
        )
      );
    }
  }
  const handleAddReturn = (item: PurchaseItem) => {
    if (!returnItems.find((i) => i.id === item.id)) {
      setReturnItems((prev) => [...prev, item]);
    }
  };

  const handleRemoveReturn = (id: number) => {
    setReturnItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAddExchange = () => {
    if (newExchange.name && newExchange.qty > 0 && newExchange.price > 0) {
      const total = newExchange.qty * newExchange.price;
      setExchangeItems((prev) => [
        ...prev,
        { id: Date.now(), ...newExchange, total },
      ]);
      setNewExchange({ name: "", qty: 0, price: 0 });
    }
  };

  const handleRemoveExchange = (id: number) => {
    setExchangeItems((prev) => prev.filter((i) => i.id !== id));
  };

  const totalReturn = returnItems.reduce((sum, i) => sum + i.total, 0);
  const totalExchange = exchangeItems.reduce((sum, i) => sum + i.total, 0);

  const handleSave = () => {
    console.log({
      invoiceNo,
      returnType,
      returnDate,
      returnItems,
      exchangeItems,
      totalReturn,
      totalExchange,
    });
    alert("Purchase return saved successfully!");
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 transition">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Purchase Return Management
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

        {!showList && (
          <>
            <div className="p-6 rounded-xl max-w-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Search By
              </h2>

              <div className="flex flex-wrap gap-4">
                {/* Option 1 */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="inline-radio"
                    value="product"
                    checked={selectedOption === "product"}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 text-sm font-medium">
                    Product
                  </span>
                </label>

                {/* Option 2 */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="inline-radio"
                    value="invoice"
                    checked={selectedOption === "invoice"}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 text-sm font-medium">
                    Purchase Invoice No
                  </span>
                </label>
              </div>
            </div>
            {/* Invoice & Return Type */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {selectedOption === "product" ? (
                <div>
                  <label className="text-gray-600 font-medium mb-2 block">
                    Product Name
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={invoiceNo}
                      onChange={(e) => setInvoiceNo(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">-- Select Product --</option>
                      {Object.keys(dummyPurchases).map((inv) => (
                        <option key={inv}>{inv}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleFetchInvoice}
                      className="bg-blue-600 p-2.5 rounded-lg text-white hover:bg-blue-700"
                    >
                      <Info size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-gray-600 font-medium mb-2 block">
                    Select Purchase Invoice
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={invoiceNo}
                      onChange={(e) => setInvoiceNo(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">-- Select Purchase Invoice --</option>
                      {Object.keys(dummyPurchases).map((inv) => (
                        <option key={inv}>{inv}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleFetchInvoice}
                      className="bg-blue-600 p-2.5 rounded-lg text-white hover:bg-blue-700"
                    >
                      <Info size={18} />
                    </button>
                  </div>
                </div>
              )}
              <div>
                <label className="text-gray-600 font-medium mb-2 block">
                  Return Date
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-gray-600 font-medium mb-2 block">
                  Return Type
                </label>
                <select
                  value={returnType}
                  onChange={(e) => setReturnType(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="refund">Refund</option>
                  <option value="exchange">Exchange</option>
                  <option value="credit">Credit</option>
                </select>
              </div>
            </div>

            {/* Returned Items */}
            {returnItems.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4 shadow-sm mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  Returned Items
                </h3>
                <table className="w-full text-sm">
                  <thead className="text-gray-600 border-b">
                    <tr>
                      <th className="py-2 text-left">Item</th>
                      <th className="text-center">Qty</th>
                      <th className="text-center">Price</th>
                      <th className="text-center">Total</th>
                      <th className="text-center">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b hover:bg-gray-100 transition"
                      >
                        <td className="py-2">{item.name}</td>
                        <td className="text-center">
                          <input
                            type="number"
                            min={0}
                            value={item.qty}
                            onChange={(e) =>
                              handleQtyChange(item.id, e.target.value)
                            }
                            className="focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                            placeholder="Qty"
                            required
                          />
                        </td>
                        <td className="text-center">{item.price}</td>
                        <td className="text-center">{item.total}</td>
                        <td className="text-center">
                          <button
                            onClick={() => handleRemoveReturn(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Exchange Section */}
            {returnType === "exchange" && returnItems.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4 shadow-sm mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">
                  Exchange New Products
                </h3>
                <div className="flex flex-wrap gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newExchange.name}
                    onChange={(e) =>
                      setNewExchange({ ...newExchange, name: e.target.value })
                    }
                    className="flex-1 rounded-lg border border-gray-300 p-2.5"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={newExchange.qty}
                    onChange={(e) =>
                      setNewExchange({
                        ...newExchange,
                        qty: Number(e.target.value),
                      })
                    }
                    className="w-24 rounded-lg border border-gray-300 p-2.5 text-center"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newExchange.price}
                    onChange={(e) =>
                      setNewExchange({
                        ...newExchange,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-32 rounded-lg border border-gray-300 p-2.5 text-center"
                  />
                  <button
                    onClick={handleAddExchange}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                {exchangeItems.length > 0 && (
                  <table className="w-full text-sm">
                    <thead className="text-gray-600 border-b">
                      <tr>
                        <th className="py-2 text-left">Product</th>
                        <th className="text-center">Qty</th>
                        <th className="text-center">Price</th>
                        <th className="text-center">Total</th>
                        <th className="text-center">Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exchangeItems.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b hover:bg-gray-100 transition"
                        >
                          <td className="py-2">{item.name}</td>
                          <td className="text-center">{item.qty}</td>
                          <td className="text-center">{item.price}</td>
                          <td className="text-center">{item.total}</td>
                          <td className="text-center">
                            <button
                              onClick={() => handleRemoveExchange(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Summary */}
            {returnItems.length > 0 && (
              <div className="flex justify-between items-center bg-blue-50 rounded-xl p-4 mt-4 shadow-sm">
                <h3 className="text-gray-700 font-semibold">
                  Total Return:{" "}
                  <span className="text-blue-700 font-bold">
                    Rs {totalReturn}
                  </span>
                </h3>
                {returnType === "exchange" ? (
                  <h3 className="text-gray-700 font-semibold">
                    Total Exchange:{" "}
                    <span className="text-blue-700 font-bold">
                      Rs {totalExchange}
                    </span>
                  </h3>
                ) : (
                  <h3 className="text-green-700 font-semibold">
                    Refund Rs {totalReturn}
                  </h3>
                )}
                <h3 className="text-gray-700 font-semibold">
                  Total Amount:{" "}
                  <span className="text-blue-700 font-bold">
                    Rs {totalReturn - totalExchange}
                  </span>
                </h3>
              </div>
            )}

            {returnItems.length > 0 && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700"
                >
                  Save Return
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* --- Sleek Popup Modal --- */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Purchase Invoice {invoiceNo} – Purchased Items
            </h3>
            <table className="w-full text-sm">
              <thead className="text-gray-600 border-b">
                <tr>
                  <th className="py-2 text-left">Name</th>
                  <th className="text-center">Qty</th>
                  <th className="text-center">Price</th>
                  <th className="text-center">Total</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {purchaseItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="py-2">{item.name}</td>
                    <td className="text-center">{item.qty}</td>
                    <td className="text-center">{item.price}</td>
                    <td className="text-center">{item.total}</td>
                    <td className="text-center">
                      <button
                        onClick={() => handleAddReturn(item)}
                        className="text-blue-600 hover:text-blue-800 "
                      >
                        <Plus size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
