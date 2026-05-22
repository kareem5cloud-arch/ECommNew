"use client";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { useState } from "react";

interface propsForAddRegion {
  update: boolean;
}
export default function AddDelievryStandard({ update }: propsForAddRegion) {
  const [standardName, setStandardName] = useState("");
  const [numberOfDays, setNumberOfDays] = useState("");
  const [description, setDescription] = useState("");
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <InputFieldGeneric
            label="Standard Name"
            type="text"
            required={false}
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
          <div className="flex justify-end">
            <ActionButton
              text="Save"
              update={update}
              loading={false}
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
