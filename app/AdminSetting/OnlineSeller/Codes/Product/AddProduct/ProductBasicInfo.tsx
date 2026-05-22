import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import { Hash, Package } from "lucide-react";
import { useState } from "react";

export default function ProductBasicInfo() {
  const [ProductName, setProductName] = useState("");
  const [ShortCode, setShortCode] = useState("");
  const [Discount, setDiscount] = useState("");
  const [Weight, setWeight] = useState("");
  const [Depth, setDepth] = useState("");
  const [Width, setWidth] = useState("");
  const [Height, setHeight] = useState("");
  return (
    <>
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputFieldGeneric
              label="Product Name"
              type="text"
              required={true}
              placeholder="Enter Product Name"
              SateChange={ProductName}
              setSateChange={setProductName}
              disabled={false}
            />
            <InputFieldGeneric
              label="ShortCode"
              type="text"
              required={true}
              placeholder="Enter ShortCode"
              SateChange={ShortCode}
              setSateChange={setShortCode}
              disabled={false}
            />
            <InputFieldGeneric
              label="Discount"
              type="number"
              required={true}
              placeholder="Enter Discount"
              SateChange={Discount}
              setSateChange={setDiscount}
              disabled={false}
            />
            <InputFieldGeneric
              label="Weight"
              type="number"
              required={true}
              placeholder="Enter Weight"
              SateChange={Weight}
              setSateChange={setWeight}
              disabled={false}
            />
            <InputFieldGeneric
              label="Height"
              type="number"
              required={true}
              placeholder="Enter Height"
              SateChange={Height}
              setSateChange={setHeight}
              disabled={false}
            />
            <InputFieldGeneric
              label="Depth"
              type="number"
              required={true}
              placeholder="Enter Depth"
              SateChange={Depth}
              setSateChange={setDepth}
              disabled={false}
            />
            <InputFieldGeneric
              label="Width"
              type="number"
              required={true}
              placeholder="Enter Width"
              SateChange={Width}
              setSateChange={setWidth}
              disabled={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
