import { SupplierListReponse } from "@/app/api/Types/PurchaserLogin/Supplier/supplier";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { useState } from "react";

interface AddSupplierLedger {
  supplierList: SupplierListReponse[];
}

export default function AddSupplierLedger({ supplierList }: AddSupplierLedger) {
  const [SupplierID, setSupplierID] = useState("");
  const [SupplierName, setSupplierName] = useState("");
  const [Arrear, setArrear] = useState("0");
  const [PostingDate, setPostingDate] = useState("");
  const [Amount, setAmount] = useState("");
  const [Notes, setNotes] = useState("");
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
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
          <InputFieldGeneric
            label="Arrear/Balance"
            type="text"
            required={false}
            placeholder="Enter Arrear/Balance"
            SateChange={Arrear}
            readonly
            setSateChange={setArrear}
            disabled={false}
          />
          <InputFieldGeneric
            label="Posting Date"
            type="text"
            required={true}
            placeholder="Enter Posting Date"
            SateChange={PostingDate}
            setSateChange={setPostingDate}
            disabled={false}
          />
          <InputFieldGeneric
            label="Amount"
            type="text"
            required={true}
            placeholder="Enter Amount"
            SateChange={Amount}
            setSateChange={setAmount}
            disabled={false}
          />
          <TextAreaFieldGeneric
            label="Description"
            required={false}
            placeholder="Enter Description"
            SateChange={Notes}
            setSateChange={setNotes}
            disabled={false}
          />
        </div>
      </div>
    </>
  );
}
