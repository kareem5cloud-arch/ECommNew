"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Eye,
  X,
  Truck,
  MapPin,
  CreditCard,
  Package,
  Mail,
  User,
  Calendar,
  CheckCircle,
  Clock,
  ShoppingCart,
  CheckCheck,
  ShoppingBag,
} from "lucide-react";
import SellerOrderGet from "@/api/lib/Order/SellerOrdersGet";
import {
  SellerStoreListResponse,
  storesListSeller,
  storesSubList,
} from "@/api/types/order/GetStore";
import Spinner from "@/component/spinner/page";
import SellerOrderConfirmation from "@/api/lib/Order/SellerOrderConfirmation";

export default function SellerOrders({ storeID }: { storeID: string }) {
  const [isLoading, setisLoading] = useState(false);
  const [productList, setProuctList] = useState<storesListSeller[]>([]);
  const [subProductList, setsubProductList] = useState<storesSubList[]>([]);
  const [bags, setBags] = useState<Record<string, number>>({});
  const [qty, setQty] = useState(0);
  const [ResponseBack, setResponseBack] = useState("");
  const [isTrue, setIsTrue] = useState(false);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [selectedOrder, setSelectedOrder] = useState<storesListSeller | null>(
    null
  );

  const statusStyle = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "Shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  };

  const getOrders = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("token");
      const response = await SellerOrderGet(String(token), storeID);
      if (response.status === 200 || response.status === 201) {
        console.log(response.data);
        const data = response.data as SellerStoreListResponse;
        setProuctList(data.storesMainList);
      } else {
        console.log(response.data);
      }
    } catch {
    } finally {
      setisLoading(false);
    }
  };

  const fetchData = (orderID: string) => {
    const data = productList.find((item) => item.orderID === orderID);
    if (data) {
      setSelectedOrder(data);
      setsubProductList(data.storesSubList);
    }
  };

  const orderStatusChange = async (orderDetailID: string, status: string) => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("token");
      const formData = {
        bags: Number(bags[orderDetailID] ?? 0),
        status: status,
      };
      const response = await SellerOrderConfirmation(
        String(token),
        orderDetailID,
        formData
      );
      if (response.status === 200 || response.status === 201) {
        getOrders();
        setResponseBack(response.data.message);
        setIsTrue(true);
        setSelectedOrder(null);
      } else {
        setResponseBack(response.data.message);
        setIsTrue(true);
      }
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
    const data = new Date().toISOString().split("T")[0];
    setDateFrom(data);
    setDateTo(data);
  }, []);
  const filteredProductList = productList.filter((order) => {
    const orderDate = order.orderDate.split("T")[0];

    const isAfterFrom = dateFrom ? orderDate >= dateFrom : true;
    const isBeforeTo = dateTo ? orderDate <= dateTo : true;
    const matchesStatus = statusFilter ? order.status === statusFilter : true;

    return isAfterFrom && isBeforeTo && matchesStatus;
  });
  return (
    <div className="w-full relative">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Seller Order Management
      </h1>
      <div className="w-full flex flex-col md:flex-row justify-around gap-2 mt-2 mb-2">
        <div className="w-full">
          <label className="block text-gray-700 font-medium mb-2">
            Date From
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
            <Calendar className="text-gray-400 mr-2" size={18} />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-900"
            />
          </div>
        </div>
        <div className="w-full">
          <label className="block text-gray-700 font-medium mb-2">
            Date To
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
            <Calendar className="text-gray-400 mr-2" size={18} />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-900"
            />
          </div>
        </div>
        <div className="w-full">
          <label className="block text-gray-700 font-medium mb-2">Status</label>
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
            <ShoppingBag className="text-gray-400 mr-2" size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-1 bg-transparent outline-none text-gray-900"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="Delivered">Delivered</option>
              <option value="Canceled">Canceled</option>
              <option value="Shipped">Shipped</option>
            </select>
          </div>
        </div>
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="space-y-5">
          {filteredProductList.length !== 0 ? (
            <>
              {filteredProductList.map((order) => (
                <div
                  key={order.orderID}
                  className="flex flex-col md:flex-row items-center justify-between bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all p-5"
                >
                  {/* === LEFT: Customer Info === */}
                  <div className="flex flex-col w-full md:w-1/3">
                    <h3 className="font-semibold text-gray-900">
                      {order.productName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-gray-400">{order.email}</p>
                  </div>

                  {/* === CENTER: Status + Date === */}
                  <div className="flex items-center gap-4 mt-3 md:mt-0 w-full md:w-1/3 justify-center">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full border ${statusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <p className="text-sm text-gray-500">
                      {order.orderDate.split("T")[0]}
                    </p>
                  </div>

                  {/* === RIGHT: Controls === */}
                  <div className="flex items-center gap-3 mt-3 md:mt-0 w-full md:w-1/3 justify-end">
                    <p className="text-lg font-semibold text-gray-900">
                      Rs. {order.totalAmount.toLocaleString()}
                    </p>
                    <button
                      onClick={() => fetchData(order.orderID)}
                      className="flex items-center gap-2 text-sm text-white bg-black hover:bg-gray-900 rounded-lg px-4 py-2 transition"
                    >
                      <Eye size={16} /> View
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
        </div>
      )}

      {/* === Order Detail Modal === */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                setSelectedOrder(null);
                setQty(0);
                setBags({});
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* === Header === */}
            <>
              <div key={selectedOrder.orderID} className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Order Details
                </h2>
                <p className="text-sm text-gray-500">
                  Order ID: {selectedOrder.orderID}
                </p>
              </div>

              {/* === Customer Info === */}
              <div className="flex items-center gap-3 mb-6">
                <User className="w-5 h-5 text-gray-700" />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {selectedOrder.customerName}
                  </h4>
                  <p className="text-sm text-gray-500">{selectedOrder.email}</p>
                </div>
              </div>

              {/* === Items === */}
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
                        <th className="p-3 text-right">Shipping</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Bags</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {subProductList.map((item) => (
                        <tr
                          key={item.orderDetailID}
                          className="hover:bg-gray-50"
                        >
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
                            Qty: {item.qty}
                          </td>

                          {/* Item Price */}
                          <td className="p-3 text-right font-medium text-gray-900">
                            {(
                              item.salePrice -
                              (item.salePrice * item.discount) / 100
                            ).toLocaleString()}{" "}
                          </td>

                          {/* Shipping */}
                          <td className="p-3 text-right text-gray-700 font-medium">
                            {item.shippingCharges.toLocaleString()}
                          </td>

                          {/* Status */}
                          <td className="p-3 text-center">
                            <span
                              className={`px-3 py-1 text-sm font-medium rounded-full border inline-block ${statusStyle(
                                item.status
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
                                value={bags[item.orderDetailID] || ""}
                                onChange={(e) =>
                                  setBags((prev) => ({
                                    ...prev,
                                    [item.orderDetailID]: Number(
                                      e.target.value
                                    ),
                                  }))
                                }
                                className="w-20 p-2 border rounded-md text-center"
                              />
                            ) : (
                              <span className="font-medium">{item.bags}</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-3 text-center">
                            {item.status === "pending" ? (
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() =>
                                    orderStatusChange(
                                      item.orderDetailID,
                                      "Approved"
                                    )
                                  }
                                  className="bg-green-600 hover:bg-green-700 rounded-md text-white px-2 py-1"
                                >
                                  <CheckCheck />
                                </button>
                                <button
                                  onClick={() =>
                                    orderStatusChange(
                                      item.orderDetailID,
                                      "Cancelled"
                                    )
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

              {/* === Delivery + Payment Info === */}
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
                      Delivery Method
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Currenlty UnAvalibale
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-gray-700 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Payment Method
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {selectedOrder.bankName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-700 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Estimated Delivery
                    </h4>
                    <p className="text-gray-600 text-sm">4-5 Days</p>
                  </div>
                </div>
              </div>

              {/* === Summary === */}

              <div className="flex font-semibold justify-between">
                <span className="text-sm">Sub-Total</span>
                <span className=" text-gray-900 text-sm">
                  Rs:{" "}
                  {(
                    selectedOrder.totalAmount - selectedOrder.delievryCharges
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex font-semibold justify-between">
                <span className="text-sm">Shipment Charges:</span>
                <span className=" text-gray-900 text-sm">
                  Rs: {selectedOrder.delievryCharges.toLocaleString()}
                </span>
              </div>
              <div className="border-t mt-2 text-sm text-gray-700">
                <div className="flex  p-1 font-semibold justify-between">
                  <span className="">Grand Total:</span>
                  <span className=" text-gray-900 text-sm">
                    Rs: {selectedOrder.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
              <hr className="mt-2" />
              {selectedOrder.status === "pending" && (
                <div className="flex justify-between items-center">
                  <button
                    // onClick={() => {
                    //   orderStatusChange(item.orderDetailID, "Cancelled");
                    // }}
                    className="px-4 py-2 mt-2 mb-2 bg-red-500 hover:bg-red-600 rounded-md text-white"
                  >
                    Reject
                  </button>
                </div>
              )}
            </>
          </div>
        </div>
      )}
    </div>
  );
}
