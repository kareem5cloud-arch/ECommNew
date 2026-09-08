import CourierLedgerAddApi from "@/app/api/Controller/AdminController/Ledger/CourierLedger/AddLedger";
import GetCourierLedgerArrearApi from "@/app/api/Controller/AdminController/Ledger/CourierLedger/GetArrearLedger";
import GetCourierBagApi from "@/app/api/Controller/AdminController/Ledger/CourierLedger/GetBagForLedger";
import GetCourierLedgerRemainingAmountApi from "@/app/api/Controller/AdminController/Ledger/CourierLedger/GetRemaningLedger";
import { courierList } from "@/app/api/Types/AdminSetting/CourierService/CourierService";
import {
  bagList,
  responseCourierLedger,
  responseGetCourierBag,
} from "@/app/api/Types/AdminSetting/Ledger/Courier/Courier";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { useEffect, useState } from "react";

interface AddCourierLedgerProps {
  courierServiceList: courierList[];
  onShowMessage: (message: string, type: "success" | "error") => void;
}

export default function AddCourierLedger({
  courierServiceList,
  onShowMessage,
}: AddCourierLedgerProps) {
  const [CourierID, setCourierID] = useState("");
  const [CourierName, setCourierName] = useState("");
  const [Arrear, setArrear] = useState("0");
  const [OtherAmount, setOtherAmount] = useState("0");
  const [PostingDate, setPostingDate] = useState("");
  const [Amount, setAmount] = useState("");
  const [Notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [Status, setStatus] = useState("");
  const [BagNo, setBagNo] = useState("");
  const [BagList, setBagList] = useState<bagList[]>([]);

  const statusList = [
    { id: "1", value: "Customer" },
    { id: "2", value: "Courier" },
  ];

  const Standardget = async () => {
    if (!CourierID) return;
    const token = localStorage.getItem("adminToken");
    const formData = {
      courierID: CourierID,
    };
    const response = await GetCourierLedgerArrearApi(formData, String(token));
    if (response.status == 200) {
      const data = response.data as responseCourierLedger;
      setArrear(String(data.arrear));
    } else {
      setArrear("0");
    }
  };
  const RemaningAmountGet = async () => {
    if (!CourierID) return;
    const token = localStorage.getItem("adminToken");
    const formData = {
      courierID: CourierID,
    };
    const response = await GetCourierLedgerRemainingAmountApi(
      formData,
      String(token),
    );
    if (response.status == 200) {
      const data = response.data as responseCourierLedger;
      setOtherAmount(String(data.remaningOwed));
    } else {
      setOtherAmount("0");
    }
  };

  const AddLedger = async () => {
    try {
      setLoading(true);
      if (!CourierID || !PostingDate || !Amount || !Status)
        return alert("Please fill in all * required fields.");
      const token = localStorage.getItem("adminToken");
      const formData = {
        courierID: CourierID,
        status: Status,
        bagNo: Status === "Customer" ? BagNo : "-",
        postingDate: PostingDate,
        amount: Number(Amount),
        description: Notes,
      };
      const response = await CourierLedgerAddApi(formData, String(token));
      if (response.status == 200) {
        const data = response.data as responseCourierLedger;
        onShowMessage(response.data.message, "success");
      } else {
        onShowMessage(response.data.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const GetBag = async () => {
    if (!CourierID) return;
    const token = localStorage.getItem("adminToken");
    const formData = {
      courierID: CourierID,
    };
    const response = await GetCourierBagApi(formData, String(token));
    if (response.status == 200) {
      const data = response.data as responseGetCourierBag;
      setBagList(data.bagList);
    } else {
      setBagList([]);
    }
  };
  useEffect(() => {
    Standardget();
    GetBag();
    RemaningAmountGet();
  }, [CourierID]);

  useEffect(() => {
    const bag = BagList.find((item) => item.bagNo === BagNo);
    if (bag) {
      setAmount(String(bag.total));
    }
  }, [BagList, BagNo]);
  useEffect(() => {
    setAmount("0");
  }, [Status]);
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <DropDownList
            label="Courier "
            placeholder="Enter Courier"
            required={true}
            filedID={setCourierID}
            value={CourierName}
            onChange={setCourierName}
            options={courierServiceList.map((item) => ({
              label: item.serviceName,
              value: item.serviceName,
              id: item.courierID,
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
            type="date"
            required={true}
            placeholder="Enter Posting Date"
            SateChange={PostingDate}
            setSateChange={setPostingDate}
            disabled={false}
          />
          <DropDownList
            label="Status "
            placeholder="Enter Status"
            required={true}
            filedID={() => {}}
            value={Status}
            onChange={setStatus}
            options={statusList.map((item) => ({
              label: item.value,
              value: item.value,
              id: item.id,
            }))}
          />
          {Status === "Customer" && (
            <DropDownList
              label="Bag No "
              placeholder="Enter Bag No"
              required={true}
              filedID={() => {}}
              value={BagNo}
              onChange={setBagNo}
              options={BagList.map((item, index) => ({
                label: item.bagNo,
                value: item.bagNo,
                id: String(index),
              }))}
            />
          )}
          <InputFieldGeneric
            label={`Amount ${Status === "Courier" ? OtherAmount : ""} `}
            type="text"
            required={true}
            readonly={Status === "Customer" ? true : false}
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
          <div className="flex justify-end">
            <ActionButton
              text="Save"
              update={false}
              loading={loading}
              loadingtext="Saving..."
              onClick={() => AddLedger()}
              disabled={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
