import { SupplierListReponse } from "@/app/api/Types/PurchaserLogin/Supplier/supplier";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import { useState } from "react";

interface AddSupplierLedger {
  supplierList: SupplierListReponse[];
}
export default function GetSupplierLedger({ supplierList }: AddSupplierLedger) {
  const [SupplierID, setSupplierID] = useState("");
  const [SupplierName, setSupplierName] = useState("");
  const [DateFrom, setDateFrom] = useState("");
  const [DateTo, setDateTo] = useState("");

  return (
    <>
      <div className="flex gap-2">
        <div className="w-full mt-1">
          <DropDownList
            label="Supplier "
            placeholder="Enter Supplier"
            required={true}
            filedID={setSupplierID}
            value={SupplierName}
            onChange={setSupplierName}
            options={supplierList.map((item) => ({
              label: item.supplierName,
              value: item.supplierName,
              id: item.supplierID,
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
                Posting Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Debit Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credit Amount
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
          <tbody className="bg-white divide-y divide-gray-200"></tbody>
        </table>
      </div>
    </>
  );
}
