"use client";
import { addToServerCart } from "@/app/api/Controller/Customer/CookiesController/Cart/AddCart";
import CustomerGetOrder from "@/app/api/Controller/Customer/Order/GetOrder";
import CustomerGetReason from "@/app/api/Controller/Customer/Order/GetReason";
import CustomerRejectBag from "@/app/api/Controller/Customer/Order/RejectOrder";
import CustomerReturnOrder from "@/app/api/Controller/Customer/Order/ReturnOrder";
import { SendDataToApiVideo } from "@/app/api/Controller/MiddleWare/VideoUplaodCloudinary";
import { CartData } from "@/app/api/Types/Customer/Cookies/Cart";
import {
  CustomerOrderList,
  productCustomer,
  ResponseCustomerOrder,
} from "@/app/api/Types/Customer/CustomerOrder";
import {
  responseGetSticker,
  stickerData,
} from "@/app/api/Types/WareHouse/OrderConfimration";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import {
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Ellipsis,
  Minus,
  Plus,
  Trash,
  X,
  Package,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  Calendar,
  ShoppingBag,
  ShoppingCart,
  Pencil,
  Repeat,
  Download,
} from "lucide-react";
import { useEffect, useState } from "react";
import ReceiptPrintModal from "./GetSickerData/ReciptPrintPreviewModel";
import WareHouseStickerGet from "@/app/api/Controller/WareHouseSeller/GetStickerData";

interface reasonList {
  message: string;
  error: string;
  reason: data[];
}
interface data {
  reasonID: string;
  reason: string;
}
// Status configuration for better visual representation

