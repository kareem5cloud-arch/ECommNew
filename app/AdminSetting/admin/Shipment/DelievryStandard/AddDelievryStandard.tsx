"use client";
import DelievryStandardAddApi from "@/app/api/Controller/AdminController/Shipment/DelievryStandard/AddStandard";
import DelievryStandardModifyApi from "@/app/api/Controller/AdminController/Shipment/DelievryStandard/ModifyStandard";
import { DelievryDataStandard } from "@/app/api/Types/Shipment/DelievryStandard";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  update: boolean;
  initalData?: DelievryDataStandard;
  onShowMessage: (message: string, type: "success" | "error") => void;
}

export default function AddDelievryStandard({
  update,
  onShowMessage,
  initalData,
}: propsForAddRegion) {
  const [standardName, setStandardName] = useState("");
  const [numberOfDays, setNumberOfDays] = useState("");
  const [description, setDescription] = useState("");
  const [ID, setID] = useState("");
  const [loading, setLoading] = useState(false);

  const StandardAdd = async () => {
    try {
      setLoading(true);
      if (!standardName) return alert("Please Fill in Filed with *");
      else {
        const formData = {
          standardName: standardName,
          numberOfDays: numberOfDays,
          description: description,
        };
        const token = localStorage.getItem("adminToken");
        const response = await DelievryStandardAddApi(formData, String(token));
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
  const StandardModify = async () => {
    try {
      setLoading(true);
      if (!standardName) return alert("Please Fill in Filed with *");
      else {
        const formData = {
          deliveryTypeID: ID,
          standardName: standardName,
          numberOfDays: numberOfDays,
          description: description,
        };
        const token = localStorage.getItem("adminToken");
        const response = await DelievryStandardModifyApi(
          formData,
          String(token),
        );
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
      setStandardName(initalData.typeName);
      setDescription(initalData.description);
      setNumberOfDays(initalData.numberofDays);
      setID(initalData.deliveryTypeID);
    } else {
      setStandardName("");
      setDescription("");
      setNumberOfDays("");
      setID("");
    }
  }, [initalData, update]);

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <InputFieldGeneric
            label="Standard Name"
            type="text"
            required={true}
            placeholder="Enter Standard Name"
            SateChange={standardName}
            setSateChange={setStandardName}
            disabled={false}
          />
          <InputFieldGeneric
            label="Number Of Days "
            type="text"
            required={false}
            placeholder="Enter Number Of Days "
            SateChange={numberOfDays}
            setSateChange={setNumberOfDays}
            disabled={false}
          />
          <TextAreaFieldGeneric
            label="Description"
            required={false}
            placeholder="Enter Description"
            SateChange={description}
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
                onClick={() => StandardModify()}
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
                onClick={() => StandardAdd()}
                disabled={false}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
