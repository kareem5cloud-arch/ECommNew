// ProductBasicInfo.tsx
import GenericCheckbox from "@/app/ui/CheckBox/CheckBox";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import GenericRadio from "@/app/ui/RadioButton/RadioButton";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";

interface ProductBasicInfoProps {
  ProductName: string;
  setProductName: (value: string) => void;
  ShortCode: string;
  setShortCode: (value: string) => void;
  Discount: string;
  setDiscount: (value: string) => void;
  Weight: string;
  setWeight: (value: string) => void;
  Depth: string;
  setDepth: (value: string) => void;
  Width: string;
  setWidth: (value: string) => void;
  Height: string;
  setHeight: (value: string) => void;
  Threshold: string;
  setThreshold: (value: string) => void;
  FeaturedProduct: string;
  setFeaturedProduct: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  storeSale: string;
  setStoreSale: (value: string) => void;
  checked: boolean;
  setChecked: (value: boolean) => void;
}

export default function ProductBasicInfo({
  ProductName,
  setProductName,
  ShortCode,
  setShortCode,
  Discount,
  setDiscount,
  Weight,
  setWeight,
  Depth,
  setDepth,
  Width,
  setWidth,
  Height,
  setHeight,
  Threshold,
  setThreshold,
  FeaturedProduct,
  setFeaturedProduct,
  description,
  setDescription,
  storeSale,
  setStoreSale,
  checked,
  setChecked,
}: ProductBasicInfoProps) {
  return (
    <>
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div>
            <label className="block mb-2">Store Sale</label>

            <div className="flex gap-5">
              <GenericRadio
                label="Both"
                name="storeSale"
                value="Both"
                checked={storeSale === "Both"}
                onChange={() => setStoreSale("Both")}
              />

              <GenericRadio
                label="Online Store"
                name="storeSale"
                value="OnlineStore"
                checked={storeSale === "OnlineStore"}
                onChange={() => setStoreSale("OnlineStore")}
              />
              <GenericRadio
                label="Offline Store"
                name="storeSale"
                value="OfflineStore"
                checked={storeSale === "OfflineStore"}
                onChange={() => setStoreSale("OfflineStore")}
              />
            </div>
          </div>
          <div className=" mt-2">
            <label className="block mb-2">Featured Product</label>

            <div className="flex gap-5">
              <GenericRadio
                label="Yes"
                name="Featured"
                value="Yes"
                checked={FeaturedProduct === "Yes"}
                onChange={() => setFeaturedProduct("Yes")}
              />

              <GenericRadio
                label="No"
                name="Featured"
                value="No"
                checked={FeaturedProduct === "No"}
                onChange={() => setFeaturedProduct("No")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              label="Threshold"
              type="number"
              required={true}
              placeholder="Enter Threshold"
              SateChange={Threshold}
              setSateChange={setThreshold}
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

          <TextAreaFieldGeneric
            label="Description"
            required={false}
            placeholder="Enter Description"
            SateChange={description}
            setSateChange={setDescription}
            disabled={false}
          />
          <GenericCheckbox
            label="Show Stock"
            checked={checked}
            onChange={setChecked}
          />
        </div>
      </div>
    </>
  );
}
