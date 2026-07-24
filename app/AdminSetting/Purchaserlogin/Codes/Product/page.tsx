"use client";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import { useEffect, useState } from "react";
import AddProductForm from "./AddProductForm";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import GetProductList from "./GetProductList";
import { productList } from "@/app/api/Types/OnlineSetting/Product/Product";
import ModifyBasicInfo from "./ModifyProduct/ModifyBasicInfo";
import { X } from "lucide-react";
import ModifyProductImage from "./ModifyProduct/ModifyImageList";
import AddProductImage from "./AddProduct/ProductImageInfo";
import { imagesData } from "./AddProduct/VarientInformation";
import { IoGitMerge } from "react-icons/io5";
export default function ProductManagement() {
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [showBasicINfoModel, setShowBasicINfoModel] = useState(false);
  const [showImageListModel, setShowImageListModel] = useState(false);
  const [productList, setProductList] = useState<productList>();
  const [event, setEvent] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [showPopupModel, setShowPopupModel] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagesList, setImagesList] = useState<imagesData[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [rowID, setRowID] = useState("");

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
      {showBasicINfoModel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          //onClick={() => setShowBasicINfoModel(false)}
          style={{ marginBottom: "0px" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/30 backdrop-blur-sm"></div>
          <div
            //onClick={(e) => e.stopPropagation()}
            className="relative bg-white p-6 rounded-lg shadow-xl z-10 max-w-2xl max-w-full"
          >
            <div className="w-full flex justify-end">
              <button
                onClick={() => setShowBasicINfoModel(false)}
                className="text-gray-800 hover:text-red-500 cursor-pointer"
              >
                <X />
              </button>
            </div>{" "}
            <h1 className="text-2xl font-semibold text-neutral-900">
              Basic Info Modify
            </h1>
            <ModifyBasicInfo
              initalData={productList}
              refreshevent={setEvent}
              onShowMessage={(msg, type) => {
                setShowMessage(msg);
                setMessageType(type);
                if (type === "success") {
                  setView("list");
                  setShowBasicINfoModel(false);
                }
              }}
            />
          </div>
        </div>
      )}

      {showImageListModel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          //onClick={() => setShowBasicINfoModel(false)}
          style={{ marginBottom: "0px" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/30 backdrop-blur-sm"></div>
          <div
            //onClick={(e) => e.stopPropagation()}
            className="relative bg-white p-6 rounded-lg shadow-xl z-10 max-w-2xl"
          >
            <div className="w-full flex justify-end">
              <button
                onClick={() => setShowImageListModel(false)}
                className="text-gray-800 hover:text-red-500 cursor-pointer"
              >
                <X />
              </button>
            </div>{" "}
            <h1 className="text-2xl font-semibold text-neutral-900">
              Modify Product Image
            </h1>
            <ModifyProductImage
              initalData={productList}
              refreshevent={setEvent}
              onShowMessage={(msg, type) => {
                setShowMessage(msg);
                setMessageType(type);
                if (type === "success") {
                  setView("list");
                  setShowImageListModel(false);
                }
              }}
            />
          </div>
        </div>
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
            Product Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <>
              <AddProductForm
                onShowMessage={(msg, type) => {
                  setShowMessage(msg);
                  setMessageType(type);
                  if (type === "success") {
                    setView("list");
                  }
                }}
                images={imagesList}
                setImages={setImages}
                showPopupModel={setShowPopupModel}
                imageRowID={setRowID}
              />
            </>
          )}
          {view === "list" && (
            <>
              <GetProductList
                refreshevent={event}
                setShowBasicINfoModel={setShowBasicINfoModel}
                initalData={setProductList}
                setShowImageListModel={setShowImageListModel}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
