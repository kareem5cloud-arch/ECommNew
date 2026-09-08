import { stickerData } from "@/app/api/Types/WareHouse/OrderConfimration";
import JsBarcode from "jsbarcode";
import { useEffect, useRef } from "react";

interface PropsStickerData {
  stickerData: stickerData;
  printRef?: any;
  showTemplateValue: boolean;
}
export default function ShippingLabel({
  stickerData,
  printRef,
  showTemplateValue,
}: PropsStickerData) {
  const barcodeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = barcodeRef.current;
    if (!canvas || !stickerData.trackingID) return;

    JsBarcode(canvas, stickerData.trackingID, {
      format: "CODE128",
      lineColor: "#000000",
      width: 2,
      height: 60,
      displayValue: false,
      margin: 5,
    });
  }, [stickerData.trackingID]);
  // useEffect(() => {
  //   const canvas = barcodeRef.current;
  //   if (!canvas) return;

  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   // Clear canvas
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);

  //   // Barcode data (tracking number)
  //   const trackingNumber = stickerData.trackingID;

  //   const generateBarcode = (data: string) => {
  //     const patterns: number[] = [];

  //     // Simple encoding - just create varying width bars
  //     // This is a visual approximation, not a real barcode
  //     for (let i = 0; i < data.length; i++) {
  //       const charCode = data.charCodeAt(i);
  //       // Create varying patterns based on character
  //       const barWidth = 2 + (charCode % 5);
  //       const gapWidth = 1 + (charCode % 3);
  //       patterns.push(barWidth, gapWidth);
  //     }

  //     return patterns;
  //   };

  //   const patterns = generateBarcode(trackingNumber);
  //   const totalWidth = patterns.reduce((a, b) => a + b, 0);
  //   const scale = canvas.width / totalWidth;

  //   let x = 0;
  //   let isBar = true;

  //   // Draw barcode
  //   for (const width of patterns) {
  //     const drawWidth = Math.max(1, Math.round(width * scale));

  //     if (isBar) {
  //       ctx.fillStyle = "#000000";
  //       ctx.fillRect(x, 0, drawWidth, canvas.height);
  //     }

  //     x += drawWidth;
  //     isBar = !isBar;
  //   }
  // }, []);
  return (
    <div
      ref={printRef}
      className="max-w-3xl w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 font-mono text-sm print:shadow-none print:border print:rounded-none transition-all"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-200 pb-2 mb-2">
        <div className="flex justify-between items-start mb-4">
          <div className="text-3xl font-bold tracking-wide">
            <img className="w-50 " src={stickerData.logoUrl} />
          </div>
        </div>

        <div className="text-xs space-y-1 text-gray-600 bg-gray-50 px-3 py-2 rounded-md border border-gray-100 w-full sm:w-auto">
          <div className="flex justify-between gap-4">
            <span className="font-semibold text-gray-700">Order Number:</span>
            <span>{stickerData.orderNo}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="font-semibold text-gray-700">
              Tracking Number:
            </span>
            <span>{stickerData.trackingID}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="font-semibold text-gray-700">Payment Status:</span>
            <span className="uppercase">{"Paid"}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="font-semibold text-gray-700">Order Date:</span>
            <span>
              {new Date(stickerData.postingDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping Method */}
      <div className="flex flex-col sm:flex-row justify-between text-sm border-b border-gray-200 pb-3 mb-2 text-gray-700">
        <div style={{ marginTop: "-10px" }}>
          <span className="font-semibold text-gray-800">Payment Method:</span>{" "}
          {stickerData.paymentMethod}
        </div>
        <div style={{ marginTop: "-10px" }}>
          <span className="font-semibold text-gray-800">
            Shipping Delivery Date:
          </span>{" "}
          {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-2">
        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
          <div style={{ marginTop: "-10px" }}>
            <div className=" text-sm uppercase tracking-wider text-gray-900 ">
              <span className="font-bold"> Recipient:</span>
              {stickerData.storeName}
            </div>
            <div className="leading-relaxed text-xs text-gray-900">
              <span className="font-bold"> Phone:</span>{" "}
              {stickerData.phoneNoStore}
            </div>
            <div className="leading-relaxed text-xs text-gray-900">
              <span className="font-bold"> Email:</span>{" "}
              {stickerData.emailStore}
            </div>
            <div className="leading-relaxed text-xs text-gray-900">
              <span className="font-bold"> Address:</span> {stickerData.address}
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
          <div style={{ marginTop: "-10px" }}>
            <div className=" text-sm uppercase tracking-wider text-gray-900 ">
              <span className="font-bold"> Sender:</span>
              {stickerData.name}
            </div>
            <div className="leading-relaxed text-xs text-gray-900">
              <span className="font-bold"> Phone:</span> {stickerData.phoneNo}
            </div>
            <div className="leading-relaxed text-xs text-gray-900">
              <span className="font-bold"> Email:</span> {stickerData.email}
            </div>
            <div className="leading-relaxed text-xs text-gray-900">
              <span className="font-bold"> Address:</span>
              {stickerData.customerAddress?.replace(/\s*\/n\s*/g, ", ")}
            </div>
          </div>
        </div>
      </div>
      {showTemplateValue && (
        <div className="my-1 py-2 px-3 border-2 border-red-500 bg-red-50 text-red-600 font-bold text-center tracking-widest uppercase text-sm rounded-lg shadow-sm">
          <div style={{ marginTop: "-14px" }} className="p-2">
            FRAGILE — PLEASE HANDLE WITH CARE
          </div>
        </div>
      )}

      {/* Weight & Dimensions */}
      <div className=" text-sm bg-gray-50 rounded-lg px-2 py-2 border border-gray-100 mb-2">
        <div
          style={{ marginTop: "-14px" }}
          className="flex flex-wrap justify-between p-1"
        >
          <div>
            <span className="font-semibold text-gray-700">Amount Due:</span>{" "}
            <span className="text-gray-800">PKR 0</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Weight:</span>{" "}
            <span className="text-gray-800">{stickerData.weight}g</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Dimensions:</span>{" "}
            <span className="text-gray-800">
              {stickerData.height}&quot; x {stickerData.width}&quot; x{" "}
              {stickerData.depth}&quot;
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="border border-gray-100 rounded-md p-2 shadow-md"
        >
          <canvas ref={barcodeRef} />
        </div>
        <div className="text-[10px] text-gray-600">
          {stickerData.trackingID}
        </div>
      </div>

      {/* Items */}
      {/* <div className="border-t border-gray-200 pt-4">
        <div className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2">
          <span>📦</span> Item(s): Party Supplies Bundle
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm pl-1">
          {[
            "50 Balloons (Assorted Colors)",
            "10 Tablecloths (Plastic)",
            "20 Paper Plates (Disposable)",
            "30 Napkins (Printed)",
            "1 Piñata (Unicorn Thème)",
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-700">
              <span className="text-gray-400">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}
