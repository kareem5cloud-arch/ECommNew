"use client";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import {
  Box,
  CheckCheck,
  Clock,
  CreditCard,
  Divide,
  Eye,
  MapPin,
  Plus,
  Split,
  Trash,
  Truck,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import OnlineSellerGetOrder from "@/app/api/Controller/OnlineManager/OrderConfirmation/GetOrderDetail";
import StoreSellerGetApi from "@/app/api/Controller/AdminController/Store/GetStoreSeller";
import {
  ResponseGetStore,
  storeList,
} from "@/app/api/Types/AdminSetting/Store/Store";
import {
  orderDetailOnlineSeller,
  orderOnlineSeller,
  ResponseOrderConfiramtion,
} from "@/app/api/Types/OnlineSeller/OrderConfiramtion";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import OnlineSellerRejectOrder from "@/app/api/Controller/OnlineManager/OrderConfirmation/OrderRejectStatus";
import OnlineSellerApproveOrder from "@/app/api/Controller/OnlineManager/OrderConfirmation/OrderApproveApi";

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
interface OrderBags {
  bagNo: number;
}
interface AssigningBags {
  detailID: string;
  productName: string;
  qty?: number;
  bagNo?: string;
  division: AllowSubDivision[];
}
interface AllowSubDivision {
  qty: number;
  bagNo: string;
}
interface SubDivsionDetail {
  index: number;
  qty: number;
  bagNo: string;
}
interface bagNoSelection {
  detailID: string;
  description: string;
}
export default function OrderConfirmation() {
  const [DateFrom, setDateFrom] = useState("");
  const [DateTo, setDateTo] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<orderOnlineSeller>();

  const [storeID, setStoreID] = useState("");
  const [loading, setLoading] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [StoreList, setStoreList] = useState<storeList[]>([]);
  const [orderList, setorderList] = useState<orderOnlineSeller[]>([]);
  const [orderBags, setOrderBags] = useState(1);
  const [listofOrderBags, setListofOrderBags] = useState<OrderBags[]>([]);
  const [storeItemBags, setStoreItemBags] = useState<AssigningBags[]>([]);
  const [showDivision, setShowDivision] = useState(false);
  const [bagsAsssign, setBagsAssign] = useState<orderDetailOnlineSeller>();
  const [bagNoSelection, setBagNoSelection] = useState<bagNoSelection[]>([]);
  const [subDivisionDetail, setSubDivisionDetail] = useState<
    SubDivsionDetail[]
  >([]);
  const fetchData = (orderID: string) => {
    const data = orderList.find((item) => item.ledgerID === orderID);
    if (data) {
      setSelectedOrder(data);
      setStoreItemBags(
        data.orderDetail.map((item) => ({
          detailID: item.detailID,
          productName:
            item.productName +
            "-" +
            item.varintValue.map((item) => item.value).join(" - "),
          qty: item.qty,
          bagNo: "0",
          division: [
            {
              qty: 0,
              bagNo: "",
            },
          ],
        })),
      );
    }
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

  const getOrderDetail = async (ID: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("OnlineSellerToken");
      const response = await OnlineSellerGetOrder(ID, String(token));
      if (response.status === 200) {
        const data = response.data as ResponseOrderConfiramtion;
        setorderList(data.order);
      } else {
        setorderList([]);
      }
    } finally {
      setLoading(false);
    }
  };
  const getStores = async () => {
    const token = localStorage.getItem("OnlineSellerToken");
    const response = await StoreSellerGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as ResponseGetStore;
      setStoreList(data.storeList);
      setStoreID(data.storeList[0].storeID);
      setStoreName(data.storeList[0].storeName);
    } else {
      setStoreList([]);
    }
  };
  const orderRejectFuntion = async (ID: string) => {
    try {
      const token = localStorage.getItem("OnlineSellerToken");
      const response = await OnlineSellerRejectOrder(ID, String(token));
      if (response.status === 200) {
        getOrderDetail(storeID);
        setSelectedOrder(undefined);
      }
    } finally {
    }
  };
  const filteredOrders = orderList.filter((order) => {
    if (DateFrom) {
      const fromDate = new Date(DateFrom);
      if (new Date(order.postingDate) < fromDate) return false;
    }
    if (DateTo) {
      const toDate = new Date(DateTo);
      toDate.setHours(23, 59, 59);
      if (new Date(order.postingDate) > toDate) return false;
    }
    if (
      statusValue &&
      statusValue !== "all" &&
      order.orderStatus !== statusValue
    )
      return false;
    return true;
  });
  useEffect(() => {
    getStores();
  }, []);
  useEffect(() => {
    if (storeID) {
      getOrderDetail(storeID);
    }
  }, [storeID]);

  const totalBill = selectedOrder?.orderDetail
    .filter((item) => item.status === "approved")
    .reduce((sum, value) => {
      return sum + value.qty * value.rate;
    }, 0);

  useEffect(() => {
    var array: any = [];
    for (let i = 1; i <= orderBags; i++) {
      array.push(i);
    }
    setListofOrderBags(
      array.map((item: any) => ({
        bagNo: item,
      })),
    );
  }, [orderBags]);

  const functionFetchData = (ID: string) => {
    const data = selectedOrder?.orderDetail.find(
      (item) => item.detailID === ID,
    );
    if (data) {
      setBagsAssign(data);
      const existingItem = storeItemBags.find((item) => item.detailID === ID);

      const newValue =
        existingItem?.division.map((item3, index) => ({
          index: index + 1,
          qty: Number(item3.qty),
          bagNo: String(item3.bagNo),
        })) ?? [];

      setSubDivisionDetail(newValue);
    }
  };
  const ApproveClick = async () => {
    try {
      setLoading(true);
      const formData = {
        ledgerID: selectedOrder?.ledgerID || "",
        orderNo: selectedOrder?.orderNo || "",
        status: "approved",
        shippingCharges: selectedOrder?.shippingCharges || 0,
        bags: orderBags,
        assignBags: storeItemBags.map((item) => ({
          detailID: item.detailID,

          getQtyBag:
            item.bagNo === "0"
              ? item.division.map((item2) => ({
                  qty: item2.qty || 0,
                  bagNo: item2.bagNo || "",
                }))
              : [
                  {
                    qty: item.qty || 0,
                    bagNo: item.bagNo || "",
                  },
                ],
        })),
      };
      console.log(formData);
      const token = localStorage.getItem("OnlineSellerToken");
      const response = await OnlineSellerApproveOrder(formData, String(token));
      if (response.status === 200) {
        getOrderDetail(storeID);
        setSelectedOrder(undefined);
        setSubDivisionDetail([]);
        setOrderBags(1);
        setBagsAssign(undefined);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <DropDownList
          label="Store"
          placeholder="Select Store"
          required={true}
          value={storeName}
          onChange={setStoreName}
          filedID={setStoreID}
          options={StoreList.map((item) => ({
            label: item.storeName,
            value: item.storeName,
            id: item.storeID,
          }))}
        />
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
        {loading ? (
          <Spinner />
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((item) => (
              <div
                key={item.ledgerID}
                className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition relative"
              >
                {/* Left: Customer Info */}
                <div className="flex gap-2">
                  <div className="bg-gray-50 shadow-md px-3 py-3 rounded-md ">
                    <Box size={30} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </span>
                    <span className="text-md text-gray-800">{item.email}</span>
                  </div>
                </div>
                <div className="flex gap-2 items-end">
                  <span className="text-lg font-semibold text-gray-800">
                    {new Date(item.postingDate).toISOString().split("T")[0]}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.orderStatus === "delivered"
                        ? "bg-green-100 text-green-800"
                        : item.orderStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.orderStatus === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.orderStatus}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <button
                      onClick={() => fetchData(item.ledgerID)}
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
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                setSelectedOrder(undefined);
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
                Order ID: {selectedOrder.orderNo}
              </p>
            </div>

            {/* Customer Info */}
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-gray-700" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {selectedOrder.name}
                </h4>
                <p className="text-sm text-gray-500">{selectedOrder.email}</p>
              </div>
            </div>
            <div className="flex flex-col  p-2">
              <label className="text-gray-900">Number Bags</label>
              <input
                type="number"
                value={orderBags || "1"}
                onChange={(e) => setOrderBags(Number(e.target.value))}
                className="w-50 p-2 border border-gray-500 rounded-md "
                min="1"
              />
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
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Bag No</th>
                      <th className="p-3 text-center">Sub-Division</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {selectedOrder.orderDetail.map((item) => (
                      <tr key={item.detailID} className="hover:bg-gray-50">
                        {/* Product */}
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={item.url}
                                alt={item.url}
                                width={56}
                                height={56}
                                className="object-cover"
                              />
                            </div>
                            <p className="font-medium text-gray-900 w-60 text-sm uppercase">
                              {item.productName} -
                              {item.varintValue
                                .map((item2) => item2.value)
                                .join(" - ")}
                            </p>
                          </div>
                          <p className="text-gray-700 ml-10">
                            {bagNoSelection
                              .filter(
                                (item2) => item2.detailID === item.detailID,
                              )
                              .map((item3) => item3.description)}
                          </p>
                        </td>

                        {/* Quantity */}
                        <td className="p-3 text-center text-gray-600 font-medium">
                          Qty: {item.qty}
                        </td>

                        {/* Item Price */}
                        <td className="p-3 text-right font-medium text-gray-900">
                          {item.rate.toLocaleString()}
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
                        {item.status === "pending" ? (
                          <td className="p-3 text-center">
                            {bagNoSelection.some(
                              (item2) =>
                                item2.detailID === item.detailID &&
                                item2.description !== "",
                            ) ? (
                              <span className="font-semibold text-gray-500">
                                -
                              </span>
                            ) : (
                              <select
                                className="p-2 w-35 border rounded-md"
                                value={item.bags || ""}
                                onChange={(e) => {
                                  setSelectedOrder((prev) => {
                                    if (!prev) return prev;

                                    return {
                                      ...prev,
                                      orderDetail: prev.orderDetail.map(
                                        (detail) =>
                                          detail.detailID === item.detailID
                                            ? {
                                                ...detail,
                                                bags: Number(e.target.value),
                                              }
                                            : detail,
                                      ),
                                    };
                                  });

                                  setStoreItemBags((prev) =>
                                    prev.map((item2) =>
                                      item2.detailID === item.detailID
                                        ? {
                                            ...item2,
                                            detailID: item.detailID,
                                            productName:
                                              item.productName +
                                              "-" +
                                              item.varintValue
                                                .map((val) => val.value)
                                                .join(" - "),
                                            qty: item.qty,
                                            bagNo: e.target.value,
                                            division: [],
                                          }
                                        : item2,
                                    ),
                                  );
                                }}
                              >
                                <option value="">Select Bag No</option>

                                {listofOrderBags.map((bag, index) => (
                                  <option key={index} value={bag.bagNo}>
                                    {bag.bagNo}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>
                        ) : (
                          <td className="p-3 text-center">-</td>
                        )}
                        <td className="p-3 text-center">
                          {item.status !== "pending" ? (
                            "-"
                          ) : (
                            <button
                              onClick={() => {
                                functionFetchData(item.detailID);
                                setShowDivision(true);
                              }}
                              title="Divide"
                              className="bg-blue-600 hover:bg-blue-700 rounded-md text-white px-2 py-1"
                            >
                              <Split />
                            </button>
                          )}
                        </td>
                        {/* Actions */}
                        <td className="p-3 text-center">
                          {item.status === "pending" ? (
                            <div className="flex justify-center gap-2">
                              {/* <button
                                onClick={() =>
                                  orderStatusModify(
                                    selectedOrder.orderNo,
                                    item.detailID,
                                    "approved",
                                    selectedOrder.shippingCharges,
                                    item.bags,
                                  )
                                }
                                title="Confirm"
                                className="bg-green-600 hover:bg-green-700 rounded-md text-white px-2 py-1"
                              >
                                <CheckCheck />
                              </button> */}
                              <button
                                onClick={() =>
                                  orderRejectFuntion(item.detailID)
                                }
                                title="Reject"
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
                    {selectedOrder.address.split("/n")[0] +
                      " , " +
                      selectedOrder.address.split("/n")[1] +
                      " , " +
                      selectedOrder.address.split("/n")[2] +
                      " , " +
                      selectedOrder.address.split("/n")[3]}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-gray-700 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Courier Service
                  </h4>
                  <p className="text-gray-600 text-sm">{"N/A"}</p>
                  {/* {selectedOrder.trackingNumber && (
                    <p className="text-gray-500 text-xs mt-1">
                      Tracking: {selectedOrder.trackingNumber}
                    </p>
                  )} */}
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
                    {new Date(selectedOrder.postingDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="border-t pt-4 border-gray-300">
              <div className="flex font-semibold justify-between mb-2">
                <span className="text-sm">Shipping Charges:</span>
                <span className="text-gray-900 text-sm">
                  {selectedOrder.shippingCharges.toFixed(2)}
                </span>
              </div>
              <div className="flex font-semibold justify-between mb-2">
                <span className="text-sm">Total Amount:</span>
                <span className="text-gray-900 text-sm font-bold">
                  {totalBill?.toFixed(2)}
                </span>
              </div>
            </div>
            {selectedOrder.orderDetail[0].status === "pending" && (
              <div className="flex justify-end border-t pt-4 border-gray-300">
                <button
                  onClick={() => ApproveClick()}
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md "
                >
                  {loading ? "Approving..." : "Approve"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {showDivision && (
        <>
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-80 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => {
                  setShowDivision(false);
                }}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 mb-1 w-[50%] uppercase">
                {bagsAsssign?.productName +
                  "- " +
                  bagsAsssign?.varintValue.map((item) => item.value).join("-")}
              </h1>
              <div className="overflow-x-auto">
                <div className="w-full flex justify-end p-1">
                  <button
                    onClick={() => {
                      const data = {
                        index: subDivisionDetail.length + 1,
                        qty: 0,
                        bagNo: String(listofOrderBags[0].bagNo),
                      };
                      setSubDivisionDetail([...subDivisionDetail, data]);
                    }}
                    title="Add Row"
                    className=" text-sm px-2 py-2 border border-gray-500 hover:border-gray-600  hover:bg-gray-50 shadow-md rounded-md cursor-pointer"
                  >
                    + Add Row
                  </button>
                </div>
                <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr className="text-sm font-semibold text-gray-700">
                      <th className="px-3 py-3 text-center w-16">#</th>

                      <th className="px-3 py-3 text-center">
                        Quantity{" "}
                        <span className="text-xs font-normal">
                          ({bagsAsssign?.qty})
                        </span>
                      </th>

                      <th className="px-3 py-3 text-center">Bag No</th>

                      <th className="px-3 py-3 text-center w-24">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {subDivisionDetail.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-3 text-center">{index + 1}</td>

                        <td className="p-3">
                          <input
                            value={item.qty}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              if (value > (bagsAsssign?.qty || 0))
                                return alert(`You Have Reached Max Qty Limit`);
                              setSubDivisionDetail((prev) =>
                                prev.map((row, i) =>
                                  i === index ? { ...row, qty: value } : row,
                                ),
                              );
                            }}
                            min={1}
                            type="number"
                            className="w-full px-2 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
                            placeholder="Qty"
                          />
                        </td>

                        <td className="p-3">
                          <select
                            value={item.bagNo}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSubDivisionDetail((prev) =>
                                prev.map((row, i) =>
                                  i === index ? { ...row, bagNo: value } : row,
                                ),
                              );
                            }}
                            className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
                          >
                            {listofOrderBags.map((item, index) => (
                              <option key={index} value={item.bagNo}>
                                {item.bagNo}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              setSubDivisionDetail((prev) =>
                                prev.filter((_, i) => i !== index),
                              );
                            }}
                            className="inline-flex items-center justify-center p-2 bg-red-500 hover:bg-red-600 shadow-md rounded-md text-white"
                          >
                            <Trash size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end border-t pt-4 border-gray-300">
                  <button
                    onClick={() => {
                      if (!bagsAsssign?.detailID) return;

                      setStoreItemBags((prev) =>
                        prev.map((item) =>
                          item.detailID === bagsAsssign.detailID
                            ? {
                                ...item,
                                division: subDivisionDetail.map((subItem) => ({
                                  qty: Number(subItem.qty),
                                  bagNo: String(subItem.bagNo),
                                })),
                              }
                            : item,
                        ),
                      );
                      const data = [
                        {
                          detailID: bagsAsssign.detailID,
                          description: subDivisionDetail
                            .map(
                              (division) =>
                                `Qty: ${division.qty} Bag: ${division.bagNo}`,
                            )
                            .join(", "),
                        },
                      ];
                      setBagNoSelection(data);
                      setShowDivision(false);
                    }}
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md "
                  >
                    Confirm Division
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
