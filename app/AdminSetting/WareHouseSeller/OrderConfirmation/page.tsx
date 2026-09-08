"use client";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import { useEffect, useState } from "react";
import ModifyOrderConfirmation from "./ModifyOrderConfirmation";
import StoreSellerGetApi from "@/app/api/Controller/AdminController/Store/GetStoreSeller";
import {
  ResponseGetStore,
  storeList,
} from "@/app/api/Types/AdminSetting/Store/Store";
import { X } from "lucide-react";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import ModifyOrderShipped from "./ModifyOrderShipped";
import WareHouseCourierGet from "@/app/api/Controller/WareHouseSeller/CourierServiceFetch";
import {
  courierList,
  fetchCourierResponse,
  stickerData,
} from "@/app/api/Types/WareHouse/OrderConfimration";
import WareHouseShipOrder from "@/app/api/Controller/WareHouseSeller/ShippedOrder";
import ReceiptPrintModal from "./GetSickerData/ReciptPrintPreviewModel";

export default function OrderCoinfirmation() {
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [ShowMenu, setShowMenu] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [StoreList, setStoreList] = useState<storeList[]>([]);
  const [CourierList, setCourierList] = useState<courierList[]>([]);
  const [StoreName, setStoreName] = useState("");
  const [StoreID, setStoreID] = useState("");
  const [CourierName, setCourierName] = useState("");
  const [CourierID, setCourierID] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("approved");
  const [callFunction, setCallFunction] = useState(0);
  const [showCOnfirmShipping, setShowCOnfirmShipping] = useState(false);
  const [ledgerID, setLedgerID] = useState("");
  const [TotalBill, setTotalBill] = useState("");
  const [PaymentStatus, setPaymentStatus] = useState("");
  const [PaymentMethod, setPaymentMethod] = useState("");
  const [bagNo, setBagNo] = useState("");
  const [StickerData, setStickerData] = useState<stickerData>();
  const getStores = async () => {
    const token = localStorage.getItem("WareHouseSellerToken");
    const response = await StoreSellerGetApi(String(token));
    if (response.status == 200) {
      const data = response.data as ResponseGetStore;
      setStoreList(data.storeList);
    } else {
      setStoreList([]);
    }
  };
  const getCourier = async (ID: string) => {
    const token = localStorage.getItem("WareHouseSellerToken");
    const response = await WareHouseCourierGet(ID, String(token));
    if (response.status == 200) {
      const data = response.data as fetchCourierResponse;
      setCourierList(data.courierList);
    } else {
      setCourierList([]);
    }
  };
  const assingShiped = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("WareHouseSellerToken");

      const formData = {
        courierID: CourierID,
        bagNo: bagNo,
        shippingCharges: 100,
        totalBill: 0,
        paymentStatus: PaymentStatus,
        paymentMethod: PaymentMethod,
      };
      //console.log(formData);
      const response = await WareHouseShipOrder(formData, String(token));
      if (response.status == 200) {
        setBagNo("");
        setCourierID("");
        setCourierName("");
        setCourierList([]);
        setShowCOnfirmShipping(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourier(ledgerID);
  }, [ledgerID]);
  useEffect(() => {
    getStores();
  }, []);

  return (
    <>
      {showMessage && (
        <MessagePopUp
          message={showMessage}
          type={messageType}
          duration={3000}
          onClose={() => setShowMessage(null)}
        />
      )}
      {ShowMenu && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                setShowMenu(false);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <TextAreaFieldGeneric
              label="Reason"
              required={false}
              placeholder="Reason For Rejection"
              SateChange={description}
              setSateChange={setDescription}
              disabled={false}
            />
            <div className="flex justify-end mt-2">
              <ActionButton
                text="Reject Order"
                update={false}
                loading={loading}
                loadingtext="Processing..."
                size={true}
                onClick={() => setCallFunction((prev) => prev + 1)}
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

      {showCOnfirmShipping && (
        <>
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => {
                  setShowCOnfirmShipping(false);
                }}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
              <DropDownList
                label="Courier"
                placeholder="Select Courier"
                required={true}
                filedID={setCourierID}
                value={CourierName}
                onChange={setCourierName}
                options={CourierList.map((item) => ({
                  label: item.serviceName + " " + "(" + item.bagNo + ")",
                  value: item.serviceName + " " + "(" + item.bagNo + ")",
                  id: item.courierID,
                }))}
              />
              <div className="flex justify-end mt-2">
                <ActionButton
                  text="Confirmn Order"
                  update={false}
                  loading={loading}
                  loadingtext="Processing..."
                  size={true}
                  onClick={() => assingShiped()}
                  disabled={false}
                />
              </div>
            </div>
          </div>
        </>
      )}
      <div>
        <div className="flex justify-between items-center mt-6 mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Orders Management
          </h1>
        </div>

        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
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
          <ul className="flex w-full text-center mt-2 mb-2">
            <li className="flex-1">
              <button
                onClick={() => {
                  setActiveTab("approved");
                }}
                className={`block w-full py-2 px-4 rounded-t-md ${
                  activeTab === "approved"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-black"
                }`}
              >
                Approved
              </button>
            </li>
            <li className="flex-1">
              <button
                onClick={() => {
                  setActiveTab("packed");
                }}
                className={`block w-full py-2 px-4 rounded-t-md ${
                  activeTab === "packed"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-black"
                }`}
              >
                Packed
              </button>
            </li>
          </ul>
          {activeTab === "approved" && (
            <ModifyOrderConfirmation
              StoreID={StoreID}
              setLoading={setLoading}
              showMenu={setShowMenu}
              activeTab={activeTab}
              setDescription={setDescription}
              setCallFunction={callFunction}
              description={description}
              onShowMessage={(msg, type) => {
                setShowMessage(msg);
                setMessageType(type);
                if (type === "success") {
                  setView("list");
                }
              }}
            />
          )}
          {activeTab === "packed" && (
            <ModifyOrderShipped
              StoreID={StoreID}
              setShowCOnfirmShipping={setShowCOnfirmShipping}
              setStickerData={setStickerData}
              setLedgerID={setLedgerID}
              setBagNo={setBagNo}
              setTotalBill={setTotalBill}
              setPaymentStatus={setPaymentStatus}
              setPaymentMethod={setPaymentMethod}
            />
          )}
        </div>
      </div>
    </>
  );
}
