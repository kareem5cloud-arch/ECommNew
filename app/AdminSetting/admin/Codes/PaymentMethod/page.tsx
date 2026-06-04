"use client";

import { useState } from "react";

import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import AddPaymentMethodForm from "./AddPaymentMethodForm";
import { PaymentMethod } from "@/app/api/Types/AdminSetting/PaymentMethod/paymentMethod";
import GetPaymentList from "./GetPaymentMethodList";
import PaymentMethodDelete from "@/app/api/Controller/AdminController/PaymentMethod/DeletePaymentMethod";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import DeleteComponent from "@/app/ui/UseFulLComponent/DeleteComponent/DeleteComponent";

export default function PaymentMethodManagement() {
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [PaymentMethodList, setPaymentMethodList] = useState<PaymentMethod>();
  const [PaymentMethodListReturn, setPaymentMethodListReturn] = useState<
    PaymentMethod[]
  >([]);
  const [PaymentMethodModify, setPaymentMethodModify] =
    useState<PaymentMethod>();

  const DeleteCouriere = async (ID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await PaymentMethodDelete(ID, String(token));
    if (response.status == 200) {
      const data = PaymentMethodListReturn.filter(
        (item) => item.paymentID !== ID,
      );
      if (data) {
        setPaymentMethodListReturn(data);
        setDelete(false);
      }
    } else {
      setPaymentMethodListReturn(PaymentMethodListReturn);
    }
  };

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
          onConfirm={() => DeleteCouriere(ID)}
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
            Payment-Method Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <>
              <AddPaymentMethodForm
                update={update}
                initalData={PaymentMethodModify}
                onShowMessage={(msg, type) => {
                  setShowMessage(msg);
                  setMessageType(type);
                  if (type === "success") {
                    setView("list");
                  }
                }}
              />
            </>
          )}
          {view === "list" && (
            <>
              <GetPaymentList
                setDelete={setDelete}
                update={setUpdate}
                setID={setID}
                onShowMessage={(msg, type) => {
                  setShowMessage(msg);
                  setMessageType(type);
                  if (type === "success") {
                    setView("list");
                  }
                }}
                standardListNewRecord={PaymentMethodListReturn}
                standardListRecord={setPaymentMethodListReturn}
                standardModifyListRecord={(till) => {
                  setPaymentMethodModify(till);
                  setView("form");
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
