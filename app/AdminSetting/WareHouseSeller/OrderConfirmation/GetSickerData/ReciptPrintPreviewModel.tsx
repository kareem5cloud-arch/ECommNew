"use client";

import { stickerData } from "@/app/api/Types/WareHouse/OrderConfimration";
import { Check, Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ShippingLabel from "./GetStickerData";
import PDFExportHandlers from "./PDFExportHandler";

interface getExportData {
  getData: stickerData;
}

export default function ReceiptPrintModal({ getData }: getExportData) {
  const thermalRef = useRef<HTMLDivElement>(null);
  const a5Ref = useRef<HTMLDivElement>(null);
  const [returnType, setReturnType] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportHandlers, setShowExportHandlers] = useState(false);
  const [showTemplateValue, setshowTemplateValue] = useState(true);
  useEffect(() => {
    console.log(getData);
  }, [getData]);

  const handleReturnTypeChange = (type: string) => {
    setReturnType(type);
    setShowPreview(true);
  };

  const handleExportClick = () => {
    setIsExporting(true);
    setShowExportHandlers(true);
  };

  const handleExportComplete = () => {
    setIsExporting(false);
    setShowExportHandlers(false);
  };

  const getPreviewComponent = () => {
    switch (returnType) {
      case "Thermal Print":
      // return (
      //   <div className="print-area">
      //     <div className="scale-wrapper">
      //       {/* <ThermalPreviewModel getData={getData} printRef={thermalRef} /> */}
      //       <ThermalReceipt getData={getData} printRef={thermalRef} />
      //     </div>
      //   </div>
      // );
      case "A4 Print":
      // return (
      //   <A4PreviewModel
      //     getData={getData}
      //     printRef={a4Ref}
      //     showHeader={showDummyDiscount}
      //     showTempalte={showTemplateValue}
      //   />
      // );
      case "A5 Print":
        return (
          <ShippingLabel
            stickerData={getData}
            printRef={a5Ref}
            showTemplateValue={showTemplateValue}
          />
        );
      default:
        return null;
    }
  };

  const getScaleFactor = () => {
    switch (returnType) {
      // case "Thermal Print":
      //   return "transform scale-[1]";
      //   case "A4 Print":
      //     return "transform scale-[1]";
      case "A5 Print":
        return "transform scale-[1]";
      default:
        return "";
    }
  };

  const getBgColor = () => {
    switch (returnType) {
      // case "Thermal Print":
      //   return "bg-yellow-50";
      //   case "A4 Print":
      //     return "bg-green-50";
      case "A5 Print":
        return "bg-purple-50";
      default:
        return "bg-gray-50";
    }
  };

  const getThemeColor = () => {
    switch (returnType) {
      // case "Thermal Print":
      //   return "yellow";
      //   case "A4 Print":
      //     return "green";
      case "A5 Print":
        return "purple";
      default:
        return "gray";
    }
  };

  return (
    <>
      <div className="mt-2 flex flex-col justify-center items-center w-full">
        {/* Image/Preview Section */}
        <div
          className={`w-full flex justify-center ${getBgColor()} shadow-md rounded-md mx-auto overflow-hidden transition-all duration-300 min-h-[300px]`}
        >
          {showPreview &&
          (returnType === "Thermal Print" ||
            returnType === "A4 Print" ||
            returnType === "A5 Print") ? (
            <div className="w-full overflow-x-auto overflow-y-auto max-h-[500px] p-4 flex justify-center">
              <div className="inline-block">
                <div className={`${getScaleFactor()} origin-top-center`}>
                  {getPreviewComponent()}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-3">
                <span className="text-3xl text-gray-400">🖨️</span>
              </div>
              <p className="text-sm text-gray-500">
                Select print type to preview
              </p>
              <p className="text-xs text-gray-400 mt-1">A4 </p>
            </div>
          )}
        </div>
        <div className="flex mt-2">
          <div className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={showTemplateValue}
              onChange={(e) => setshowTemplateValue(e.target.checked)}
            />
            <label className="text-sm text-gray-600">Fragile Message</label>
          </div>
        </div>

        {/* Print Type Buttons */}
        <div className="flex justify-center gap-2 mt-3">
          {["A5 Print"].map((type) => {
            const isActive = returnType === type;

            return (
              <button
                key={type}
                onClick={() => handleReturnTypeChange(type)}
                className={`px-4 py-2 rounded-md text-xs font-semibold transition-all duration-200
                  ${
                    isActive
                      ? type === "Thermal Print"
                        ? "bg-yellow-500 text-white shadow-md scale-105 ring-2 ring-yellow-300"
                        : type === "A4 Print"
                          ? "bg-green-500 text-white shadow-md scale-105 ring-2 ring-green-300"
                          : "bg-purple-500 text-white shadow-md scale-105 ring-2 ring-purple-300"
                      : type === "Thermal Print"
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300"
                        : type === "A4 Print"
                          ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                          : "bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300"
                  }
                `}
              >
                {type}
                {isActive && <Check size={12} className="inline ml-1" />}
              </button>
            );
          })}
        </div>

        {/* Preview Info Bar */}
        {showPreview && (
          <div
            className={`w-full mt-2 px-3 py-1.5 bg-${getThemeColor()}-50 rounded-md text-[10px] text-${getThemeColor()}-700 flex justify-between items-center border border-${getThemeColor()}-200`}
          >
            <span className="flex items-center gap-1">
              <span>📄</span> {returnType} preview
            </span>
            <span>
              {returnType === "Thermal Print"
                ? "80mm × 297mm (thermal paper)"
                : returnType === "A4 Print"
                  ? "210mm × 297mm (scaled to fit)"
                  : "148mm × 210mm"}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex justify-between items-center mt-3">
          {/* Page Setup Info */}
          {returnType && (
            <div className="text-[10px] text-gray-400">
              {returnType === "Thermal Print" && "📏 Roll paper: 80mm"}
              {returnType === "A4 Print" && "📏 Sheet: A4 (scaled 45%)"}
              {/* {returnType === "A5 Print" && "📏 Sheet: A5 (scaled 70%)"} */}
            </div>
          )}

          {/* Export Button */}
          <button
            className={`flex justify-center items-center gap-2 px-4 py-2 text-sm rounded-md shadow-md text-white transition-all duration-200 ml-auto
              ${
                isExporting
                  ? "bg-gray-400 cursor-wait"
                  : returnType === "Thermal Print"
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : returnType === "A4 Print"
                      ? "bg-green-600 hover:bg-green-700"
                      : returnType === "A5 Print"
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-gray-400 cursor-not-allowed"
              }`}
            title="Export"
            disabled={!returnType || isExporting}
            onClick={handleExportClick}
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download size={15} />
                <span>Export {returnType || "PDF"}</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Tips */}
        {returnType === "Thermal Print" && (
          <div className="w-full mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-[9px] text-yellow-700">
            💡 Thermal receipt uses 80mm paper roll. Compatible with standard
            POS printers.
          </div>
        )}
        {returnType === "A4 Print" && (
          <div className="w-full mt-2 p-2 bg-green-50 border border-green-200 rounded-md text-[9px] text-green-700">
            💡 A4 preview scaled to 45% for better viewing. Use horizontal
            scroll if needed.
          </div>
        )}
        {showExportHandlers && (
          <PDFExportHandlers
            getData={getData}
            thermalRef={thermalRef}
            //a4Ref={a4Ref}
            a5Ref={a5Ref}
            returnType={returnType}
            onExportComplete={handleExportComplete}
          />
        )}
      </div>
    </>
  );
}
