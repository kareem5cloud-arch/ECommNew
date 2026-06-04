"use client";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import {
  CheckCheck,
  Clock,
  CreditCard,
  Eye,
  MapPin,
  Truck,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

// Type Definitions
interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  status: "pending" | "approved" | "rejected";
  bags?: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  orderDate: Date;
  status: "Delivered" | "Completed" | "Cancelled";
  items: OrderItem[];
  paymentMethod: string;
  shippingAddress: string;
  courierService: string;
  trackingNumber?: string;
  totalAmount: number;
}

export default function OrderConfirmation() {
  const [DateFrom, setDateFrom] = useState("");
  const [DateTo, setDateTo] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const status = ["Delivered", "Completed", "Cancelled"];
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [bags, setBags] = useState<Record<string, number>>({});

  const initialOrders: Order[] = [
    {
      id: "ORD-001",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      orderDate: new Date(2024, 2, 15),
      status: "Delivered",
      paymentMethod: "Credit Card (VISA)",
      shippingAddress: "123 Main St, New York, NY 10001",
      courierService: "FedEx Express",
      trackingNumber: "FX-92837465",
      totalAmount: 189.99,
      items: [
        {
          id: "i1",
          productName: "Wireless Headphones",
          quantity: 1,
          price: 79.99,
          status: "pending",
        },
        {
          id: "i2",
          productName: "USB-C Hub",
          quantity: 2,
          price: 29.99,
          status: "pending",
        },
      ],
    },
    {
      id: "ORD-002",
      customerName: "Jane Smith",
      customerEmail: "jane@smith.com",
      orderDate: new Date(2024, 2, 18),
      status: "Completed",
      paymentMethod: "PayPal",
      shippingAddress: "456 Oak Ave, Los Angeles, CA 90001",
      courierService: "UPS Ground",
      trackingNumber: "UPS-1Z999AA1",
      totalAmount: 349.5,
      items: [
        {
          id: "i3",
          productName: "Mechanical Keyboard",
          quantity: 1,
          price: 129.99,
          status: "pending",
        },
        {
          id: "i4",
          productName: "Gaming Mouse",
          quantity: 1,
          price: 59.99,
          status: "pending",
        },
      ],
    },
    {
      id: "ORD-003",
      customerName: "Bob Johnson",
      customerEmail: "bob@company.com",
      orderDate: new Date(2024, 2, 20),
      status: "Cancelled",
      paymentMethod: "Debit Card",
      shippingAddress: "789 Pine Ln, Chicago, IL 60607",
      courierService: "DHL Express",
      totalAmount: 45.99,
      items: [
        {
          id: "i5",
          productName: "Screen Protector",
          quantity: 3,
          price: 12.99,
          status: "pending",
        },
      ],
    },
  ];

  const fetchData = (orderID: string) => {
    const data = initialOrders.find((item) => item.id === orderID);
    if (data) {
      setSelectedOrder(data);
      // Initialize bags state for this order's pending items
      const initialBags: Record<string, number> = {};
      data.items.forEach((item) => {
        if (item.status === "pending") {
          initialBags[item.id] = item.bags || 0;
        }
      });
      setBags(initialBags);
    }
  };

  const orderStatusChange = (
    itemId: string,
    newStatus: "approved" | "rejected",
  ) => {
    if (!selectedOrder) return;

    const updatedItems = selectedOrder.items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          status: newStatus,
          bags: newStatus === "approved" ? bags[itemId] || item.quantity : 0,
        };
      }
      return item;
    });

    setSelectedOrder({
      ...selectedOrder,
      items: updatedItems,
    });
  };

  const statusStyle = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  // Filter orders based on date and status
  const filteredOrders = initialOrders.filter((order) => {
    if (DateFrom) {
      const fromDate = new Date(DateFrom);
      if (order.orderDate < fromDate) return false;
    }
    if (DateTo) {
      const toDate = new Date(DateTo);
      toDate.setHours(23, 59, 59);
      if (order.orderDate > toDate) return false;
    }
    if (statusValue && statusValue !== "all" && order.status !== statusValue)
      return false;
    return true;
  });

  return (
    <>
      <div className="flex gap-2">
        <div className="w-full">
          <InputFieldGeneric
            label="Date From"
            type="date"
            required={false}
            placeholder="Enter Date From"
            SateChange={DateFrom}
            setSateChange={setDateFrom}
            disabled={false}
          />
        </div>
        <div className="w-full">
          <InputFieldGeneric
            label="Date To"
            type="date"
            required={false}
            placeholder="Enter Date To"
            SateChange={DateTo}
            setSateChange={setDateTo}
            disabled={false}
          />
        </div>
        {/* <div className="w-full mt-2">
          <DropDownList
            label="Status"
            placeholder="Enter Status"
            required={true}
            value={statusValue}
            onChange={setStatusValue}
            options={status.map((item) => ({
              label: item,
              value: item,
            }))}
          />
        </div> */}
      </div>
      <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all mt-5">
        <div className="space-y-4">
          {filteredOrders.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition relative"
            >
              {/* Left: Customer Info */}
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-800">
                  {item.customerName}
                </span>
                <span className="text-md text-gray-800">
                  {item.customerEmail}
                </span>
              </div>
              <div className="flex gap-2 items-end">
                <span className="text-lg font-semibold text-gray-800">
                  {new Date(item.orderDate).toISOString().split("T")[0]}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : item.status === "Completed"
                        ? "bg-blue-100 text-blue-800"
                        : item.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <button
                    onClick={() => fetchData(item.id)}
                    className="px-2 py-2 rounded-md text-white bg-black hover:bg-gray-900"
                    title="View Detail"
                  >
                    <Eye />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                setSelectedOrder(null);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Order Details
              </h2>
              <p className="text-sm text-gray-500">
                Order ID: {selectedOrder.id}
              </p>
            </div>

            {/* Customer Info */}
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-gray-700" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {selectedOrder.customerName}
                </h4>
                <p className="text-sm text-gray-500">
                  {selectedOrder.customerEmail}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Ordered Items
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr className="text-left text-sm font-semibold text-gray-700">
                      <th className="p-3">Product</th>
                      <th className="p-3 text-center">Quantity</th>
                      <th className="p-3 text-right">Item Price</th>
                      <th className="p-3 text-right">Total</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Bags</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {selectedOrder.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        {/* Product */}
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                              <Image
                                src="/collection3.jpg"
                                alt={item.productName}
                                width={56}
                                height={56}
                                className="object-cover"
                              />
                            </div>
                            <p className="font-medium text-gray-900 text-sm">
                              {item.productName}
                            </p>
                          </div>
                        </td>

                        {/* Quantity */}
                        <td className="p-3 text-center text-gray-600 font-medium">
                          Qty: {item.quantity}
                        </td>

                        {/* Item Price */}
                        <td className="p-3 text-right font-medium text-gray-900">
                          ${item.price.toFixed(2)}
                        </td>

                        {/* Total */}
                        <td className="p-3 text-right font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>

                        {/* Status */}
                        <td className="p-3 text-center">
                          <span
                            className={`px-3 py-1 text-sm font-medium rounded-full border inline-block ${statusStyle(
                              item.status,
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* Bags */}
                        <td className="p-3 text-center">
                          {item.status === "pending" ? (
                            <input
                              type="number"
                              value={bags[item.id] || ""}
                              onChange={(e) =>
                                setBags((prev) => ({
                                  ...prev,
                                  [item.id]: Number(e.target.value),
                                }))
                              }
                              className="w-20 p-2 border rounded-md text-center"
                              min="0"
                              max={item.quantity}
                            />
                          ) : (
                            <span className="font-medium">
                              {item.bags || item.quantity}
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-3 text-center">
                          {item.status === "pending" ? (
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() =>
                                  orderStatusChange(item.id, "approved")
                                }
                                className="bg-green-600 hover:bg-green-700 rounded-md text-white px-2 py-1"
                              >
                                <CheckCheck />
                              </button>
                              <button
                                onClick={() =>
                                  orderStatusChange(item.id, "rejected")
                                }
                                className="bg-red-600 hover:bg-red-700 rounded-md text-white px-2 py-1"
                              >
                                <X />
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-500">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Delivery + Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-700 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Shipping Address
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {selectedOrder.shippingAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-gray-700 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Courier Service
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {selectedOrder.courierService}
                  </p>
                  {selectedOrder.trackingNumber && (
                    <p className="text-gray-500 text-xs mt-1">
                      Tracking: {selectedOrder.trackingNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-gray-700 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Payment Method
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {selectedOrder.paymentMethod}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-700 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Order Date</h4>
                  <p className="text-gray-600 text-sm">
                    {new Date(selectedOrder.orderDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="border-t pt-4">
              <div className="flex font-semibold justify-between mb-2">
                <span className="text-sm">Sub-Total</span>
                <span className="text-gray-900 text-sm">
                  {(selectedOrder.totalAmount - 0).toFixed(2)}
                </span>
              </div>
              <div className="flex font-semibold justify-between mb-2">
                <span className="text-sm">Total Amount:</span>
                <span className="text-gray-900 text-sm font-bold">
                  {selectedOrder.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
