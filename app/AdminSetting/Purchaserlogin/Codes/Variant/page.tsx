"use client";
import VarientsDeleteApi from "@/app/api/Controller/PurchaserLogin/Codes/Variants/DeleteVarient";
import { VariantsList } from "@/app/api/Types/PurchaserLogin/Codes/Variants/Varints";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import DeleteComponent from "@/app/ui/UseFulLComponent/DeleteComponent/DeleteComponent";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import { useState } from "react";
import AddFormVarient from "./AddFormVarient";
import GetCategoryMainList from "./GetListVariants";

export default function VariantPage() {
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [CatList, setCatList] = useState<VariantsList[]>([]);
  const [CategoryModifyList, setCategoryModifyList] = useState<VariantsList>();

  const DeleteRegion = async (ID: string) => {
    const token = localStorage.getItem("PurchaserLoginToken");
    const response = await VarientsDeleteApi(ID, String(token));
    if (response.status == 200) {
      const data = CatList.filter((item) => item.variantsID !== ID);
      setCatList(data);
      setDelete(false);
    } else {
      setCatList(CatList);
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
          onConfirm={() => DeleteRegion(ID)}
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
            Variant Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <>
              <AddFormVarient
                update={update}
                initalData={CategoryModifyList}
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
              <GetCategoryMainList
                setDelete={setDelete}
                update={setUpdate}
                setID={setID}
                CategoryModifyList={(till) => {
                  setCategoryModifyList(till);
                  setView("form");
                }}
                CatList={setCatList}
                CategoryNewList={CatList}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
