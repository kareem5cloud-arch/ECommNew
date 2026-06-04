import CourierServiceAdd from "@/app/api/Controller/AdminController/CourierService/AddCourier";
import CourierServiceModify from "@/app/api/Controller/AdminController/CourierService/ModifyCourier";
import { courierList } from "@/app/api/Types/AdminSetting/CourierService/CourierService";
import { DelievryDataStandard } from "@/app/api/Types/Shipment/DelievryStandard";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { useEffect, useState } from "react";

interface countryList {
  countryID: string;
  countryName: string;
}
interface propsForAddRegion {
  update: boolean;
  standardListGet: DelievryDataStandard[];
  initalData?: courierList;
  onShowMessage: (message: string, type: "success" | "error") => void;
}
export default function AddCourierServiceForm({
  update,
  standardListGet,
  onShowMessage,
  initalData,
}: propsForAddRegion) {
  const [ServiceName, setServiceName] = useState("");
  const [PhionNo, setPhionNo] = useState("");
  const [Email, setEmail] = useState("");
  const [Description, setDescription] = useState("");
  const [OpeningBalance, setOpeningBalance] = useState("");
  const [optionList, setOptionList] = useState<countryList[]>([]);
  const [standardName, setStandardName] = useState("");
  const [standardID, setStandardID] = useState("");
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");

  const CourierAdd = async () => {
    try {
      setLoading(true);
      if (!ServiceName || !PhionNo || !standardID)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          serviceName: ServiceName,
          phoneNo: PhionNo,
          deliveryTypeID: standardID,
          email: Email,
          description: Description,
        };
        // console.log(formData);
        const token = localStorage.getItem("adminToken");
        const response = await CourierServiceAdd(formData, String(token));
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
  const CourierModify = async () => {
    try {
      setLoading(true);
      if (!ServiceName || !PhionNo || !standardID || !ID)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          courierID: ID,
          serviceName: ServiceName,
          phoneNo: PhionNo,
          deliveryTypeID: standardID,
          email: Email,
          description: Description,
        };
        const token = localStorage.getItem("adminToken");
        const response = await CourierServiceModify(formData, String(token));
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
      setServiceName(initalData.serviceName);
      setDescription(initalData.description);
      setPhionNo(initalData.phoneNo);
      setID(initalData.courierID);
      setStandardID(initalData.deliveryTypeID);
      setStandardName(initalData.typeName);
      setEmail(initalData.email);
      setOpeningBalance("");
    } else {
      setServiceName("");
      setDescription("");
      setPhionNo("");
      setID("");
      setStandardID("");
      setStandardName("");
      setEmail("");
      setOpeningBalance("");
    }
  }, [initalData, update]);

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <InputFieldGeneric
            label="Service Name"
            type="text"
            required={true}
            placeholder="Enter Service Name"
            SateChange={ServiceName}
            setSateChange={setServiceName}
            disabled={false}
          />
          <InputFieldGeneric
            label="Email"
            type="text"
            required={false}
            placeholder="Enter Email"
            SateChange={Email}
            setSateChange={setEmail}
            disabled={false}
          />
          <InputFieldGeneric
            label="Phone No"
            type="text"
            required={true}
            placeholder="Enter Phone No"
            SateChange={PhionNo}
            setSateChange={setPhionNo}
            disabled={false}
          />
          {/* <InputFieldGeneric
            label="Opening Balance"
            type="number"
            required={false}
            placeholder="Enter Opening Balance"
            SateChange={OpeningBalance}
            setSateChange={setOpeningBalance}
            disabled={false}
          /> */}
          <DropDownList
            label="Delivery Standard "
            placeholder="Enter Delivery Standard"
            required={true}
            filedID={setStandardID}
            value={standardName}
            onChange={setStandardName}
            options={standardListGet.map((item) => ({
              label: item.typeName,
              value: item.typeName,
              id: item.deliveryTypeID,
            }))}
          />
          <TextAreaFieldGeneric
            label="Description"
            required={false}
            placeholder="Enter Description"
            SateChange={Description}
            setSateChange={setDescription}
            disabled={false}
          />

          {update ? (
            <div className="flex justify-end">
              <ActionButton
                text="Update"
                update={false}
                loading={loading}
                loadingtext="Updateing..."
                onClick={() => CourierModify()}
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
                onClick={() => CourierAdd()}
                disabled={false}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
