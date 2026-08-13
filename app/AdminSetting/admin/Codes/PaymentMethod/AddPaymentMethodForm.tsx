import PaymentMethodAdd from "@/app/api/Controller/AdminController/PaymentMethod/AddPaymentMethod";
import PaymentMethodModify from "@/app/api/Controller/AdminController/PaymentMethod/ModifyPaymentMoethod";
import { SendDataToApi } from "@/app/api/Controller/MiddleWare/CloudinaryUplaod";
import { PaymentMethod } from "@/app/api/Types/AdminSetting/PaymentMethod/paymentMethod";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import GenericRadio from "@/app/ui/RadioButton/RadioButton";
import { Plus, Trash } from "lucide-react";
import { title } from "process";
import { useEffect, useState } from "react";
interface OptionListType {
  index: string;
  optionName: string;
  maxAmount: string;
  percentage: string;
  file: File | null | string;
}

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
  const [PaymentOption, setPaymentOption] = useState("");
  const [optionList, setOptionList] = useState<OptionListType[]>([]);
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");

  const AddOption = () => {
    if (!PaymentOption) return alert("Please Enter a Payment Option");
    const data = optionList.find(
      (item) => item.optionName.toLowerCase() === PaymentOption.toLowerCase(),
    );
    if (data) return alert("The Payment Option Already Exist");
    else {
      const formdata = {
        index: String(optionList.length + 1),
        optionName: PaymentOption,
        maxAmount: "0",
        percentage: "0",
        file: null,
      };
      setOptionList([...optionList, formdata]);
      setPaymentOption("");
    }
  };
  const onDeleteStore = (ID: string) => {
    const storeToAdd = optionList.filter((item) => item.index !== ID);
    if (storeToAdd) {
      setOptionList(storeToAdd);
    } else {
      alert("Could Not Delete Store.");
    }
  };
  const updateRow = (
    rowIndex: string,
    field: keyof OptionListType,
    value: any,
  ) => {
    console.log(value);
    setOptionList((prev) =>
      prev.map((row) =>
        row.index === rowIndex ? { ...row, [field]: value } : row,
      ),
    );
  };

  const PaymentAdd = async () => {
    try {
      setLoading(true);
      if (!paymentMethod) return alert("Please Fill in Filed with *");
      else {
        // const data = await Promise.all(
        //   optionList.map(async (item) => ({
        //     optionName: item.optionName,
        //     iconUrl: item.file ? (await SendDataToApi(item.file)).data : null,
        //     maxThreshold: Number(item.maxAmount),
        //     percentage: Number(item.percentage),
        //   })),
        // );

        const data = await Promise.all(
          optionList.map(async (item) => {
            let iconUrl: string | null = null;
            if (item.file instanceof File) {
              const uploadResponse = await SendDataToApi(item.file);
              iconUrl = String(uploadResponse.data);
            } else if (typeof item.file === "string") {
              iconUrl = item.file;
            }
            return {
              optionName: item.optionName,
              iconUrl: iconUrl || "",
              maxThreshold: Number(item.maxAmount),
              percentage: Number(item.percentage),
            };
          }),
        );
        const formData = {
          bankName: paymentMethod,
          paymentOption: data,
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
      if (!paymentMethod) return alert("Please Fill in Filed with *");
      else {
        const data = await Promise.all(
          optionList.map(async (item) => {
            let iconUrl: string | null = null;
            if (item.file instanceof File) {
              const uploadResponse = await SendDataToApi(item.file);
              iconUrl = String(uploadResponse.data);
            } else if (typeof item.file === "string") {
              iconUrl = item.file;
            }
            return {
              optionName: item.optionName,
              iconUrl: iconUrl || "",
              maxThreshold: Number(item.maxAmount),
              percentage: Number(item.percentage),
            };
          }),
        );
        const formData = {
          bankName: paymentMethod,
          paymentID: ID,
          paymentOption: data,
        };
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
      setPaymentMethod(initalData.bankName);
      setID(initalData.paymentID);
      setOptionList(
        initalData.paymentOption.map((item, index) => ({
          index: String(index + 1),
          optionName: item.optionName,
          maxAmount: String(item.maxThreshold),
          percentage: String(item.percentage),
          file: item.iconUrl,
        })),
      );
    } else {
      setOptionList([]);
      setPaymentMethod("");
      setID("");
    }
  }, [initalData, update]);

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <InputFieldGeneric
            label="Payment Method"
            type="text"
            required={true}
            placeholder="Enter Payment Method"
            SateChange={paymentMethod}
            setSateChange={setPaymentMethod}
            disabled={false}
          />
          <div className="flex gap-2">
            <div className="w-full">
              <InputFieldGeneric
                label="Payment Option"
                type="text"
                required={true}
                placeholder="Enter Payment Option"
                SateChange={PaymentOption}
                setSateChange={setPaymentOption}
                disabled={false}
              />
            </div>
            <div className="mt-7">
              <button
                title="Add Option"
                onClick={() => AddOption()}
                className="px-2 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-md text-white cursor-pointer"
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
        <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Option Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Max Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Icon Url
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {optionList.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.optionName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input
                      type="text"
                      value={item.maxAmount}
                      onChange={(e) =>
                        updateRow(
                          String(index + 1),
                          "maxAmount",
                          e.target.value,
                        )
                      }
                      placeholder="Max Amount"
                      className="w-full p-2  text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input
                      type="text"
                      value={item.percentage}
                      onChange={(e) =>
                        updateRow(
                          String(index + 1),
                          "percentage",
                          e.target.value,
                        )
                      }
                      placeholder="Percentage"
                      className="w-full p-2  text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="space-y-2">
                      {/* File Input */}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          updateRow(
                            String(index + 1),
                            "file",
                            e.target.files?.[0] ?? null,
                          )
                        }
                        className="block w-full text-sm text-gray-500 
                        file:mr-4 file:py-2 file:px-4 
                        file:rounded-md file:border-0 
                        file:text-sm file:font-medium 
                        file:bg-blue-50 file:text-blue-700 
                        hover:file:bg-blue-100 
                        cursor-pointer"
                      />

                      {/* Image Preview */}
                      {item.file instanceof File ? (
                        <div className="mt-2 p-2 border border-gray-200 rounded-md bg-gray-50 inline-block">
                          <img
                            src={URL.createObjectURL(item.file) || item.file}
                            alt={item.optionName || "Preview"}
                            className="max-h-5 w-auto object-contain"
                          />
                        </div>
                      ) : (
                        <div className="mt-2 p-2 border border-gray-200 rounded-md bg-gray-50 inline-block">
                          <img
                            src={item.file || ""}
                            alt={item.optionName || "Preview"}
                            className="max-h-5 w-auto object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => onDeleteStore(item.index)}
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
