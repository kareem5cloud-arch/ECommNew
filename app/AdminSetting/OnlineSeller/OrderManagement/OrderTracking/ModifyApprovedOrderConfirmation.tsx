import { SendDataToApiVideo } from "@/app/api/Controller/MiddleWare/VideoUplaodCloudinary";
import WareHouseOrderApproveGet from "@/app/api/Controller/WareHouseSeller/OrderApproveGet";
import WareHouseRejectItem from "@/app/api/Controller/WareHouseSeller/RejectItem";
import WareHouseRejectBag from "@/app/api/Controller/WareHouseSeller/RejectOrderBag";
import WareHouseOrderConfirmation from "@/app/api/Controller/WareHouseSeller/WareHouseOrderConfirmation";
import { storeList } from "@/app/api/Types/AdminSetting/Store/Store";
import {
  dataWhole,
  GetResponseWareHouse,
  ModifyOrderWareHouse,
} from "@/app/api/Types/WareHouse/OrderConfimration";
import DropDownList from "@/app/ui/DropDownList/DropDownList";

import FileVideoInputGeneric from "@/app/ui/inputFiled/VideoInputfield";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";

import {
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Ellipsis,
  Minus,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  //update: boolean;
  setOriginalQty: (data: string) => void;
  rejectQty: String;
  StoreID: string;
  onShowMessage: (message: string, type: "success" | "error") => void;
  showMenu: (data: boolean) => void;
  description: string;
  setLoading: (data: boolean) => void;
  setCallFunction: number;
  setDescription: (data: string) => void;
  activeTab: string;
}
interface VideoUrlData {
  bagNo: string;
  detailID: string;
  file: File;
}

