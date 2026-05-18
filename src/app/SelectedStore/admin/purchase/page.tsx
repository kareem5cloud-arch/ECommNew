"use client";
import Select from "react-select";
import { useEffect, useState } from "react";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  User,
  Tag,
  PlusCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Trash,
  Pencil,
  Coins,
  Plus,
  Notebook,
  Calendar,
  NotepadText,
} from "lucide-react";
import GetProduct from "@/api/lib/product/GetProduct/GetProduct";
import { Product, ProductApiResponse } from "@/api/types/product/getProduct";
import { useRouter } from "next/navigation";

interface Item {
  name: string;
  qty: number;
  price: number;
}
interface Varient {
  varientName: string;
  varientAttributes: VarientAttribute[];
}
interface VarientAttribute {
  varientValue: string;
  qty: number;
  costPrice: number;
  salePrice: number;
}

export default function PurchaseForm({ storeID }: { storeID: string }) {
  const router = useRouter();
  const [showList, setShowList] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [listVarient, setListVarient] = useState<Varient[]>([]);
  const [mainVarientName, setMainVarientName] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("OfflineStore");
  const [productList, setProductList] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [currentAttributes, setCurrentAttributes] = useState<
    VarientAttribute[]
  >([]);
  const [newAttribute, setNewAttribute] = useState<VarientAttribute>({
    varientValue: "",
    qty: 0,
    costPrice: 0,
    salePrice: 0,
  });

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "#F9FAFB", // bg-gray-50
      boxShadow: state.isFocused ? "0 0 0 1px #3B82F6" : "none", // focus blue ring like Tailwind
      minHeight: "38px", // roughly match input height
      border: "none",
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: 0,
      marginLeft: "0.5rem", // add some left margin to separate from icon
    }),
    input: (provided: any) => ({
      ...provided,
      margin: 0,
      padding: 0,
      color: "#111827", // text-gray-900
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#6B7280", // text-gray-400
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#111827", // text-gray-900
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      paddingRight: 0,
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      padding: "0 8px",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#F9FAFB", // bg-gray-50
      borderRadius: "0.5rem",
      marginTop: 4,
      zIndex: 9999,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#E5E7EB" : "transparent",
      color: "#111827",
      cursor: "pointer",
    }),
  };

  const handleAddMainVariant = () => {
    if (!mainVarientName.trim()) {
      alert("Please enter a Variant Name");
      return;
    }
    if (currentAttributes.length === 0) {
      alert("Please add at least one attribute");
      return;
    }

    const updatedList = [
      ...listVarient,
      {
        varientName: mainVarientName.trim(),
        varientAttributes: currentAttributes,
      },
    ];
    setListVarient(updatedList);
    // Reset inputs for next variant
    setMainVarientName("");
    setCurrentAttributes([]);
  };

  // Add new attribute row to currentAttributes
  const handleAddAttribute = () => {
    if (!newAttribute.varientValue.trim()) {
      alert("Please enter Attribute Name");
      return;
    }
    setCurrentAttributes([...currentAttributes, newAttribute]);
    setNewAttribute({ varientValue: "", qty: 0, costPrice: 0, salePrice: 0 });
  };

  // Update newAttribute inputs (for the input row)
  const handleNewAttributeChange = (
    field: keyof VarientAttribute,
    value: string | number
  ) => {
    setNewAttribute({ ...newAttribute, [field]: value });
  };

  // Remove an attribute from currentAttributes by index
  const handleRemoveAttribute = (index: number) => {
    setCurrentAttributes(currentAttributes.filter((_, i) => i !== index));
  };
  const getProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return router.push("/sellerlogin");
      }

      const response = await GetProduct(token, storeID);

      if (response.status === 200 || response.status === 201) {
        const data = response.data as ProductApiResponse;
        console.log("Parsed data.list:", data.list);
        setAllProducts(data.list);
      } else if (response.status === 401) {
        router.push("/sellerlogin");
      } else {
        console.error("Unexpected status:", response.status, response.data);
      }
    } catch (error) {
      console.error("Error in getProduct:", error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);
  useEffect(() => {
    if (selectedOption2 === "Both") {
      setProductList(allProducts);
    } else {
      setProductList(
        allProducts.filter((p) => p.storeSale === selectedOption2)
      );
    }
  }, [selectedOption2, allProducts]);

  return (
    <div className="w-full relative">
      <h2 className="text-2xl font-semibold text-gray-800">
        Purchase Management
      </h2>
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowList(!showList)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {showList ? (
              <>
                <ChevronRight size={18} /> Add New
              </>
            ) : (
              <>
                <ChevronLeft size={18} /> Show List
              </>
            )}
          </button>
        </div>
        {showList ? (
          <div className="p-4 border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">ABC_XYZ</h3>
              <p className="text-gray-600">Email: abc@email.com</p>
              <p className="text-gray-600">Remaining Balance: 20,100</p>
            </div>
            <div className="flex gap-4">
              <button
                //   onClick={() => FetchData(company.Id)}
                className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
                title="Edit"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
                title="Delete"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5 mt-2">
            <div className="w-full p-3 rounded-xl max-w-md">
              <h2 className="text-md text-gray-800 mb-4">Store Sale</h2>

              <div className="flex flex-wrap  gap-4 ">
                {/* Option 1 */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="StoreSale"
                    value="Both"
                    checked={selectedOption2 === "Both"}
                    onChange={(e) => setSelectedOption2("Both")}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 text-sm font-medium">
                    Both
                  </span>
                </label>

                {/* Option 2 */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="StoreSale"
                    value="OnlineStore"
                    checked={selectedOption2 === "OnlineStore"}
                    onChange={(e) => setSelectedOption2("OnlineStore")}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 text-sm font-medium">
                    Online Store
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="StoreSale"
                    value="OfflineStore"
                    checked={selectedOption2 === "OfflineStore"}
                    onChange={(e) => setSelectedOption2("OfflineStore")}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 text-sm font-medium">
                    Offline Store
                  </span>
                </label>
              </div>
            </div>
            {/* Each input wrapper should have a responsive width like so: */}
            <div className="flex w-full gap-2">
              <div className="w-full">
                {/* Purchase Date */}
                <label className="block text-gray-700 font-medium mb-2">
                  Purchase Date
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center w-full border border-gray-200 rounded-lg bg-gray-50 px-3 py-2">
                    <Calendar className="text-gray-400 mr-2" size={18} />
                    <input
                      type="date"
                      name="productName"
                      placeholder="Enter PurchaseDate"
                      className="flex-1 bg-transparent outline-none text-gray-900"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full">
                {/* Invoice No */}
                <label className="block text-gray-700 font-medium mb-2">
                  Invoice No
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                  <NotepadText className="text-gray-400 mr-2" size={18} />
                  <input
                    type="text"
                    name="supplierName"
                    placeholder="Enter Invoice No"
                    className="w-full bg-transparent outline-none text-gray-900"
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full gap-2">
              <div className="w-full">
                {/* Supplier Name */}
                <label className="block text-gray-700 font-medium mb-2">
                  Supplier Name
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                  <User className="text-gray-400 mr-2" size={18} />
                  <input
                    type="text"
                    name="supplierName"
                    placeholder="Enter Supplier name"
                    className="w-full bg-transparent outline-none text-gray-900"
                  />
                </div>
              </div>
              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-2">
                  Product Name
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                  <Tag className="text-gray-400 mr-2 ml-3" size={18} />
                  <Select
                    options={productList.map((item) => ({
                      value: item.productID,
                      label: item.productName,
                    }))}
                    onChange={(selectedOption) => {
                      console.log(selectedOption);
                    }}
                    placeholder="Select Product"
                    styles={customStyles}
                    className="flex-1"
                    isClearable
                  />
                </div>
              </div>
            </div>
            <fieldset className="p-4 border border-gray-300 rounded-lg">
              <legend className="text-lg font-semibold mb-4">
                Variant Info
              </legend>

              {/* Input for Main Variant Name and button */}
              <div className="flex gap-2 items-center mb-4">
                <input
                  type="text"
                  placeholder="Enter Variant Name (Main)"
                  value={mainVarientName}
                  onChange={(e) => setMainVarientName(e.target.value)}
                  className="flex-grow p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddMainVariant}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save Variant
                </button>
              </div>

              {/* Table of current attributes (sub-variants) */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border border-gray-300 rounded">
                  <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                      <th className="px-4 py-2">Attribute Name</th>
                      <th className="px-4 py-2">Qty</th>
                      <th className="px-4 py-2">CP</th>
                      <th className="px-4 py-2">SP</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Existing attributes */}
                    {currentAttributes.map((attr, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-300 odd:bg-white even:bg-gray-50"
                      >
                        <td className="px-4 py-2">{attr.varientValue}</td>
                        <td className="px-4 py-2">{attr.qty}</td>
                        <td className="px-4 py-2">{attr.costPrice}</td>
                        <td className="px-4 py-2">{attr.salePrice}</td>
                        <td className="px-4 py-2">
                          <button
                            className="px-2 py-1 bg-red-600 text-white rounded"
                            onClick={() => handleRemoveAttribute(i)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* Row for adding new attribute */}
                    <tr>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          placeholder="Attribute Name"
                          value={newAttribute.varientValue}
                          onChange={(e) =>
                            handleNewAttributeChange(
                              "varientValue",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min={0}
                          value={newAttribute.qty}
                          onChange={(e) =>
                            handleNewAttributeChange(
                              "qty",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={newAttribute.costPrice}
                          onChange={(e) =>
                            handleNewAttributeChange(
                              "costPrice",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={newAttribute.salePrice}
                          onChange={(e) =>
                            handleNewAttributeChange(
                              "salePrice",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={handleAddAttribute}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center"
                          title="Add Attribute"
                        >
                          <Plus className="mr-1" />
                          Add
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </fieldset>

            <div className="md:col-span-2">
              {" "}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                {" "}
                {/* Total Bill */}{" "}
                <div>
                  {" "}
                  <label className="block text-gray-700 font-medium mb-2">
                    {" "}
                    Total Bill{" "}
                  </label>{" "}
                  <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                    {" "}
                    <Coins className="text-gray-400 mr-2" size={18} />{" "}
                    <input
                      type="number"
                      name="totalBill"
                      placeholder="Enter Total Bill"
                      className="w-full bg-transparent outline-none text-gray-900"
                    />{" "}
                  </div>{" "}
                </div>{" "}
                {/* Adjustment */}{" "}
                <div>
                  {" "}
                  <label className="block text-gray-700 font-medium mb-2">
                    {" "}
                    Adjustment{" "}
                  </label>{" "}
                  <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                    {" "}
                    <Coins className="text-gray-400 mr-2" size={18} />{" "}
                    <input
                      type="number"
                      name="adjustment"
                      placeholder="Enter Adjustment"
                      className="w-full bg-transparent outline-none text-gray-900"
                    />{" "}
                  </div>{" "}
                </div>{" "}
                {/* Amount Paid */}{" "}
                <div>
                  {" "}
                  <label className="block text-gray-700 font-medium mb-2">
                    {" "}
                    Amount Paid{" "}
                  </label>{" "}
                  <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                    {" "}
                    <Coins className="text-gray-400 mr-2" size={18} />{" "}
                    <input
                      type="number"
                      name="amountPaid"
                      placeholder="Enter Amount Paid"
                      className="w-full bg-transparent outline-none text-gray-900"
                    />{" "}
                  </div>{" "}
                </div>{" "}
                {/* Remaining Balance */}{" "}
                <div>
                  {" "}
                  <label className="block text-gray-700 font-medium mb-2">
                    {" "}
                    Remaining Balance{" "}
                  </label>{" "}
                  <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                    {" "}
                    <Coins className="text-gray-400 mr-2" size={18} />{" "}
                    <input
                      type="number"
                      name="remainingBalance"
                      placeholder="Auto Calculated"
                      readOnly
                      className="w-full bg-transparent outline-none text-gray-900"
                    />{" "}
                  </div>{" "}
                </div>{" "}
                {/* Total Payable */}{" "}
                <div className=" ">
                  {" "}
                  <label className="block text-gray-700 font-medium mb-2">
                    {" "}
                    Total Payable{" "}
                  </label>{" "}
                  <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                    {" "}
                    <Coins className="text-gray-400 mr-2" size={18} />{" "}
                    <input
                      type="number"
                      name="totalPayable"
                      placeholder="Enter Total Payable"
                      className="w-full bg-transparent outline-none text-gray-900"
                    />{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>
            {/* Description - full width */}
            <div className="w-full">
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <div className="flex items-start border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <Notebook className="text-gray-400 mr-2 mt-1" size={18} />
                <textarea
                  name="description"
                  placeholder="Enter Description"
                  className="w-full bg-transparent outline-none text-gray-900 resize-none"
                  rows={3}
                />
              </div>
            </div>
            {/* Save Button - full width */}
            <div className="w-full flex justify-end mt-4">
              <button
                type="button"
                className="w-full gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