export default function OrderManagement() {
  const [orderList, setOrderList] = useState<CustomerOrderList[]>([]);
  const [ReasonList, setReasonList] = useState<data[]>([]);
  const [open, setOpen] = useState("");
  const [subOpen, setSubOpen] = useState("");
  const [Description, setDescription] = useState("");
  const [Qty, setQty] = useState("");
  const [OriginalQty, setOriginalQty] = useState("");
  const [OrderID, setOrderID] = useState("");
  const [BagNo, setBagNo] = useState("");
  const [Reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [ShowDescription, setShowDescription] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [delievryID, setDelievryID] = useState("");
  const [productData, setProductData] = useState<productCustomer>();
  const [StickerData, setStickerData] = useState<stickerData>();
  const [activeTab, setActiveTab] = useState("Sale");
  const [orderNo, setOrderNo] = useState("");

  const [forVideo, setForVideo] = useState<{
    file: File | null;
  } | null>(null);

  const getStatusStyles = (status: string) => {
    const styles = {
      pending:
        "rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium capitalize text-yellow-700",
      approved:
        "rounded-full bg-green-100 px-3 py-1 text-xs font-medium capitalize text-green-700",
      rejected:
        "rounded-full bg-red-100 px-3 py-1 text-xs font-medium capitalize text-red-700",
      shipped:
        "rounded-full bg-blue-100 px-3 py-1 text-xs font-medium capitalize text-blue-700",
      delieverd:
        "rounded-full bg-purple-100 px-3 py-1 text-xs font-medium capitalize text-purple-700",
      packed:
        "rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium capitalize text-indigo-700",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };
  // Calculate order stats
  const getOrderStats = (order: CustomerOrderList) => {
    const total = order.orderDetail.length;
    const delivered = order.orderDetail.filter(
      (b) => b.status === "delieverd",
    ).length;
    const shipped = order.orderDetail.filter(
      (b) => b.status === "shipped",
    ).length;
    const approved = order.orderDetail.filter(
      (b) => b.status === "approved",
    ).length;
    const processing = order.orderDetail.filter(
      (b) => b.status === "processing",
    ).length;
    const packed = order.orderDetail.filter(
      (b) => b.status === "packed",
    ).length;

    const pending = order.orderDetail.filter(
      (b) => b.status === "pending",
    ).length;
    const rejected = order.orderDetail.filter(
      (b) => b.status === "rejected",
    ).length;

    return {
      total,
      delivered,
      shipped,
      processing,
      pending,
      rejected,
      packed,
      approved,
    };
  };

  const GetOrder = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("customerToken");
      const response = await CustomerGetOrder(String(token));
      const data = response.data as ResponseCustomerOrder;
      if (response.status === 200) {
        setOrderList(data.orderList);
      } else {
        setOrderList([]);
      }
    } finally {
      setisLoading(false);
    }
  };

  const RejectBags = async () => {
    try {
      setisLoading(true);
      if (!Description)
        return alert("Please give a reason for your order cancellation.");
      const token = localStorage.getItem("customerToken");
      const formData = {
        bagNo: BagNo,
        orderID: OrderID,
        description: Description || "Customer Reject",
      };

      const response = await CustomerRejectBag(formData, String(token));

      if (response.status === 200) {
        setOrderID("");
        setBagNo("");
        setDescription("");
        setShowDescription(false);
        await GetOrder();
      } else {
        alert(response.data?.message || "Failed to reject order");
      }
    } finally {
      setisLoading(false);
    }
  };

  const GetReason = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("customerToken");
      const response = await CustomerGetReason(String(token));
      const data = response.data as reasonList;
      if (response.status === 200) {
        setReasonList(data.reason);
      } else {
        setReasonList([]);
      }
    } finally {
      setisLoading(false);
    }
  };

  const AddOrder = async () => {
    try {
      setLoading(true);
      if (!Description || !Qty || !forVideo)
        return alert("Please Fill in all required fields");
      else {
        const token = localStorage.getItem("customerToken");
        let videoUrl = "";

        // Upload the single video
        if (forVideo?.file) {
          const response2 = await SendDataToApiVideo(forVideo.file);
          videoUrl = String(response2.data);
        }
        const formData = {
          shippingDetailID: selectedAddressId,
          deliveryTypeID: delievryID,
          paymentStatus: "unPaid",
          paymentMethod: OrderID,
          additionalCharges: 0,
          promoID: orderNo,
          shippingCharges: 0,
          orderDate: new Date().toISOString().split("T")[0],
          totalBill: 0,
          amountPaid: 0,
          description: Description,
          orderDetail: [
            {
              varientID: productData?.varientID || "",
              qty: Number(Qty) || 0,
              rate: productData?.rate || 0,
              videoUrl: videoUrl,
            },
          ],
        };
        const response = await CustomerReturnOrder(formData, String(token));
        if (response.status === 200) {
          setDelievryID("");
          setSelectedAddressId("");
          setQty("");
          setOrderNo("");
          setOrderID("");
          setForVideo(null);
          setDescription("");
          setProductData(undefined);
          alert("Item Added to Return Successfully.");
        } else {
          alert(response.data.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    GetOrder();
  }, []);

  useEffect(() => {
    if (ShowDescription && Reason.toLowerCase() === "return") {
      GetReason();
    }
  }, [ShowDescription, Reason]);

  const AddCartFunction = async (data: productCustomer[]) => {
    const newData = data.map((item) => {
      const formData: CartData[] = [
        {
          attributeID: item.varientID,
          qty: item.qty,
          aQty: item.qty,
        },
      ];
      addToServerCart(formData);
    });
    alert("Items Added to Cart.");
    //window.location.href = "/";
  };
  const filterData = orderList
    .map((order) => ({
      ...order,
      orderDetail: order.orderDetail.filter(
        (detail) => detail.detailType === activeTab,
      ),
    }))
    .filter((order) => order.orderDetail.length > 0);

  const orderStickerGet = async (bagNo: string) => {
    const token = localStorage.getItem("OnlineSellerToken");
    const response = await WareHouseStickerGet(bagNo, String(token));
    if (response.status === 200) {
      const data = response.data as responseGetSticker;
      setStickerData(data.stickerData);
    }
  };
  return (
    <>
      {/* Rejection Modal */}
      {ShowDescription && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 relative overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setShowDescription(false);
                setDescription("");
                setDelievryID("");
                setSelectedAddressId("");
                setQty("");
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {Reason} Order
              </h3>
              <p className="text-sm text-gray-500">Please provide a reason</p>
            </div>
            {Reason === "Return" && (
              <InputFieldGeneric
                label="Return Qty"
                type="number"
                required={false}
                placeholder="Enter Qty"
                SateChange={Qty}
                setSateChange={setQty}
                disabled={false}
                readonly={false}
                max={Number(OriginalQty)}
                min={1}
              />
            )}
            {Reason === "Return" && (
              <>
                <label className="block text-sm font-medium text-neutral-700 ">
                  Video Upload
                  <span className="text-red-600 text-lg ml-1">*</span>
                </label>
                <input
                  type="file"
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm"
                  onChange={(e) => {
                    const value = e.target.files?.[0] ?? null;
                    if ((value?.size || 0) / 1048576 >= 15)
                      return alert("Max File Size is 15 MB");
                    else {
                      setForVideo({
                        file: value,
                      });
                    }
                  }}
                />
              </>
            )}
            {Reason === "Reject" ? (
              <TextAreaFieldGeneric
                label="Reason"
                required={false}
                placeholder="Enter reason for rejection..."
                SateChange={Description}
                setSateChange={setDescription}
                disabled={false}
              />
            ) : (
              <DropDownList
                label="Reason"
                placeholder="Select Reason"
                required={true}
                value={Description}
                onChange={setDescription}
                filedID={() => {}}
                options={ReasonList.map((item) => ({
                  label: item.reason,
                  value: item.reason,
                  id: item.reasonID,
                }))}
              />
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowDescription(false);
                  setDescription("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <ActionButton
                text={`Confirm ${Reason}`}
                update={false}
                loading={loading}
                loadingtext="Processing..."
                size={true}
                onClick={() => {
                  if (Reason.toLowerCase() === "reject") {
                    RejectBags();
                  }
                  if (Reason.toLowerCase() === "return") {
                    AddOrder();
                  }
                }}
                disabled={false}
              />
            </div>
          </div>
        </div>
      )}
      {StickerData && (
        <div className="fixed inset-0 w-full  h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm z-100">
          <div className="bg-white  rounded-2xl shadow-lg p-6 w-full max-w-3xl ">
            <div className="flex w-full justify-end">
              <button
                onClick={() => {
                  setStickerData(undefined);
                }}
                className="text-right text-gray-600 hover:text-red-500"
              >
                <X />
              </button>
            </div>
            <ReceiptPrintModal getData={StickerData} />
          </div>
        </div>
      )}

      <div className="w-full  mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBag className="h-7 w-7 text-blue-600" />
              My Orders
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track and manage all your orders in one place
            </p>
          </div>
          <div className="text-sm text-gray-400">
            {orderList.length} {orderList.length === 1 ? "Order" : "Orders"}
          </div>
        </div>
        <ul className="flex w-full text-center bg-white border border-gray-200 rounded-md mt-2 mb-2">
          <li className="flex-1">
            <button
              onClick={() => {
                setActiveTab("Sale");
              }}
              className={`block w-full py-2 px-4 rounded-t-md ${
                activeTab === "Sale"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 text-black"
              }`}
            >
              Sale
            </button>
          </li>
          <li className="flex-1">
            <button
              onClick={() => {
                setActiveTab("Return");
              }}
              className={`block w-full py-2 px-4 rounded-t-md ${
                activeTab === "Return"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 text-black"
              }`}
            >
              Return
            </button>
          </li>
        </ul>

        <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : filterData.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <span className="text-lg font-semibold text-gray-400">
                No Orders Found
              </span>
              <p className="text-sm text-gray-400 mt-1">
                Your orders will appear here once you make a purchase
              </p>
            </div>
          ) : (
            <>
              {filterData.map((order) => {
                const stats = getOrderStats(order);

                return (
                  <div
                    key={order.orderNo}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Order Header */}
                    <div
                      onClick={() =>
                        setOpen(open === order.orderNo ? "" : order.orderNo)
                      }
                      className="flex flex-col sm:flex-row sm:items-center justify-between bg-gradient-to-r from-gray-800 to-gray-700 px-5 py-4 cursor-pointer hover:from-gray-700 hover:to-gray-600 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-base font-semibold text-white flex items-center gap-2">
                          <Package className="h-4 w-4 text-blue-300" />
                          Order #{order.orderNo}
                        </h2>
                        <span className="rounded-full bg-blue-500/30 px-3 py-1 text-xs font-medium text-white border border-blue-400/30">
                          {stats.total} {stats.total === 1 ? "Bag" : "Bags"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-2 sm:mt-0">
                        <div className="flex items-center gap-4 text-white/80 text-xs">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                            {stats.delivered} Delivered
                          </span>
                          <span className="flex items-center gap-1">
                            <Truck className="h-3.5 w-3.5 text-purple-400" />
                            {stats.shipped} Shipped
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-yellow-400" />
                            {stats.processing + stats.pending} In Progress
                          </span>
                          {/* {order.orderDetail[0].status !== "rejected" &&
                          new Date().toDateString() >
                            new Date(order.postingDate).toDateString() && (
                            <button
                              type="button"
                              onClick={() => {
                                setShowDescription(true);
                                setReason("Reject");
                                setOrderID(order.ledgerID);
                                setBagNo(order.orderNo);
                              }}
                              className="rounded-lg p-1.5 bg-white text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 transition-all"
                              title="Modify Order"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          )} */}
                          {/* <button
                          type="button"
                          
                          className="rounded-lg p-1.5 bg-white text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Reject Bag"
                        >
                          <Trash className="h-4 w-4" />
                        </button> */}
                        </div>
                        <ChevronDown
                          className={`text-white/70 transition-transform duration-300 ${
                            open === order.orderNo ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {open === order.orderNo && (
                      <div className="p-5 bg-gray-50/50">
                        {/* Order Info Header */}
                        <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            Order Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Customer Name - assuming you have a name field */}
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wider">
                                Phone No
                              </p>
                              <p className="text-sm font-medium text-gray-800">
                                {order.phoneNo}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wider">
                                Order Date
                              </p>
                              <p className="text-sm font-medium text-gray-800">
                                {new Date().toDateString() <
                                  new Date(order.postingDate).toDateString() &&
                                  "Schedule for - "}
                                {new Date(order.postingDate).toDateString()}
                              </p>
                            </div>

                            {/* Email */}
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wider">
                                Email
                              </p>
                              <a
                                href={`${order.email}`}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {order.email}
                              </a>
                            </div>

                            {/* Address - Full width, properly formatted */}
                            <div className="md:col-span-3">
                              <p className="text-xs text-gray-400 uppercase tracking-wider">
                                Shipping Address
                              </p>
                              <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <span className="text-xs text-gray-400">
                                  {"(" + order.deliverAt + ")"}
                                </span>
                                {order.address && (
                                  <p className="text-sm text-gray-700">
                                    {order.address
                                      .split("/n")
                                      .filter((line) => line.trim())
                                      .join(" - ")}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bags List */}
                        <div className="overflow-x-auto">
                          <div className="space-y-4">
                            {order.orderDetail.map((bag) => {
                              const daysSincePosting = Math.floor(
                                (new Date().getTime() -
                                  new Date(bag.deliveryDate).getTime()) /
                                  (1000 * 60 * 60 * 24),
                              );
                              return (
                                <div
                                  key={bag.bagsID}
                                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                                >
                                  {/* Bag Header */}
                                  <div
                                    onClick={() =>
                                      setSubOpen(
                                        subOpen === bag.bagsID
                                          ? ""
                                          : bag.bagsID,
                                      )
                                    }
                                    className="flex items-center justify-between px-4 py-3 bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      {bag.product.length > 1 && (
                                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                          {subOpen === bag.bagsID ? (
                                            <Minus size={16} />
                                          ) : (
                                            <Plus size={16} />
                                          )}
                                        </button>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-500">
                                          Bag
                                        </span>
                                        <span className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-bold text-white">
                                          #{bag.bagNo.split("-").pop()}
                                        </span>
                                        <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                          {bag.product.length} Items
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <span
                                        className={
                                          "rounded-full bg-blue-100 px-3 py-1 text-xs font-medium capitalize text-blue-700"
                                        }
                                      >
                                        {bag.detailType}
                                      </span>
                                      {bag.status === "delieverd" && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            AddCartFunction(bag.product);

                                            // setShowDescription(true);
                                            // setOrderID(order.ledgerID);
                                            // setBagNo(order.orderNo);
                                          }}
                                          className="rounded-lg p-1.5 bg-white text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all"
                                          title="Re-Order"
                                        >
                                          <ShoppingCart className="h-4 w-4" />
                                        </button>
                                      )}
                                      {bag.status !== "delieverd" &&
                                        bag.status !== "rejected" && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setShowDescription(true);
                                              setReason("Reject");
                                              setOrderID(bag.detailID);
                                              setBagNo(bag.bagNo);
                                            }}
                                            className="rounded-lg p-1.5 bg-white text-red-600 hover:text-red-700 hover:bg-red-50 transition-all"
                                            title="Reject Order"
                                          >
                                            <Trash className="h-4 w-4" />
                                          </button>
                                        )}
                                      {bag.status === "shipped" &&
                                        bag.detailType === "Return" && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              orderStickerGet(bag.bagNo);
                                            }}
                                            className="rounded-lg p-1.5 bg-white text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all"
                                            title="Export Sticker"
                                          >
                                            <Download className="h-4 w-4" />
                                          </button>
                                        )}
                                    </div>
                                  </div>

                                  {/* Bag Products */}
                                  {subOpen === bag.bagsID && (
                                    <div className="divide-y divide-gray-100">
                                      {bag.product.map((product, index) => (
                                        <div
                                          key={`${bag.bagsID}-${index}`}
                                          className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 py-4 hover:bg-gray-50/50 transition-colors"
                                        >
                                          {/* Product Image */}
                                          <div className="flex-shrink-0">
                                            <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                              <img
                                                src={product.url}
                                                alt={product.productName}
                                                className="h-full w-full object-cover"
                                              />
                                            </div>
                                          </div>

                                          {/* Product Details */}
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 truncate">
                                              {product.productName}
                                            </p>
                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                              {product.values.map(
                                                (variant, vIdx) => (
                                                  <span
                                                    key={vIdx}
                                                    className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                                                  >
                                                    {variant.value}
                                                  </span>
                                                ),
                                              )}
                                            </div>
                                          </div>

                                          {/* Quantity */}
                                          <div className="flex items-center gap-2">
                                            <span
                                              className={getStatusStyles(
                                                bag.status,
                                              )}
                                            >
                                              {bag.status}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400">
                                              Qty:
                                            </span>
                                            <span className="inline-flex min-w-10 items-center justify-center rounded-lg bg-gray-100 px-3 py-1 text-sm font-bold text-gray-700">
                                              {product.qty}
                                            </span>
                                          </div>

                                          {/* Video */}
                                          <div className="flex items-center">
                                            {bag.videoUrl ? (
                                              <a
                                                href={bag.videoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                              >
                                                <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                                                  <video
                                                    src={bag.videoUrl}
                                                    className="h-full w-full object-cover"
                                                  />
                                                </div>
                                                <span className="hidden sm:inline">
                                                  Preview
                                                </span>
                                              </a>
                                            ) : (
                                              <span className="text-xs text-gray-400">
                                                No video
                                              </span>
                                            )}
                                          </div>

                                          {/* Courier Info */}
                                          <div className="flex flex-col items-start sm:items-end">
                                            {bag.serviceName && (
                                              <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                                <Truck className="h-3 w-3" />
                                                {bag.serviceName}
                                              </span>
                                            )}
                                            {bag.trackingID && (
                                              <span className="text-xs text-gray-400 font-mono">
                                                {bag.trackingID}
                                              </span>
                                            )}
                                          </div>

                                          <div className="flex flex-col items-start sm:items-end">
                                            {daysSincePosting <=
                                              order.returnThreshold &&
                                              bag.status === "delieverd" && (
                                                <button
                                                  className="rounded-lg p-1.5 bg-white text-blue-600 hover:text-blue-700 hover:bg-blue-100 transition-all"
                                                  title="Return Item"
                                                  onClick={() => {
                                                    setShowDescription(true);
                                                    setQty(String(product.qty));
                                                    setOrderID(order.ledgerID);
                                                    setSelectedAddressId(
                                                      order.shippingDetailID,
                                                    );
                                                    setOrderNo(order.orderNo);
                                                    setDelievryID(
                                                      order.deliveryTypeID,
                                                    );
                                                    setProductData(product);
                                                    setOriginalQty(
                                                      String(product.qty),
                                                    );
                                                    setReason("Return");
                                                  }}
                                                >
                                                  <Repeat />
                                                </button>
                                              )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
}
