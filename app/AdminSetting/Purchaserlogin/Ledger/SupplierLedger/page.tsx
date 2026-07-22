"use client";
import SuppliergetApi from "@/app/api/Controller/OfflineSellerController/Codes/Supplier/SupplierGet";
import {
  ResponseGetSupplpierlist,
  SupplierListReponse,
} from "@/app/api/Types/OfflineSeller/Supplier/supplier";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import DeleteComponent from "@/app/ui/UseFulLComponent/DeleteComponent/DeleteComponent";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import { useEffect, useState } from "react";
import AddSupplierLedger from "./AddSupplierLedger";
import GetSupplierLedger from "./GetSupplierLedger";

export default function SupplierLedger() {
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [supplierList, setSupplierList] = useState<SupplierListReponse[]>([]);

  const GetSupplier = async () => {
    const token = localStorage.getItem("WareHouseSeller");
    const response = await SuppliergetApi(String(token));
    if (response.status === 200) {
      const data = response.data as ResponseGetSupplpierlist;
      setSupplierList(data.supplierList);
    } else {
      setSupplierList([]);
    }
  };
  useEffect(() => {
    GetSupplier();
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
      {Delete && (
        <DeleteComponent
          onCancel={() => {
            setDelete(false);
            setID("");
          }}
          onConfirm={() => {}}
        />
      )}
      <div>
        <ShowAddFile
          update={setUpdate}
          setView={setView}
          view={view}
          setlistView={() => {}}
        />
        <div className="flex justify-between items-center mt-6 mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Supplier-Ledger Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && <AddSupplierLedger supplierList={supplierList} />}
          {view === "list" && <GetSupplierLedger supplierList={supplierList} />}
        </div>
      </div>
    </>
  );
}
