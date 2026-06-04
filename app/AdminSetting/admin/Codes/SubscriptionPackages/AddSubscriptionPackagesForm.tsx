import PackagesAdd from "@/app/api/Controller/AdminController/Packages/AddPackages";
import PackagesModify from "@/app/api/Controller/AdminController/Packages/ModifyPackages";
import { SubscriptionList } from "@/app/api/Types/AdminSetting/Packages/Packages";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import GenericCheckbox from "@/app/ui/CheckBox/CheckBox";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  update: boolean;
  initalData?: SubscriptionList;
  onShowMessage: (message: string, type: "success" | "error") => void;
}
export default function AddSubscriptionPackagesForm({
  update,
  initalData,
  onShowMessage,
}: propsForAddRegion) {
  const [PackageName, setPackageName] = useState("");
  const [MaxProduct, setMaxProduct] = useState("");
  const [MaxFeatured, setMaxFeatured] = useState("");
  const [MaxStore, setMaxStore] = useState("");
  const [Duration, setDuration] = useState("");
  const [Price, setPrice] = useState("");
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");

  const SubScriptionAdd = async () => {
    try {
      setLoading(true);
      if (!PackageName || !MaxProduct || !MaxFeatured || !Duration || !Price)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          name: PackageName,
          maxProduct: Number(MaxProduct),
          maxStore: Number(MaxStore),
          maxFeaturedProduct: Number(MaxFeatured),
          price: Number(Price),
          duration: Number(Duration),
          posIntegration: checked,
        };
        // console.log(formData);
        const token = localStorage.getItem("adminToken");
        const response = await PackagesAdd(formData, String(token));
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
  const SubScriptionModify = async () => {
    try {
      setLoading(true);
      if (
        !PackageName ||
        !MaxProduct ||
        !MaxFeatured ||
        !Duration ||
        !Price ||
        !ID
      )
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          subID: ID,
          name: PackageName,
          maxProduct: Number(MaxProduct),
          maxStore: Number(MaxStore),
          maxFeaturedProduct: Number(MaxFeatured),
          price: Number(Price),
          duration: Number(Duration),
          posIntegration: checked,
        };
        // console.log(formData);
        const token = localStorage.getItem("adminToken");
        const response = await PackagesModify(formData, String(token));
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
      setPackageName(initalData.name);
      setPrice(String(initalData.price));
      setChecked(initalData.posIntegration);
      setDuration(String(initalData.duration));
      setMaxProduct(String(initalData.maxproduct));
      setMaxFeatured(String(initalData.maxFetauredProduct));
      setMaxStore(String(initalData.maxStore));
      setID(String(initalData.subID));
    } else {
      setPackageName("");
      setMaxProduct("");
      setPrice("");
      setChecked(false);
      setDuration("");
      setMaxFeatured("");
      setMaxStore("");
      setID("");
    }
  }, [initalData, update]);
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <InputFieldGeneric
            label="Package Name"
            type="text"
            required={true}
            placeholder="Enter Package Name"
            SateChange={PackageName}
            setSateChange={setPackageName}
            disabled={false}
          />
          <InputFieldGeneric
            label="Max Product"
            type="number"
            required={true}
            placeholder="Enter max Product"
            SateChange={MaxProduct}
            setSateChange={setMaxProduct}
            disabled={false}
          />
          <InputFieldGeneric
            label="Max Store"
            type="number"
            required={true}
            placeholder="Enter max Store"
            SateChange={MaxStore}
            setSateChange={setMaxStore}
            disabled={false}
          />
          <InputFieldGeneric
            label="Max Featured"
            type="number"
            required={true}
            placeholder="Enter max Featured"
            SateChange={MaxFeatured}
            setSateChange={setMaxFeatured}
            disabled={false}
          />
          <InputFieldGeneric
            label="Price"
            type="number"
            required={true}
            placeholder="Enter Price"
            SateChange={Price}
            setSateChange={setPrice}
            disabled={false}
          />
          <InputFieldGeneric
            label="Duration"
            type="number"
            required={true}
            placeholder="Enter Duration"
            SateChange={Duration}
            setSateChange={setDuration}
            disabled={false}
          />
          <GenericCheckbox
            label="Pos Integration"
            checked={checked}
            onChange={setChecked}
          />
          {update ? (
            <div className="flex justify-end">
              <ActionButton
                text="Update"
                update={false}
                loading={loading}
                loadingtext="Updateing..."
                onClick={() => SubScriptionModify()}
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
                onClick={() => SubScriptionAdd()}
                disabled={false}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
