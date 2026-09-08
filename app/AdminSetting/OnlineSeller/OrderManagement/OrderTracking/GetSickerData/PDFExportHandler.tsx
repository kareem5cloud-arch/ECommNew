"use client";
import { stickerData } from "@/app/api/Types/WareHouse/OrderConfimration";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useRef } from "react";

interface PDFExportHandlersProps {
  getData: stickerData | undefined;
  thermalRef: React.RefObject<HTMLDivElement | null>;
  a5Ref: React.RefObject<HTMLDivElement | null>;
  //   a5Ref: React.RefObject<HTMLDivElement | null>;
  returnType: string;
  onExportComplete?: () => void;
}

export default function PDFExportHandlers({
  getData,
  thermalRef,
  a5Ref,
  //   a5Ref,
  returnType,
  onExportComplete,
}: PDFExportHandlersProps) {
  // Use a ref to track if export has been triggered
  const hasExported = useRef(false);

  useEffect(() => {
    // Prevent double export in development
    if (hasExported.current) return;
    hasExported.current = true;

    const exportPDF = async () => {
      try {
        // if (returnType === "Thermal Print" && thermalRef.current) {
        //   await handleThermalExport();
        // } else if (returnType === "A4 Print" && a4Ref.current) {
        //   await handleA4Export();
        //}
        if (returnType === "A5 Print" && a5Ref.current) {
          await handleA5Export();
        }
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        onExportComplete?.();
      }
    };

    exportPDF();
  }, [a5Ref]); // Empty dependency array = run once when mounted

  //   const handleThermalExport = async () => {
  //     if (!thermalRef.current) return;

  //     const canvas = await html2canvas(thermalRef.current, {
  //       scale: 1.2,
  //       backgroundColor: "#ffffff",
  //       onclone: (clonedDoc) => {
  //         const elements = clonedDoc.querySelectorAll("*");
  //         elements.forEach((el: any) => {
  //           const style = window.getComputedStyle(el);
  //           if (style.color.includes("oklch") || style.color.includes("lab")) {
  //             el.style.color = "#000000";
  //           }
  //           if (
  //             style.backgroundColor.includes("oklch") ||
  //             style.backgroundColor.includes("lab")
  //           ) {
  //             el.style.backgroundColor = "#ffffff";
  //           }
  //           if (
  //             style.borderColor.includes("oklch") ||
  //             style.borderColor.includes("lab")
  //           ) {
  //             el.style.borderColor = "#cccccc";
  //           }
  //         });
  //       },
  //     });

  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF({
  //       orientation: "portrait",
  //       unit: "mm",
  //       format: [80, 200],
  //     });

  //     const imgWidth = 80;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  //     pdf.save(`Receipt_${getData?.invoiceNo || "receipt"}.pdf`);
  //   };

  //   const handleA4Export = async () => {
  //     if (!a5Ref.current) return;

  //     const el = a5Ref.current;
  //     const prevTransform = el.style.transform;

  //     el.style.transform = "scale(1)";
  //     el.style.transformOrigin = "top left";

  //     // ✅ 1. FIX COLORS BEFORE html2canvas
  //     const elements = el.querySelectorAll("*");

  //     elements.forEach((node: any) => {
  //       const style = window.getComputedStyle(node);

  //       if (style.color.includes("oklch") || style.color.includes("lab")) {
  //         node.style.color = "#111111";
  //       }

  //       if (
  //         style.backgroundColor.includes("oklch") ||
  //         style.backgroundColor.includes("lab")
  //       ) {
  //         node.style.backgroundColor = "#ffffff";
  //       }

  //       if (
  //         style.borderColor.includes("oklch") ||
  //         style.borderColor.includes("lab")
  //       ) {
  //         node.style.borderColor = "#dddddd";
  //       }
  //     });

  //     // ✅ 2. NOW run html2canvas
  //     const canvas = await html2canvas(el, {
  //       scale: 2,
  //       backgroundColor: "#ffffff",
  //       useCORS: true,
  //     });

  //     el.style.transform = prevTransform;

  //     // ✅ 3. compress
  //     const imgData = canvas.toDataURL("image/jpeg", 0.85);

  //     const pdf = new jsPDF({
  //       orientation: "portrait",
  //       unit: "mm",
  //       format: "a4",
  //     });

  //     const pageWidth = pdf.internal.pageSize.getWidth();
  //     const imgHeight = (canvas.height * pageWidth) / canvas.width;

  //     pdf.addImage(
  //       imgData,
  //       "JPEG",
  //       0,
  //       0,
  //       pageWidth,
  //       imgHeight,
  //       undefined,
  //       "FAST",
  //     );

  //     pdf.save(`Receipt_A4_${getData?.invoiceNo || "receipt"}.pdf`);
  //   };

  const handleA5Export = async () => {
    if (!a5Ref.current) return;

    const el = a5Ref.current;
    const prevTransform = el.style.transform;
    el.style.transform = "scale(1)";
    el.style.transformOrigin = "top left";

    const canvas = await html2canvas(el, {
      scale: 3,
      backgroundColor: "#ffffff",
      useCORS: true,
      onclone: (clonedDoc) => {
        const elements = clonedDoc.querySelectorAll("*");
        elements.forEach((el: any) => {
          const style = window.getComputedStyle(el);
          if (style.color.includes("oklch") || style.color.includes("lab")) {
            el.style.color = "#000000";
          }
          if (
            style.backgroundColor.includes("oklch") ||
            style.backgroundColor.includes("lab")
          ) {
            el.style.backgroundColor = "#ffffff";
          }
          if (
            style.borderColor.includes("oklch") ||
            style.borderColor.includes("lab")
          ) {
            el.style.borderColor = "#cccccc";
          }
        });
      },
    });

    el.style.transform = prevTransform;

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a5",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`Receipt_A5_${getData?.orderNo || "receipt"}.pdf`);
  };

  // Return null as this component only handles logic
  return null;
}
