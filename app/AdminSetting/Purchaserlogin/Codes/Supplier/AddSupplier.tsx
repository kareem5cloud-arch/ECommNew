import SupplierAppApi from "@/app/api/Controller/PurchaserLogin/Codes/Supplier/SupplierAdd";
import SupplierModifyApi from "@/app/api/Controller/PurchaserLogin/Codes/Supplier/SupplierModify";
import { SupplierListReponse } from "@/app/api/Types/PurchaserLogin/Supplier/supplier";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  update: boolean;
  onShowMessage: (message: string, type: "success" | "error") => void;
  initalData?: SupplierListReponse;
  // storeList: storeList[];
}
export default function AddSupplierForm({
  update,
  onShowMessage,
  initalData,
}: propsForAddRegion) {
  const [SupplierName, setSupplierName] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [Address, setAddress] = useState("");
  const [OpeningBalance, setOpeningBalance] = useState("");
  const [Notes, setNotes] = useState("");
  const [Email, setEmail] = useState("");
  const [ID, setID] = useState("");
  const [loading, setLoading] = useState(false);

  const SupplierAdd = async () => {
    try {
      setLoading(true);
      if (!SupplierName || !PhoneNo)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          supplierName: SupplierName,
          address: Address,
          phoneNo: PhoneNo,
          email: Email,
          openingBalance: Number(OpeningBalance) || 0,
          description: "",
        };
        const token = localStorage.getItem("PurchaserLoginToken");
        const response = await SupplierAppApi(formData, String(token));
        if (response.status == 200) {
          onShowMessage(response.data.message, "success");
        } else {
          onShowMessage(response.data.message, "error");
        }
      }
    } finally {
      setLoading(false);
    }
  };
  const SupplierModify = async () => {
    try {
      setLoading(true);
      if (!SupplierName || !PhoneNo)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          supplierID: ID,
          supplierName: SupplierName,
          address: Address,
          phoneNo: PhoneNo,
          email: Email,
          openingBalance: Number(OpeningBalance) || 0,
          description: "",
        };
        const token = localStorage.getItem("PurchaserLoginToken");
        const response = await SupplierModifyApi(formData, String(token));
        if (response.status == 200) {
          onShowMessage(response.data.message, "success");
        } else {
          onShowMessage(response.data.message, "error");
        }
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (update) {
      if (initalData) {
        setID(initalData.supplierID);
        setSupplierName(initalData.supplierName);
        setPhoneNo(initalData.phoneNo);
        setAddress(initalData.address);
        setEmail(initalData.email);
        setOpeningBalance(String(initalData.openingBalance));
        setNotes(initalData.description);
      }
    } else {
      setID("");
      setSupplierName("");
      setPhoneNo("");
      setAddress("");
      setEmail("");
      setOpeningBalance("");
      setNotes("");
    }
  }, [initalData, update]);
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
            label="Email"
            type="email"
            required={false}
            placeholder="Enter Email"
            SateChange={Email}
            setSateChange={setEmail}
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
          {update ? (
            <div className="flex justify-end">
              <ActionButton
                text="Update"
                update={false}
                loading={loading}
                loadingtext="Updateing..."
                onClick={() => SupplierModify()}
                disabled={false}
              />
            </div>
          ) : (
            <div className="flex justify-end">
              <ActionButton
                text="Save"
                update={false}
                loading={loading}
                loadingtext="Saving..."
                onClick={() => SupplierAdd()}
                disabled={false}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
