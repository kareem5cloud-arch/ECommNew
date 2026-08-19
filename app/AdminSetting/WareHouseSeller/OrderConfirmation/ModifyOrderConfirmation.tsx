import { SendDataToApi } from "@/app/api/Controller/MiddleWare/CloudinaryUplaod";
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

import {
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Minus,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  //update: boolean;
  StoreList: storeList[];
  onShowMessage: (message: string, type: "success" | "error") => void;
  showMenu: (data: boolean) => void;
  description: string;
  setLoading: (data: boolean) => void;
  setCallFunction: number;
  setDescription: (data: string) => void;
}
export default function ModifyOrderConfirmation({
  StoreList,
  onShowMessage,
  showMenu,
  setLoading,
  description,
  setCallFunction,
  setDescription,
}: propsForAddRegion) {
  const [StoreName, setStoreName] = useState("");
  const [StoreID, setStoreID] = useState("");
  const [OrderName, setOrderName] = useState("");
  const [OrderID, setOrderID] = useState("");
  const [orderList, setOrderList] = useState<dataWhole[]>([]);
  const [logoUrl, setLogoUrl] = useState<File | null>(null);
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
  const CategoryAdd = async (status: string) => {
    try {
      setLoading(true);
      if (!StoreID) return alert("Please Fill in Filed with *");
      else {
        if (!logoUrl) return;
        const data = await SendDataToApi(logoUrl);
        const url = data.data;
        const formData = {
          bagsID: StoreID,
          videoUrl: url,
          description: description,
          status: status,
        };
        const token = localStorage.getItem("WareHouseSellerToken");
        const response = await WareHouseOrderConfirmation(
          formData,
          String(token),
        );
        if (response.status == 200) {
          onShowMessage(response.data.message, "success");
        } else {
          onShowMessage(response.data.message, "error");
        }
      }
    } finally {
      setLoading(false);
    }
  };
  const getOrder = async (ID: string) => {
    const token = localStorage.getItem("WareHouseSellerToken");
    const response = await WareHouseOrderApproveGet(ID, String(token));
    if (response.status == 200) {
      const data = response.data as GetResponseWareHouse;
      setOrderList(data.order);
    } else {
      setOrderList([]);
    }
  };

  const RejetcItem = async (bagID: string, detailID: string, qty: number) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("WareHouseSellerToken");

      const formData = {
        bagsID: bagID,
        qty: qty,
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

      const token = localStorage.getItem("WareHouseSellerToken");
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
  useEffect(() => {
    if (setCallFunction > 0 && rejectOrder) {
      RejetcBags(rejectOrder?.bagID || "", rejectOrder?.orderNo || "");
      setRejectOrder(null);
      setRejectItem(null);
      showMenu(false);
    }
    if (setCallFunction > 0 && rejectItem) {
      RejetcItem(rejectItem.bagID, rejectItem.detailID, rejectItem.qty);
      showMenu(false);
      setRejectOrder(null);
      setRejectItem(null);
    }
  }, [setCallFunction]);
  useEffect(() => {
    getOrder(StoreID);
  }, [StoreID]);
  return (
    <>
      <div className="w-full flex flex-col gap-8">
        <DropDownList
          label="Store"
          placeholder="Select Store"
          required={true}
          filedID={setStoreID}
          value={StoreName}
          onChange={setStoreName}
          options={StoreList.map((item) => ({
            label: item.storeName,
            value: item.storeName,
            id: item.storeID,
          }))}
        />

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
                                <button
                                  onClick={() => {
                                    setRejectOrder({
                                      bagID: bag.bagsID,
                                      orderNo: order.orderNo,
                                    });

                                    showMenu(true);
                                  }}
                                  type="button"
                                  className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-800"
                                  title="Delete Product"
                                >
                                  <Trash className="mx-auto h-5 w-5" />
                                </button>
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
                                    <input
                                      className="w-40 px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
                                      type="number"
                                      value={product.qty}
                                      onChange={(e) => {
                                        const value = Number(e.target.value);
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
                                                product: bagItem.product.map(
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
                                    {/* <span className="inline-flex min-w-10 items-center justify-center rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
                                      {product.qty}
                                    </span> */}
                                  </td>

                                  {/* Video */}
                                  <td className="px-4 py-4 align-middle">
                                    <FileVideoInputGeneric
                                      required={false}
                                      label=""
                                      accept="video/*"
                                      maxSizeMB={50}
                                      maxDurationSeconds={60}
                                      minDurationSeconds={5}
                                      onFileChange={setLogoUrl}
                                    />
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
                                        <FileVideoInputGeneric
                                          required={false}
                                          label=""
                                          accept="video/*"
                                          maxSizeMB={50}
                                          maxDurationSeconds={60}
                                          minDurationSeconds={5}
                                          onFileChange={setLogoUrl}
                                        />
                                      </td>

                                      {/* Actions */}
                                      <td className="px-4 py-4 text-center align-middle">
                                        -
                                        {/* <button
                                          type="button"
                                          className="rounded-lg p-2 text-green-600 transition hover:bg-green-50 hover:text-green-800"
                                          title="Approve Order"
                                        >
                                          <CheckCheck className="mx-auto h-5 w-5" />
                                        </button> */}
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
