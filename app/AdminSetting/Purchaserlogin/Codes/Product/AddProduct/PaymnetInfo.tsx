// PaymnetInfo.tsx
import SuppliergetApi from "@/app/api/Controller/PurchaserLogin/Codes/Supplier/SupplierGet";
import {
  ResponseGetSupplpierlist,
  SupplierListReponse,
} from "@/app/api/Types/PurchaserLogin/Supplier/supplier";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import GenericRadio from "@/app/ui/RadioButton/RadioButton";
import { useEffect, useState } from "react";

interface PaymnetInfoProps {
  // Purchase states
  PurcahseAdd: string;
  setPurcahseAdd: (value: string) => void;

  // Supplier states
  SupplierID: string;
  setSupplierID: (value: string) => void;
  SupplierName: string;
  setSupplierName: (value: string) => void;
  supplierList: SupplierListReponse[];
  setSupplierList: (value: SupplierListReponse[]) => void;

  // Payment states
  TotalBill: string;
  setTotalBill: (value: string) => void;
  AmountPaid: string;
  setAmountPaid: (value: string) => void;
  Adjustment: string;
  setAdjustment: (value: string) => void;

  // Calculated total from variants (passed from parent)
  calculatedTotalBill: number;
}

export default function PaymnetInfo({
  PurcahseAdd,
  setPurcahseAdd,
  SupplierID,
  setSupplierID,
  SupplierName,
  setSupplierName,
  supplierList,
  setSupplierList,
  TotalBill,
  setTotalBill,
  AmountPaid,
  setAmountPaid,
  Adjustment,
  setAdjustment,
  calculatedTotalBill,
}: PaymnetInfoProps) {
  const GetSupplier = async () => {
    const token = localStorage.getItem("PurchaserLoginToken");
    const response = await SuppliergetApi(String(token));
    if (response.status === 200) {
      const data = response.data as ResponseGetSupplpierlist;
      setSupplierList(data.supplierList);
    } else {
      setSupplierList([]);
    }
  };

  useEffect(() => {
    GetSupplier();
  }, []);

  // Update TotalBill whenever calculatedTotalBill changes
  useEffect(() => {
    if (calculatedTotalBill > 0) {
      setTotalBill(calculatedTotalBill.toString());
    }
  }, [calculatedTotalBill, setTotalBill]);

  useEffect(() => {
    if (PurcahseAdd === "Yes") {
      setAmountPaid(TotalBill);
      setSupplierID("");
      setSupplierName("");
    } else {
      const data = supplierList.find((item) => (item.supplierName = "SYS-Gen"));
      setSupplierID(data?.supplierID || "");
      setAmountPaid("");
    }
  }, [PurcahseAdd]);

  return (
    <>
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div>
            <label className="block mb-2">Purchase</label>

            <div className="flex gap-5">
              <GenericRadio
                label="Yes"
                name="Purchase"
                value="Yes"
                checked={PurcahseAdd === "Yes"}
                onChange={setPurcahseAdd}
              />

              <GenericRadio
                label="No"
                name="Purchase"
                value="No"
                checked={PurcahseAdd === "No"}
                onChange={setPurcahseAdd}
              />
            </div>
          </div>

          {PurcahseAdd === "Yes" && (
            <div className="mb-2">
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
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputFieldGeneric
              label="TotalBill"
              type="Number"
              required={true}
              placeholder="Enter TotalBill"
              SateChange={TotalBill}
              setSateChange={setTotalBill}
              disabled={calculatedTotalBill > 0} // Disable if auto-calculated
            />
            <InputFieldGeneric
              label="AmountPaid"
              type="text"
              required={true}
              placeholder="Enter Amount Paid"
              SateChange={AmountPaid}
              setSateChange={setAmountPaid}
              disabled={false}
            />
            <InputFieldGeneric
              label="Adjustment"
              type="number"
              required={true}
              placeholder="Enter Adjustment"
              SateChange={Adjustment}
              setSateChange={setAdjustment}
              disabled={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
