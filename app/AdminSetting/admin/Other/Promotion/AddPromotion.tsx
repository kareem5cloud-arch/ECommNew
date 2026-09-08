"use client";

import GetCustomerApi from "@/app/api/Controller/AdminController/Customer/CustomerGet";
import PromotionAddApi from "@/app/api/Controller/AdminController/Shipment/Promotion/AddPromotion";
import PromotionUpdateApi from "@/app/api/Controller/AdminController/Shipment/Promotion/UpdatePromotion";
import {
  cutomerList,
  ResponseGetCustomer,
} from "@/app/api/Types/AdminSetting/Customer/Customer";
import {
  RequestAddModifyFormDara,
  RequestModifyPromotion,
} from "@/app/api/Types/AdminSetting/Promotion/Promotion";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import GenericRadio from "@/app/ui/RadioButton/RadioButton";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { Plus, Trash } from "lucide-react";
import { init } from "next/dist/compiled/webpack/webpack";
import { title } from "process";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  update: boolean;
  initalData?: RequestModifyPromotion;
  onShowMessage: (message: string, type: "success" | "error") => void;
}

export default function AddPromotion({
  update,
  initalData,
  onShowMessage,
}: propsForAddRegion) {
  const [PromotionName, setPromotionName] = useState("");
  const [Title, setTitle] = useState("");
  const [StartDate, setStartDate] = useState("");
  const [ExpiryDate, setExpiryDate] = useState("");
  const [CustomerID, setCustomerID] = useState("");
  const [CustomerName, setCustomerName] = useState("");
  const [PromoCode, setPromoCode] = useState("");
  const [PromoType, setPromoType] = useState("");
  const [description, setDescription] = useState("");
  const [Amount, setAmount] = useState("");
  const [FeaturedProduct, setFeaturedProduct] = useState("");
  const [MaxMember, setMaxMember] = useState("");
  const [ID, setID] = useState("");
  const [loading, setLoading] = useState(false);

  const [CustomerList, setCustomerList] = useState<cutomerList[]>([]);

  const [customerData, setCustomerDate] = useState<cutomerList[]>([]);

  const resetFunction = () => {
    setPromotionName("");
    setFeaturedProduct("");
    setExpiryDate("");
    setStartDate("");
    setPromoCode("");
    setPromoType("");
    setAmount("");
    setID("");
    setTitle("");
    setMaxMember("");
    setCustomerDate([]);
  };

  const promotion = [
    { ID: "1", name: "Promo" },
    { ID: "2", name: "Voucher" },
    { ID: "3", name: "Coupon" },
    { ID: "4", name: "Gift" },
  ];
  const promotionType = [
    { ID: "1", name: "All" },
    { ID: "2", name: "Limited User" },
    { ID: "3", name: "Specific Customer" },
  ];

  const CustomerGet = async () => {
    const token = localStorage.getItem("adminToken");

    const response = await GetCustomerApi(String(token));
    if (response.status == 200) {
      const data = response.data as ResponseGetCustomer;
      setCustomerList(data.cutomerList);
    } else {
      setCustomerList([]);
    }
  };
  useEffect(() => {
    CustomerGet();
  }, []);

  const AddCustoemrData = () => {
    if (!CustomerID) return alert("Select a Customer");
    else {
      const data = customerData.find((item) => item.sellerID === CustomerID);
      if (data) {
        setCustomerName("");
        setCustomerID("");
        alert("Customer Already Exist");
      } else {
        setCustomerDate((prev) => [
          ...prev,
          {
            email: CustomerName,
            sellerID: CustomerID,
          },
        ]);
        setCustomerName("");
        setCustomerID("");
      }
    }
  };

  const onDeleteStore = (ID: string) => {
    const data = customerData.filter((item) => item.sellerID !== ID);
    if (data) {
      setCustomerDate(data);
    }
  };
  const AddPromotion = async () => {
    try {
      setLoading(true);
      if (
        !Title ||
        !PromotionName ||
        !Amount ||
        !StartDate ||
        !ExpiryDate ||
        !PromoCode
      )
        return alert("Please fill in all * required fields.");
      const token = localStorage.getItem("adminToken");
      const formData = {
        title: Title,
        promotionName: PromotionName,
        promoCode: PromoCode,
        promotionType: PromoType,
        amount: Number(Amount),
        maxMember: Number(MaxMember) || 0,
        discountType: FeaturedProduct,
        startDate: StartDate,
        expiryDate: ExpiryDate,
        customerList: customerData.map((item) => ({
          customerID: item.sellerID,
          email: item.email,
        })),
      };
      const response = await PromotionAddApi(formData, String(token));
      if (response.status == 200) {
        const data = response.data as RequestAddModifyFormDara;
        onShowMessage(response.data.message, "success");
      } else {
        onShowMessage(response.data.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };
  const ModifyPromotion = async () => {
    try {
      setLoading(true);
      if (
        !Title ||
        !PromotionName ||
        !Amount ||
        !StartDate ||
        !ExpiryDate ||
        !PromoCode
      )
        return alert("Please fill in all * required fields.");
      const token = localStorage.getItem("adminToken");
      const formData = {
        promoID: ID,
        title: Title,
        promotionName: PromotionName,
        promoCode: PromoCode,
        promotionType: PromoType,
        amount: Number(Amount),
        maxMember: Number(MaxMember) || 0,
        discountType: FeaturedProduct,
        startDate: StartDate,
        expiryDate: ExpiryDate,
        customerList: customerData.map((item) => ({
          customerID: item.sellerID,
          email: item.email,
        })),
      };
      const response = await PromotionUpdateApi(formData, String(token));
      if (response.status == 200) {
        const data = response.data as RequestAddModifyFormDara;
        onShowMessage(response.data.message, "success");
      } else {
        onShowMessage(response.data.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (update && initalData) {
      setPromotionName(initalData.promotionName);
      setFeaturedProduct(initalData.discountType);
      setExpiryDate(
        new Date(initalData.expiryDate).toISOString().split("T")[0],
      );
      setStartDate(new Date(initalData.startDate).toISOString().split("T")[0]);
      setPromoCode(initalData.promoCode);
      setPromoType(initalData.promotionType);
      setAmount(String(initalData.amount));
      setID(initalData.promoID);
      setTitle(initalData.title);
      setMaxMember(String(initalData.maxMember));
      setCustomerDate(
        initalData.customerList.map((item) => ({
          sellerID: item.customerID,
          email: item.email || "",
        })),
      );
    } else {
      resetFunction();
    }
  }, [initalData, update]);

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <InputFieldGeneric
            label="Title"
            type="text"
            required={true}
            placeholder="Enter Title"
            SateChange={Title}
            setSateChange={setTitle}
            disabled={false}
          />
          <DropDownList
            label="Promotion Name "
            placeholder="Enter Promotion Name"
            required={true}
            filedID={() => {}}
            value={PromotionName}
            onChange={setPromotionName}
            options={promotion.map((item) => ({
              label: item.name,
              value: item.name,
              id: item.ID,
            }))}
          />
          <InputFieldGeneric
            label="Promo Code "
            type="text"
            required={false}
            placeholder="Enter Promo Code "
            SateChange={PromoCode}
            setSateChange={setPromoCode}
            disabled={false}
          />

          <InputFieldGeneric
            label="Start Date "
            type="date"
            required={true}
            placeholder="Enter Start Date "
            SateChange={StartDate}
            setSateChange={setStartDate}
            disabled={false}
          />
          <InputFieldGeneric
            label="Expiry Date "
            type="date"
            required={true}
            placeholder="Enter Expiry Date "
            SateChange={ExpiryDate}
            setSateChange={setExpiryDate}
            disabled={false}
          />
          <InputFieldGeneric
            label="Amount "
            type="text"
            required={false}
            placeholder="Enter Amount "
            SateChange={Amount}
            setSateChange={setAmount}
            disabled={false}
          />
          <div className="">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Discount Type
            </label>

            <div className="flex gap-5">
              <GenericRadio
                label="Percentage"
                name="Featured"
                value="Percentage"
                checked={FeaturedProduct === "Percentage"}
                onChange={() => setFeaturedProduct("Percentage")}
              />

              <GenericRadio
                label="Decimal"
                name="Featured"
                value="Decimal"
                checked={FeaturedProduct === "Decimal"}
                onChange={() => setFeaturedProduct("Decimal")}
              />
            </div>
          </div>
          <DropDownList
            label="Promotion Type "
            placeholder="Enter Promotion Type"
            required={true}
            filedID={() => {}}
            value={PromoType}
            onChange={setPromoType}
            options={promotionType.map((item) => ({
              label: item.name,
              value: item.name,
              id: item.ID,
            }))}
          />
          {PromoType === "Specific Customer" && (
            <div className="flex gap-2">
              <div className="w-full">
                <DropDownList
                  label="Customer Name "
                  placeholder="Enter Customer Name"
                  required={true}
                  filedID={setCustomerID}
                  value={CustomerName}
                  onChange={setCustomerName}
                  options={CustomerList.map((item) => ({
                    label: item.email,
                    value: item.email,
                    id: item.sellerID,
                  }))}
                />
              </div>
              <div className="mt-6">
                <button
                  title="Add Customer"
                  onClick={() => AddCustoemrData()}
                  className="px-2 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-md text-white cursor-pointer"
                >
                  <Plus />
                </button>
              </div>
            </div>
          )}
          {PromoType === "Limited User" && (
            <InputFieldGeneric
              label="Max Member "
              type="text"
              required={true}
              placeholder="Enter Max Member "
              SateChange={MaxMember}
              setSateChange={setMaxMember}
              disabled={false}
            />
          )}
          {update ? (
            <div className="flex justify-end">
              <ActionButton
                text="Update"
                update={false}
                loading={loading}
                loadingtext="Updateing..."
                onClick={() => ModifyPromotion()}
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
                onClick={() => AddPromotion()}
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
                  Customer Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customerData.map((item, index) => (
                <tr key={item.sellerID} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => onDeleteStore(item.sellerID)}
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
