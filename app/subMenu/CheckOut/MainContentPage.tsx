import FreeGetCityApi from "@/app/api/Controller/AdminController/FreeApis/CityListApi";
import FreeGetStateApi from "@/app/api/Controller/AdminController/FreeApis/GetStateListApi";
import GetCountryApi from "@/app/api/Controller/AdminController/Shipment/Country/CountryGet";
import {
  countryList,
  GetCountryListResponse,
} from "@/app/api/Types/Shipment/Country";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import { Check, Shield, Truck, User } from "lucide-react";
import { useEffect, useState } from "react";
interface responseCity {
  data: string[];
}
interface StateResposne {
  data: stateListData;
}
interface stateListData {
  states: states[];
}
interface states {
  name: string;
}

export default function MainContentPage() {
  const [orderConfirmationBox, setOrderConfirmationBox] = useState(false);
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [countryID, setCountryID] = useState("");
  const [countryName, setCountryName] = useState("");
  const [cityID, setCityID] = useState("");
  const [CityName, setCityName] = useState("");
  const [StateID, setStateID] = useState("");
  const [StateName, setStateName] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [countryData, setCountryData] = useState<countryList[]>([]);
  const [StateData, setStateData] = useState<states[]>([]);
  const [cityData, setCityData] = useState([]);
  const [StreetAddress, setStreetAddress] = useState("");
  const [ZipCode, setZipCode] = useState("");
  const steps = ["Personal", "Shipping", "Payment"];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const cartItems = [
    {
      id: "1",
      name: "Sony WH-1000XM5 Wireless Headphones",
      price: 399.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=100&h=100&fit=crop",
      variant: "Black",
    },
    {
      id: "2",
      name: "Apple iPhone 15 Pro Max",
      price: 1199.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&h=100&fit=crop",
      variant: "Natural Titanium, 256GB",
    },
  ];
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 500 ? 0 : 9.99;
  const tax = subtotal * 0.1;
  const discount = 0;
  const total = subtotal + shipping + tax - discount;
  const getCountries = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetCountryApi(String(token));
    if (response.status === 200) {
      const data = response.data as GetCountryListResponse;
      setCountryData(data.countryList);
    } else {
      setCountryData([]);
    }
  };
  const getStates = async (countryName: string) => {
    const response = await FreeGetStateApi(String(countryName));
    if (response.status === 200) {
      const data2 = response.data as StateResposne;
      console.log(data2.data.states);
      setStateData(data2.data.states);
    } else {
      setStateData([]);
    }
  };

  const getCities = async (countryName: string, stateName: string) => {
    const response = await FreeGetCityApi(String(countryName), stateName);
    if (response.status === 200) {
      const data2 = response.data;
      console.log(data2.data);
      setCityData(data2.data);
    } else {
      setCityData([]);
    }
  };

  useEffect(() => {
    getCountries();
  }, []);
  useEffect(() => {
    if (countryName) {
      getStates(countryName);
    }
  }, [countryName]);
  useEffect(() => {
    if (countryName && StateName) {
      getCities(countryName, StateName);
    }
  }, [countryName, StateName]);
  return (
    <>
      {orderConfirmationBox && (
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-500 mb-4">
              Thank you for your purchase. Your order has been confirmed and
              will be shipped soon.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600">
                Order Number: #ORD-{Math.floor(Math.random() * 100000)}
              </p>
              {/* <p className="text-sm text-gray-600">
                Confirmation sent to: {formData.email}
              </p> */}
            </div>
            <button
              //onClick={() => router.push("/")}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Checkout</h1>
            <p className="text-gray-500 mt-1">
              Complete your purchase securely
            </p>
          </div>
          <div className="w-full  flex justify-center">
            <div className="flex items-center justify-around w-full">
              {steps.map((item, index) => (
                <div key={index}>
                  {/* Step Circle & Label */}
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all duration-300
                    ${
                      index <= currentStep
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                        : "bg-gray-200 text-gray-500"
                    }
                    ${index === currentStep ? "ring-4 ring-blue-100" : ""}
                  `}
                    >
                      {index + 1}
                    </div>
                    <p
                      className={`
                    mt-2 text-sm font-medium
                    ${index <= currentStep ? "text-blue-600" : "text-gray-400"}
                  `}
                    >
                      {item}
                    </p>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2">
                      <div
                        className={`
                      h-full transition-all duration-500
                      ${index < currentStep ? "bg-blue-600" : "bg-gray-200"}
                    `}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 mt-10">
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {currentStep === 0 && (
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <User className="w-5 h-5 text-gray-900" />
                      <h2 className="text-lg font-semibold text-gray-900">
                        Personal Information
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputFieldGeneric
                        label="Full Name"
                        type="text"
                        required={true}
                        placeholder="Enter Full Name"
                        SateChange={FullName}
                        setSateChange={setFullName}
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
                      <InputFieldGeneric
                        label="PhoneNo"
                        type="tel"
                        required={true}
                        placeholder="Enter PhoneNo"
                        SateChange={PhoneNo}
                        setSateChange={setPhoneNo}
                        disabled={false}
                      />
                    </div>
                  </div>
                )}
                {currentStep === 1 && (
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Truck className="w-5 h-5 text-gray-900" />
                      <h2 className="text-lg font-semibold text-gray-900">
                        Shipping Information
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DropDownList
                        label="Country "
                        placeholder="Enter Country"
                        required={true}
                        value={countryName}
                        onChange={setCountryName}
                        filedID={setCountryID}
                        options={countryData.map((item) => ({
                          label: item.countryName,
                          value: item.countryName,
                          id: item.countryID,
                        }))}
                      />
                      <DropDownList
                        label="States"
                        placeholder="Enter States"
                        required={true}
                        value={StateName}
                        onChange={setStateName}
                        filedID={setStateID}
                        options={StateData?.map((item) => ({
                          label: item.name || "",
                          value: item.name || "",
                          id: item.name || "",
                        }))}
                      />
                      <DropDownList
                        label="Cities"
                        placeholder="Enter Cities"
                        required={true}
                        value={CityName}
                        onChange={setCityName}
                        filedID={setCityID}
                        options={cityData?.map((item) => ({
                          label: item || "",
                          value: item || "",
                          id: item || "",
                        }))}
                      />
                      <InputFieldGeneric
                        label="Street Address"
                        type="text"
                        required={false}
                        placeholder="Enter Street Address"
                        SateChange={StreetAddress}
                        setSateChange={setStreetAddress}
                        disabled={false}
                      />
                      <InputFieldGeneric
                        label="Zip Code"
                        type="text"
                        required={false}
                        placeholder="Enter Zip Code"
                        SateChange={ZipCode}
                        setSateChange={setZipCode}
                        disabled={false}
                      />
                    </div>
                  </div>
                )}
                {/* Navigation Buttons */}
                <div className="w-full p-2 flex justify-between">
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className={`
            px-6 py-2 rounded-lg font-medium transition-all
            ${
              currentStep === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }
          `}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentStep === steps.length - 1}
                    className={`
            px-6 py-2 rounded-lg font-medium transition-all
            ${
              currentStep === steps.length - 1
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }
          `}
                  >
                    {currentStep === steps.length - 1 ? "Place Order" : "Next"}
                  </button>
                </div>
              </div>
            </div>
            <div className="lg:w-96">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.name}
                        </h4>
                        {item.variant && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.variant}
                          </p>
                        )}
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            ${(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">
                      ${subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">
                      {shipping === 0
                        ? "Free"
                        : `$${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated Tax</span>
                    <span className="text-gray-900">
                      ${tax.toLocaleString()}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-gray-900">
                      <span>Total</span>
                      <span className="text-lg">${total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Truck className="w-4 h-4" />
                    <span>Estimated Delivery</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {shipping === 0
                      ? "Free Express Shipping"
                      : "Standard Shipping"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Delivery in 3-5 business days
                  </p>
                </div>

                {/* Secure Checkout Badge */}
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Secure Checkout • SSL Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
