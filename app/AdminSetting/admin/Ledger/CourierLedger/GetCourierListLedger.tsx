import GetCourierLedgerApi from "@/app/api/Controller/AdminController/Ledger/CourierLedger/GetLegder";
import { courierList } from "@/app/api/Types/AdminSetting/CourierService/CourierService";
import {
  courierLedgerList,
  responseGetCourierLedger,
} from "@/app/api/Types/AdminSetting/Ledger/Courier/Courier";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { useEffect, useState } from "react";

interface AddSupplierLedger {
  courierServiceList: courierList[];
}
export default function GetCourierListLedger({
  courierServiceList,
}: AddSupplierLedger) {
  const [SupplierID, setSupplierID] = useState("");
  const [SupplierName, setSupplierName] = useState("");
  const [DateFrom, setDateFrom] = useState("");
  const [DateTo, setDateTo] = useState("");
  const [isloading, setisLoading] = useState(false);
  const [CourierLedgerList, setCourierLedgerList] = useState<
    courierLedgerList[]
  >([]);

  const Standardget = async () => {
    try {
      if (!SupplierID || !DateTo || !DateFrom) return;
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        courierID: SupplierID,
        dateTo: DateTo,
        dateFrom: DateFrom,
      };
      const response = await GetCourierLedgerApi(formData, String(token));
      if (response.status == 200) {
        const data = response.data as responseGetCourierLedger;
        setCourierLedgerList(data.courierLedgerList);
      } else {
        setCourierLedgerList([]);
      }
    } finally {
      setisLoading(false);
    }
  };
  useEffect(() => {
    if (SupplierID || DateTo || DateFrom) {
      Standardget();
    }
  }, [SupplierID, DateTo, DateFrom]);
  return (
    <>
      <div className="flex gap-2">
        <div className="w-full mt-1">
          <DropDownList
            label="Courier "
            placeholder="Enter Courier"
            required={true}
            filedID={setSupplierID}
            value={SupplierName}
            onChange={setSupplierName}
            options={courierServiceList.map((item) => ({
              label: item.serviceName,
              value: item.serviceName,
              id: item.courierID,
            }))}
          />
        </div>
        <div className="w-full">
          <InputFieldGeneric
            label="Date From"
            type="date"
            required={true}
            placeholder="Enter Date From"
            SateChange={DateFrom}
            setSateChange={setDateFrom}
            disabled={false}
          />
        </div>
        <div className="w-full">
          <InputFieldGeneric
            label="Date To"
            type="date"
            required={true}
            placeholder="Enter Date To"
            SateChange={DateTo}
            setSateChange={setDateTo}
            disabled={false}
          />
        </div>
      </div>
      <div className="w-full mt-5 overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full bg-white">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bag No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posting Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Debit Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credit Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shipping Charges
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remarks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {isloading ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center">
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                </td>
              </tr>
            ) : CourierLedgerList.length === 0 ? (
              <tr className="text-lg font-semibold text-gray-500">
                <td colSpan={8} className="px-6 py-10 text-center">
                  No Record Found
                </td>
              </tr>
            ) : (
              CourierLedgerList.map((item, index) => (
                <tr
                  key={item.courierledgerID}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.bagNo}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.postingDate
                      ? new Date(item.postingDate).toDateString()
                      : "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.amountPaid ?? "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.totalBill ?? "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.shippingCharges ?? "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.status ?? "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">{"-"}</td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    <button
                      type="button"
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                      onClick={() => {
                        // Add your action here
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
