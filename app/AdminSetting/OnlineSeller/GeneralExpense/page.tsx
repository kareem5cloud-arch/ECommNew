"use client";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import { useState } from "react";
import AddGeneralExpense from "./AddGenralExpense";
import { expenseList } from "@/app/api/Types/OnlineSeller/GenralExpense/GenralExpense";
import GetExpenseList from "./GetGeneralExpenseList";
import DeleteComponent from "@/app/ui/UseFulLComponent/DeleteComponent/DeleteComponent";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import DeleteGeneralExpenseApi from "@/app/api/Controller/OnlineManager/GeneralExpense/DeleteGeneralExpense";

export default function GeneralExpense() {
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [expenseList, setExpenseList] = useState<expenseList>();
  const [expenseListDelete, setExpenseListDelete] = useState<expenseList[]>([]);

  const [Delete, setDelete] = useState(false);
  const [ID, setID] = useState("");

  const DeleteExpense = async (ID: string) => {
    const token = localStorage.getItem("OnlineSellerToken");
    const formData = {
      expenseID: ID,
    };
    const response = await DeleteGeneralExpenseApi(formData, String(token));
    if (response.status == 200) {
      const data = expenseListDelete.filter((item) => item.expenseID !== ID);
      if (data) {
        setExpenseListDelete(data);
        setDelete(false);
      }
    } else {
      setExpenseListDelete(expenseListDelete);
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
          onConfirm={() => DeleteExpense(ID)}
        />
      )}
      <div>
        <ShowAddFile
          update={setUpdate}
          setlistView={() => {}}
          setView={setView}
          view={view}
        />
        <div className="flex justify-between items-center mt-6 mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            General-Expense Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <AddGeneralExpense
              update={update}
              initalDate={expenseList}
              onShowMessage={(msg, type) => {
                setShowMessage(msg);
                setMessageType(type);
                if (type === "success") {
                  setView("list");
                }
              }}
            />
          )}
          {view === "list" && (
            <GetExpenseList
              setDelete={setDelete}
              update={setUpdate}
              setID={setID}
              setExpenseListDelete={setExpenseListDelete}
              expenseListDelete={expenseListDelete}
              //setExpenseList={setExpenseList}
              setExpenseList={(till) => {
                setExpenseList(till);
                setView("form");
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
