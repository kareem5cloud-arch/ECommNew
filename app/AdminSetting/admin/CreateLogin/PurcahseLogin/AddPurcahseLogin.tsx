"use client";
import SellerSignupApi from "@/app/api/Controller/Authentication/Signup/SellerSignup";
import ModifySeller from "@/app/api/Controller/Authentication/SignupList/OnlineSellerList/UpdateSeller";
import { storeList } from "@/app/api/Types/AdminSetting/Store/Store";
import { signupList } from "@/app/api/Types/Authentication/SignUpLoginList";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface LoginProps {
  update: boolean;
  storeList: storeList[];
  initalData?: signupList;
  onShowMessage: (message: string, type: "success" | "error") => void;
}
export default function AddOnlineLogin({
  update,
  storeList,
  initalData,
  onShowMessage,
}: LoginProps) {
  const [UserName, setUserName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [Address, setAddress] = useState("");
  const [StoreID, setStoreID] = useState("");
  const [StoreName, setStoreName] = useState("");
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");
  const [storesTable, setStoreTable] = useState<storeList[]>([]);

  const AddStoreListDatainTable = (ID: string) => {
    if (!ID) return alert("Please Select a Store");
    const storeToAdd = storeList.find((item) => item.storeID === ID);

    if (!storeToAdd) {
      alert("Store not found");
      setStoreID("");
      setStoreName("");
      return;
    }

    const exists = storesTable.some((item) => item.storeID === ID);

    if (exists) {
      alert("Record Already Exists in Table");
      setStoreID("");
      setStoreName("");
      return;
    } else {
      setStoreID("");
      setStoreName("");
      setStoreTable([...storesTable, storeToAdd]);
    }
  };

  const onDeleteStore = (ID: string) => {
    const storeToAdd = storesTable.filter((item) => item.storeID !== ID);
    if (storeToAdd) {
      setStoreTable(storeToAdd);
    } else {
      alert("Could Not Delete Store.");
    }
  };

  const StoreAdd = async () => {
    try {
      setLoading(true);
      if (!Email || !Password || !PhoneNo)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          userName: UserName,
          email: Email,
          password: Password,
          phoneNo: PhoneNo,
          status: "PurchaserLogin",
          address: Address,
          stores: storesTable.map((item) => ({
            storeID: item.storeID,
            storeName: item.storeName,
          })),
        };
        //console.log(formData);
        const token = localStorage.getItem("adminToken");
        const response = await SellerSignupApi(formData, String(token));
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
  const StoreModify = async () => {
    try {
      setLoading(true);
      if (!Email || !ID || !PhoneNo)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          userName: UserName,
          email: Email,
          password: Password,
          phoneNo: PhoneNo,
          status: "PurchaserLogin",
          address: Address,
          stores: storesTable.map((item) => ({
            storeID: item.storeID,
            storeName: item.storeName,
          })),
        };
        //console.log(formData);
        const token = localStorage.getItem("adminToken");
        const response = await ModifySeller(ID, formData, String(token));
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
      setEmail(initalData.email);
      setPhoneNo(initalData.phone);
      setUserName(initalData.userName);
      setID(initalData.sellerID);
      setAddress(initalData.address);
      setStoreTable(
        initalData.stores.map((item) => ({
          storeID: item.storeID,
          storeName: item.storeName,
        })),
      );
    } else {
      setEmail("");
      setPhoneNo("");
      setUserName("");
      setID("");
      setAddress("");
      setStoreTable([]);
    }
  }, [initalData, update]);

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-lg space-y-4">
          <InputFieldGeneric
            label="UserName"
            type="text"
            required={false}
            placeholder="Enter UserName"
            SateChange={UserName}
            setSateChange={setUserName}
            disabled={false}
          />
          <InputFieldGeneric
            label="Email"
            type="email"
            required={true}
            placeholder="Enter Email"
            SateChange={Email}
            setSateChange={setEmail}
            disabled={false}
          />
          {!update && (
            <>
              <InputFieldGeneric
                label="Password"
                type="text"
                required={true}
                placeholder="Enter Password"
                SateChange={Password}
                setSateChange={setPassword}
                disabled={false}
              />
            </>
          )}
          <InputFieldGeneric
            label="PhoneNo"
            type="text"
            required={true}
            placeholder="Enter PhoneNo"
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
          <div className="flex gap-2">
            <DropDownList
              label="Stores "
              placeholder="Enter Stores"
              required={true}
              filedID={setStoreID}
              value={StoreName}
              onChange={setStoreName}
              options={storeList.map((item) => ({
                label: item.storeName,
                value: item.storeName,
                id: item.storeID,
              }))}
            />
            <div className="mt-7">
              <button
                onClick={() => AddStoreListDatainTable(StoreID)}
                title="Add Store"
                className="px-2 py-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded-md shadow-md"
              >
                <Plus />
              </button>
            </div>
          </div>
          {update ? (
            <div className="flex justify-end">
              <ActionButton
                text="Update"
                update={false}
                loading={loading}
                loadingtext="Updateing..."
                onClick={() => StoreModify()}
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
                onClick={() => StoreAdd()}
                disabled={false}
              />
            </div>
          )}
        </div>
        <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {storesTable.map((store, index) => (
                <tr key={store.storeID} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {store.storeName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => onDeleteStore(store.storeID)}
                      className="text-red-600 hover:text-red-900 transition p-1 rounded hover:bg-red-50"
                      title="Delete Store"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
