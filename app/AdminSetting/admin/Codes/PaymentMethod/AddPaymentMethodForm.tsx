import PaymentMethodAdd from "@/app/api/Controller/AdminController/PaymentMethod/AddPaymentMethod";
import PaymentMethodModify from "@/app/api/Controller/AdminController/PaymentMethod/ModifyPaymentMoethod";
import { PaymentMethod } from "@/app/api/Types/AdminSetting/PaymentMethod/paymentMethod";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import GenericRadio from "@/app/ui/RadioButton/RadioButton";
import { title } from "process";
import { useEffect, useState } from "react";
interface propsForAddRegion {
  update: boolean;
  initalData?: PaymentMethod;
  onShowMessage: (message: string, type: "success" | "error") => void;
}
export default function AddPaymentMethodForm({
  update,
  onShowMessage,
  initalData,
}: propsForAddRegion) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [Title, setTitle] = useState("");
  const [AccountNumber, setAccountNumber] = useState("");
  const [ShowCustomer, setShowCustomer] = useState("Both");
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");

  const PaymentAdd = async () => {
    try {
      setLoading(true);
      if (!paymentMethod || !AccountNumber)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          bankName: paymentMethod,
          accountTitle: Title,
          accountNumber: AccountNumber,
          showCustomer: ShowCustomer,
        };
        // console.log(formData);
        const token = localStorage.getItem("adminToken");
        const response = await PaymentMethodAdd(formData, String(token));
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

  const PaymentModify = async () => {
    try {
      setLoading(true);
      if (!paymentMethod || !AccountNumber)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          paymentID: ID,
          bankName: paymentMethod,
          accountTitle: Title,
          accountNumber: AccountNumber,
          showCustomer: ShowCustomer,
        };
        // console.log(formData);
        const token = localStorage.getItem("adminToken");
        const response = await PaymentMethodModify(formData, String(token));
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
    if (update && initalData) {
      setAccountNumber(initalData.accountNumber);
      setTitle(initalData.accountTitle);
      setPaymentMethod(initalData.bankName);
      setID(initalData.paymentID);
      setShowCustomer(initalData.showCustomer);
    } else {
      setAccountNumber("");
      setTitle("");
      setPaymentMethod("");
      setID("");
      setShowCustomer("");
    }
  }, [initalData, update]);

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <div>
            <label className="block mb-2">Show Payment</label>

            <div className="flex gap-5">
              <GenericRadio
                label="Both"
                name="Purchase"
                value="Both"
                checked={ShowCustomer === "Both"}
                onChange={setShowCustomer}
              />

              <GenericRadio
                label="Seller"
                name="Purchase"
                value="Seller"
                checked={ShowCustomer === "Seller"}
                onChange={setShowCustomer}
              />
              <GenericRadio
                label="Customer"
                name="Purchase"
                value="Customer"
                checked={ShowCustomer === "Customer"}
                onChange={setShowCustomer}
              />
            </div>
          </div>
          <InputFieldGeneric
            label="Payment Method"
            type="text"
            required={false}
            placeholder="Enter Payment Method"
            SateChange={paymentMethod}
            setSateChange={setPaymentMethod}
            disabled={false}
          />
          <InputFieldGeneric
            label="Title"
            type="text"
            required={false}
            placeholder="Enter Title"
            SateChange={Title}
            setSateChange={setTitle}
            disabled={false}
          />
          <InputFieldGeneric
            label="Account Number"
            type="text"
            required={false}
            placeholder="Enter Account Number"
            SateChange={AccountNumber}
            setSateChange={setAccountNumber}
            disabled={false}
          />

          {update ? (
            <div className="flex justify-end">
              <ActionButton
                text="Update"
                update={false}
                loading={loading}
                loadingtext="Updateing..."
                onClick={() => PaymentModify()}
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
                onClick={() => PaymentAdd()}
                disabled={false}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