export default function ModifyApprovedOrderConfirmation({
  StoreID,
  onShowMessage,
  showMenu,
  rejectQty,
  setLoading,
  description,
  setCallFunction,
  setDescription,
  setOriginalQty,
  activeTab,
}: propsForAddRegion) {
  const [OrderName, setOrderName] = useState("");
  const [OrderID, setOrderID] = useState("");
  const [orderList, setOrderList] = useState<dataWhole[]>([]);
  const [isLoading, setisLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<{
    bagNo: string;
    file: File | null;
    detailID: string;
  } | null>(null);
  const [forVideo, setForVideo] = useState<VideoUrlData[]>([]);
  const [rejectItem, setRejectItem] = useState<{
    bagID: string;
    detailID: string;
    qty: number;
  } | null>(null);
  const [rejectOrder, setRejectOrder] = useState<{
    bagID: string;
    orderNo: string;
  } | null>(null);

  const [open, setOpen] = useState("");
  const [subOpen, setSubOpen] = useState("");

  const getOrder = async (ID: string) => {
    const token = localStorage.getItem("OnlineSellerToken");
    const response = await WareHouseOrderApproveGet(ID, String(token));
    if (response.status == 200) {
      const data = response.data as GetResponseWareHouse;
      const filteredData = data.order
        .map((item) => ({
          ...item,
          bags: item.bags.filter(
            (bags) => bags.status === "approved" && bags.orderType === "Sale",
          ),
        }))
        .filter((order) => order.bags.length > 0);
      setOrderList(filteredData);
    } else {
      setOrderList([]);
    }
  };
  useEffect(() => {
    getOrder(StoreID);
  }, [StoreID]);
  const RejetcItem = async (bagID: string, detailID: string) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("OnlineSellerToken");

      const formData = {
        bagsID: bagID,
        qty: Number(rejectQty),
        detailID: detailID,
        description: description,
      };
      const response = await WareHouseRejectItem(formData, String(token));

      if (response.status === 200) {
        onShowMessage(response.data.message, "success");
        getOrder(StoreID);
        setDescription("");
      } else {
        onShowMessage(response.data.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };
  const RejetcBags = async (bagID: string, orderNo: string) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("OnlineSellerToken");
      const data = orderList.find((item) => item.orderNo === orderNo);

      if (!data) {
        onShowMessage("Order not found", "error");
        return;
      }

      const bag = data.bags.find((item) => item.bagsID === bagID);

      if (!bag) {
        onShowMessage("Bag not found", "error");
        return;
      }
      const formData = {
        bagsNo: bag.bagNo,
        description: description,
        lists: bag.product.map((product) => ({
          detailID: product.detailID,
          qty: product.qty,
        })),
      };
      const response = await WareHouseRejectBag(formData, String(token));

      if (response.status === 200) {
        onShowMessage(response.data.message, "success");
        getOrder(StoreID);
        setDescription("");
      } else {
        onShowMessage(response.data.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const ApproveBag = async (bagNo: string, orderNo: string) => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("OnlineSellerToken");
      const data = orderList.find((item) => item.orderNo === orderNo);
      if (!data) {
        onShowMessage("Order not found", "error");
        return;
      }
      const bag = data.bags.find((item) => item.bagNo === bagNo);
      if (!bag) {
        onShowMessage("Bag not found", "error");
        return;
      }

      const missingVideo = forVideo.find((item) => !item.file);

      if (missingVideo) {
        alert(`Please add a video file for bag ${missingVideo.bagNo}`);
        return;
      }
      if (forVideo.length === 0) return alert(`Please add a video file`);
      const value = await Promise.all(
        forVideo.map(async (item) => {
          const response2 = await SendDataToApiVideo(item.file);
          return {
            bagsNo: item.bagNo,
            detailID: item.detailID,
            status: "packed",
            videoUrl: String(response2.data),
          };
        }),
      );
      const formData = {
        details: value,
      };
      const response = await WareHouseOrderConfirmation(
        formData,
        String(token),
      );
      if (response.status === 200) {
        onShowMessage(response.data.message, "success");
        getOrder(StoreID);
        setDescription("");
      } else {
        onShowMessage(response.data.message, "error");
      }
    } finally {
      setisLoading(false);
    }
  };
  useEffect(() => {
    if (!logoUrl?.file) return;

    setForVideo((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.bagNo === logoUrl.bagNo && item.detailID === logoUrl.detailID,
      );

      if (existingIndex !== -1) {
        return prev.map((item, index) =>
          index === existingIndex
            ? {
                bagNo: logoUrl.bagNo,
                file: logoUrl.file!,
                detailID: logoUrl.detailID,
              }
            : item,
        );
      }
      return [
        ...prev,
        {
          bagNo: logoUrl.bagNo,
          file: logoUrl.file!,
          detailID: logoUrl.detailID,
        },
      ];
    });
  }, [logoUrl]);
  useEffect(() => {
    if (setCallFunction > 0 && rejectOrder) {
      RejetcBags(rejectOrder?.bagID || "", rejectOrder?.orderNo || "");
      setRejectOrder(null);
      setRejectItem(null);
      showMenu(false);
    }
    if (setCallFunction > 0 && rejectItem) {
      RejetcItem(rejectItem.bagID, rejectItem.detailID);
      showMenu(false);
      setRejectOrder(null);
      setRejectItem(null);
    }
  }, [setCallFunction]);

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
                        <th className="w-24 px-4 py-3 text-center">Reject</th>
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
                              <div className="w-full flex flex-col">
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
                                        if (isLoading) {
                                          return;
                                        } else {
                                          ApproveBag(bag.bagNo, order.orderNo);
                                        }
                                      }}
                                      className="rounded-lg p-2 text-green-600 transition hover:bg-green-50 hover:text-green-800"
                                      title="Approve Order"
                                    >
                                      {isLoading && bag.bagNo ? (
                                        <Ellipsis className="mx-auto h-5 w-5" />
                                      ) : (
                                        <CheckCheck className="mx-auto h-5 w-5" />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => {
                                        setRejectOrder({
                                          bagID: bag.bagsID,
                                          orderNo: order.orderNo,
                                        });
                                        setOriginalQty("");
                                        showMenu(true);
                                      }}
                                      type="button"
                                      className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-800"
                                      title="Reject Order"
                                    >
                                      <Trash className="mx-auto h-5 w-5" />
                                    </button>
                                  </div>
                                </div>
                                <div>
                                  {bag.description && (
                                    <div className="mt-3 relative">
                                      {/* Sticky Note */}
                                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg shadow-sm">
                                        <div className="flex items-start gap-2">
                                          <div className="flex-1">
                                            <span className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">
                                              📌 Note
                                            </span>
                                            <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">
                                              {bag.description}
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-yellow-100 rounded-tr-lg rounded-bl-lg opacity-50"></div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                          {/* Products */}
                          {order.bags.length === 1 ? (
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
                                          {product.productName} - -{" "}
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
                                  <td className="px-4 py-4 align-middle">
                                    <input
                                      type="file"
                                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm"
                                      onChange={(e) => {
                                        const value =
                                          e.target.files?.[0] ?? null;
                                        if ((value?.size || 0) / 1048576 >= 15)
                                          return alert(
                                            "Max File Size is 15 MB",
                                          );
                                        else {
                                          setLogoUrl({
                                            bagNo: bag.bagNo,
                                            file: value,
                                            detailID: product.detailID,
                                          });
                                        }
                                      }}
                                    />

                                    {forVideo.find(
                                      (item) =>
                                        item.bagNo === bag.bagNo &&
                                        item.detailID === product.detailID,
                                    )?.file && (
                                      <p className="mt-2 text-xs text-neutral-600">
                                        {
                                          forVideo.find(
                                            (item) =>
                                              item.bagNo === bag.bagNo &&
                                              item.detailID ===
                                                product.detailID,
                                          )?.file.name
                                        }
                                      </p>
                                    )}
                                    {/* <FileVideoInputGeneric
                                      required={false}
                                      label=""
                                      accept="video/*"
                                      maxSizeMB={50}
                                      maxDurationSeconds={60}
                                      minDurationSeconds={5}
                                      onFileChange={(e)=>{
                                        setLogoUrl({
                                          bagNo:bag.bagNo,
                                          file:e
                                        })
                                      }}
                                    /> */}
                                  </td>
                                  <td className="px-4 py-4 text-center align-middle">
                                    {" "}
                                    -
                                  </td>
                                  {/* Actions */}
                                  <td className="px-4 py-4 text-center align-middle">
                                    <button
                                      onClick={() => {
                                        setRejectItem({
                                          bagID: bag.bagsID,
                                          detailID: product.detailID,
                                          qty: product.qty,
                                        });
                                        setOriginalQty(String(product.qty));
                                        showMenu(true);
                                      }}
                                      type="button"
                                      className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-800"
                                      title="Delete Product"
                                    >
                                      <Trash className="mx-auto h-5 w-5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </>
                          ) : (
                            <>
                              {subOpen === bag.bagsID && (
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
                                        {/* <span className="inline-flex min-w-10 items-center justify-center rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
                                          {product.qty}
                                        </span> */}
                                        <input
                                          className="w-40 px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
                                          type="number"
                                          value={product.qty}
                                          onChange={(e) => {
                                            const value = Number(
                                              e.target.value,
                                            );
                                            if (value > (product?.qty || 0))
                                              return alert(
                                                `You Have Reached Max Qty Limit`,
                                              );
                                            setOrderList((prev) =>
                                              prev.map((orderItem) => ({
                                                ...orderItem,
                                                bags: orderItem.bags.map(
                                                  (bagItem) => ({
                                                    ...bagItem,
                                                    product:
                                                      bagItem.product.map(
                                                        (productItem) =>
                                                          productItem.detailID ===
                                                            product.detailID &&
                                                          bagItem.bagsID ===
                                                            bag.bagsID &&
                                                          orderItem.orderNo ===
                                                            order.orderNo
                                                            ? {
                                                                ...productItem,
                                                                qty: value,
                                                              }
                                                            : productItem,
                                                      ),
                                                  }),
                                                ),
                                              })),
                                            );
                                          }}
                                        />
                                      </td>

                                      {/* Video */}
                                      <td className="px-4 py-4 align-middle">
                                        <input
                                          type="file"
                                          className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm"
                                          onChange={(e) => {
                                            const value =
                                              e.target.files?.[0] ?? null;
                                            if (
                                              (value?.size || 0) / 1048576 >=
                                              15
                                            )
                                              return alert(
                                                "Max File Size is 15 MB",
                                              );
                                            else {
                                              setLogoUrl({
                                                bagNo: bag.bagNo,
                                                file: value,
                                                detailID: product.detailID,
                                              });
                                            }
                                          }}
                                        />
                                        {forVideo.find(
                                          (item) =>
                                            item.bagNo === bag.bagNo &&
                                            item.detailID === product.detailID,
                                        )?.file && (
                                          <p className="mt-2 text-sm text-neutral-600">
                                            {
                                              forVideo.find(
                                                (item) =>
                                                  item.bagNo === bag.bagNo &&
                                                  item.detailID ===
                                                    product.detailID,
                                              )?.file.name
                                            }
                                          </p>
                                        )}
                                      </td>

                                      {/* Actions */}
                                      <td className="px-4 py-4 text-center align-middle">
                                        -
                                      </td>
                                      <td className="px-4 py-4 text-center align-middle">
                                        <button
                                          onClick={() => {
                                            setRejectItem({
                                              bagID: bag.bagsID,
                                              detailID: product.detailID,
                                              qty: product.qty,
                                            });

                                            showMenu(true);
                                          }}
                                          type="button"
                                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-800"
                                          title="Reject Order"
                                        >
                                          <Trash className="mx-auto h-5 w-5" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </>
                              )}
                            </>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* 
          <TextAreaFieldGeneric
            label="Reason"
            required={false}
            placeholder="Enter Reason"
            SateChange={description}
            setSateChange={setDescription}
            disabled={false}
          />
        <div className="flex justify-between items-center gap-2">
          <button
            onClick={() => CategoryAdd("reject")}
            //   onClick={() => {
            //     setID(item.categoryID);
            //     setDelete(true);
            //     CatList(CategoryList);
            //   }}
            className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
          >
            Reject
          </button>
          <button
            onClick={() => CategoryAdd("packaged")}
            //onClick={() => fetchData(item.categoryID)}
            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Approved
          </button>
        </div> */}
      </div>
    </>
  );
}
