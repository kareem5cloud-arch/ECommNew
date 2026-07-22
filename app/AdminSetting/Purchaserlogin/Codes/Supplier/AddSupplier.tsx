import ActionButton from "@/app/ui/ActionButton/ActionButton";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { useState } from "react";

export default function AddSupplierForm() {
  const [SupplierName, setSupplierName] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [Address, setAddress] = useState("");
  const [OpeningBalance, setOpeningBalance] = useState("");
  const [Notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <InputFieldGeneric
            label="Supplier Name"
            type="text"
            required={true}
            placeholder="Enter Supplier Name"
            SateChange={SupplierName}
            setSateChange={setSupplierName}
            disabled={false}
          />
          <InputFieldGeneric
            label="Phone No"
            type="text"
            required={true}
            placeholder="Enter Phone No"
            SateChange={PhoneNo}
            setSateChange={setPhoneNo}
            disabled={false}
          />
          <InputFieldGeneric
            label="Address"
            type="text"
            required={false}
            placeholder="Enter Address"
            SateChange={Address}
            setSateChange={setAddress}
            disabled={false}
          />
          <InputFieldGeneric
            label="Opening Balance"
            type="text"
            required={true}
            placeholder="Enter Opening Balance"
            SateChange={OpeningBalance}
            setSateChange={setOpeningBalance}
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
          <div className="flex justify-end">
            <ActionButton
              text="Save"
              update={false}
              loading={loading}
              loadingtext="Saving..."
              onClick={() => {}}
              disabled={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
