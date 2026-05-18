import CustomerReport from "@/api/lib/PosIntegration/Report/CustomerReport/CustomerReport";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";

interface responseData {
  message: string;
  ledgerList: ledgerList[];
}
interface ledgerList {
  balance: number;
  customerID: string;
  customerName: string;
  totalCredit: number;
  totalDebit: number;
}

export default function CustoemrReport() {
  const [listData, setListData] = useState<ledgerList[]>([]);

  const fetchData = async () => {
    const token = localStorage.getItem("tokenPosSale");
    const response = await CustomerReport(String(token));
    if (response.status === 200) {
      const data = response.data as responseData;
      setListData(data.ledgerList);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();

    // Title (centered)
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Customer Report", pageWidth / 2, 15, { align: "center" });

    // Current Date
    const currentDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${currentDate}`, pageWidth / 7, 28, { align: "center" });

    // Table columns
    const tableColumn = [
      "Customer Name",
      "Total Credit",
      "Total Debit",
      "Balance",
    ];

    // Table rows
    const tableRows = listData.map((item) => [
      item.customerName,
      item.totalCredit,
      item.totalDebit,
      item.balance,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: {
        fontSize: 10,
        halign: "right",
      },
      headStyles: {
        fillColor: [22, 160, 133],
        halign: "center",
      },
      columnStyles: {
        0: { halign: "left" }, // Customer Name left aligned
      },
    });

    doc.save("customer-report.pdf");
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="w-full relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Customer Report
      </h2>

      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-700">
                  Customer Name
                </th>
                <th className="px-4 py-2 text-right text-gray-700">
                  Total Credit
                </th>
                <th className="px-4 py-2 text-right text-gray-700">
                  Total Debit
                </th>
                <th className="px-4 py-2 text-right text-gray-700">Balance</th>
              </tr>
            </thead>

            <tbody>
              {listData.length > 0 ? (
                listData.map((item) => (
                  <tr
                    key={item.customerID}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2 text-gray-800">
                      {item.customerName}
                    </td>
                    <td
                      className={`px-4 py-2 text-right  ${
                        item.totalCredit < 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {item.totalCredit}
                    </td>
                    <td
                      className={`px-4 py-2 text-right  ${
                        item.totalDebit < 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {item.totalDebit}
                    </td>
                    <td
                      className={`px-4 py-2 text-right  ${
                        item.balance < 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {item.balance}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No customer records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mb-4 mt-4">
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
