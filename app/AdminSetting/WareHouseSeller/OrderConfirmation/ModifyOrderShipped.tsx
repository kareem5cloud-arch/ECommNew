import WareHouseStickerGet from "@/app/api/Controller/WareHouseSeller/GetStickerData";
import WareHouseOrderApproveGet from "@/app/api/Controller/WareHouseSeller/OrderApproveGet";
import {
  dataWhole,
  GetResponseWareHouse,
  responseGetSticker,
  stickerData,
} from "@/app/api/Types/WareHouse/OrderConfimration";
import {
  CheckCheck,
  ChevronDown,
  Download,
  Ellipsis,
  Minus,
  Plus,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
interface ModifyProps {
  StoreID: string;
  setLedgerID: (data: string) => void;
  setBagNo: (data: string) => void;
  setShowCOnfirmShipping: (data: boolean) => void;
  setStickerData: (data: stickerData) => void;
  setTotalBill: (data: string) => void;
  setPaymentStatus: (data: string) => void;
  setPaymentMethod: (data: string) => void;
}
export default function ModifyOrderShipped({
  StoreID,
  setShowCOnfirmShipping,
  setLedgerID,
  setBagNo,
  setStickerData,
  setTotalBill,
  setPaymentStatus,
  setPaymentMethod,
}: ModifyProps) {
  const [orderList, setOrderList] = useState<dataWhole[]>([]);
  const [open, setOpen] = useState("");
  const [subOpen, setSubOpen] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const getOrder = async (ID: string) => {
    const token = localStorage.getItem("WareHouseSellerToken");
    const response = await WareHouseOrderApproveGet(ID, String(token));
    if (response.status == 200) {
      const data = response.data as GetResponseWareHouse;
      const filteredData = data.order
        .map((item) => ({
          ...item,
          bags: item.bags.filter(
            (bags) =>
              bags.status === "packed" ||
              (bags.status === "shipped" && bags.orderType === "Sale"),
          ),
        }))
        .filter((order) => order.bags.length > 0);
      setOrderList(filteredData);
    } else {
      setOrderList([]);
    }
  };

  const orderStickerGet = async (bagNo: string) => {
    const token = localStorage.getItem("WareHouseSellerToken");
    const response = await WareHouseStickerGet(bagNo, String(token));
    if (response.status === 200) {
      const data = response.data as responseGetSticker;
      setStickerData(data.stickerData);
    }
  };
  useEffect(() => {
    getOrder(StoreID);
  }, [StoreID]);
  return (
    <>
      <div className="w-full flex flex-col gap-8">
        <div className="space-y-8">
          {orderList.map((order) => (
            <div
              key={order.orderNo}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              {/* Order Header */}
              <div
                onClick={() =>
                  setOpen(open === order.orderNo ? "" : order.orderNo)
                }
                className="flex items-center justify-between bg-gray-800 px-5 py-4"
              >
                <div className="flex gap-2">
                  <h2 className="text-base font-semibold text-white">
                    Order #{order.orderNo}
                  </h2>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    {order.bags.length}{" "}
                    {order.bags.length === 1 ? "Bag" : "Bags"}
                  </span>
                </div>
                <button className="text-white cursor-pointer">
                  <ChevronDown
                    className={`${open === order.orderNo ? "rotate-180 transition" : "transition"}`}
                  />
                </button>
              </div>
              {open === order.orderNo && (
                <div className="overflow-x-auto transition">
                  <table className="w-full min-w-[900px] border-collapse">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
                        <th className="w-16 px-4 py-3">#</th>
                        <th className="px-4 py-3">Product</th>
                        <th className="w-32 px-4 py-3 text-center">Quantity</th>
                        <th className="w-72 px-4 py-3 text-center">Video</th>
                        <th className="w-24 px-4 py-3 text-center">Approve</th>
                      </tr>
                    </thead>

                    <tbody>
                      {order.bags.map((bag) => (
                        <>
                          <tr
                            onClick={() => setSubOpen(bag.bagsID)}
                            className="bg-blue-50"
                          >
                            <td
                              colSpan={7}
                              className="border-y border-blue-100 px-4 py-3"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                  {order.bags.length !== 1 && (
                                    <button className=" cursor-pointer transition">
                                      <>
                                        {subOpen === bag.bagsID ? (
                                          <Minus size={15} />
                                        ) : (
                                          <Plus size={15} />
                                        )}
                                      </>
                                    </button>
                                  )}
                                  <div className="flex gap-2">
                                    <span className="text-sm mt-1 font-semibold text-gray-800">
                                      Bag No:
                                    </span>

                                    <span className="rounded-md bg-blue-100 px-2.5 py-1 text-sm font-bold text-blue-700">
                                      {bag.bagNo.split("-").pop()}
                                    </span>
                                    <span className="rounded-md bg-blue-100 px-2.5 py-1 text-sm font-bold text-blue-700 text-xs">
                                      Items:{bag.product.length}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium capitalize text-green-700">
                                    {bag.status}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      {
                                        if (bag.status === "packed") {
                                          setLedgerID(order.ledgerID);
                                          setShowCOnfirmShipping(true);
                                          setBagNo(bag.bagNo);
                                          const total = bag.product.reduce(
                                            (add, item) => {
                                              return add + item.qty * item.rate;
                                            },
                                            0,
                                          );
                                          setPaymentStatus(bag.paymentStatus);
                                          setPaymentMethod(bag.paymentMethod);
                                          setTotalBill(
                                            String(total + bag.shippingCharges),
                                          );
                                        }
                                        if (bag.status === "shipped") {
                                          orderStickerGet(bag.bagNo);
                                        }
                                      }
                                    }}
                                    className="rounded-lg p-2 text-green-600 transition hover:bg-green-50 hover:text-green-800"
                                    title={`${bag.status === "shipped" ? "Export Sticker" : "Approve Order"}`}
                                  >
                                    {bag.status === "shipped" ? (
                                      <>
                                        <Download className="mx-auto h-5 w-5" />
                                      </>
                                    ) : (
                                      <CheckCheck className="mx-auto h-5 w-5" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                          {/* Products */}
                          <>
                            {bag.product.map((product, index) => (
                              <tr
                                key={`${bag.bagsID}-${index}`}
                                className="border-b border-gray-100 transition hover:bg-gray-50"
                              >
                                {/* Number */}
                                <td className="px-4 py-4 align-middle text-sm text-gray-500">
                                  {index + 1}
                                </td>

                                {/* Product */}
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-4">
                                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                      <img
                                        src={product.url}
                                        alt={product.productName}
                                        width={64}
                                        height={64}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>

                                    <div className="min-w-0">
                                      <p className="max-w-[450px] truncate text-sm font-semibold uppercase text-gray-900">
                                        {product.productName} -{" "}
                                        {product.varintValue
                                          .map((item) => item.value)
                                          .join(" - ")}
                                      </p>

                                      <div className="mt-1 flex flex-wrap gap-2">
                                        {product.varintValue.map(
                                          (variant, variantIndex) => (
                                            <span
                                              key={variantIndex}
                                              className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-600"
                                            >
                                              {variant.value}
                                            </span>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Quantity */}
                                <td className="px-4 py-4 text-center align-middle">
                                  <span className="inline-flex min-w-10 items-center justify-center rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
                                    {product.qty}
                                  </span>
                                </td>

                                {/* Video */}
                                <td className="px-4 py-4 align-center">
                                  <a
                                    href={bag.videoUrl}
                                    target="_blank"
                                    // rel="noopener noreferrer"
                                  >
                                    <video
                                      src={bag.videoUrl}
                                      width="30"
                                      height="40"
                                    ></video>
                                  </a>
                                </td>
                                <td className="px-4 py-4 text-center align-middle">
                                  {" "}
                                  -
                                </td>
                              </tr>
                            ))}
                          </>
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
