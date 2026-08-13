import FreeGetCityApi from "@/app/api/Controller/AdminController/FreeApis/CityListApi";
import FreeGetStateApi from "@/app/api/Controller/AdminController/FreeApis/GetStateListApi";
import GetCountryApi from "@/app/api/Controller/AdminController/Shipment/Country/CountryGet";
import CustomerShippingDetailAdd from "@/app/api/Controller/Customer/CheckOut/AddShippingDetail";
import CustomerDeliveryStandardGet from "@/app/api/Controller/Customer/CheckOut/DelieverySatandrd";
import CustomerShippingDetailGet from "@/app/api/Controller/Customer/CheckOut/GetShippingDetail";
import CustomerOrderAdd from "@/app/api/Controller/Customer/CheckOut/OrderPlacementCustomer";
import CustomerPaymentMethodGet from "@/app/api/Controller/Customer/CheckOut/PaymentMethodFetch";
import {
  PaymentMethod,
  RequestPaymetnOptions,
  ResposnepaymentMethod,
} from "@/app/api/Types/AdminSetting/PaymentMethod/paymentMethod";
import {
  GetResponseShippingDeatail,
  shippingDeatilCustoemr,
} from "@/app/api/Types/Customer/CheckOut/ShippingDeatail";
import { CartData } from "@/app/api/Types/Customer/Cookies/Cart";
import { ProductSectionHomePage } from "@/app/api/Types/Customer/ProductSectionHomePage";
import {
  countryList,
  GetCountryListResponse,
} from "@/app/api/Types/Shipment/Country";
import {
  DelievryDataStandard,
  ResponpseDelievryStandard,
} from "@/app/api/Types/Shipment/DelievryStandard";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import GenericRadio from "@/app/ui/RadioButton/RadioButton";
import MessagePopUp from "@/app/ui/UseFulLComponent/ResponseMessage/ResponseMessage";
import { useAppContext } from "@/app/useContext";
import {
  Box,
  Building2,
  Calendar,
  Check,
  Clock,
  CreditCard,
  HomeIcon,
  Mail,
  MapPin,
  Percent,
  Phone,
  Plus,
  Shield,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  User,
  X,
  Zap,
} from "lucide-react";
import { navigate } from "next/dist/client/components/segment-cache/navigation";
import Link from "next/link";
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
interface GetProductFromCookies {
  productID: string;
  productName: string;
  discount: number;
  image: string;
  attributeID: string;
  variantValue: string;
  storeID: string;
  storeName: string;
  weight: number;
  price: number;
  qty: number;
}
interface MainCointentPageProps {
  setLoggedIn: (data: boolean) => void;
}
export default function MainContentPage({
  setLoggedIn,
}: MainCointentPageProps) {
  const { ProductData } = useAppContext();
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
  const [PaymentMethod, setPaymentMethod] = useState<PaymentMethod[]>([]);
  const [PaymentMethodOption, setPaymentMethodOption] = useState<
    RequestPaymetnOptions[]
  >([]);
  const [productItem2, setProductItem2] = useState<GetProductFromCookies[]>([]);
  const [cityData, setCityData] = useState([]);
  const [StreetAddress, setStreetAddress] = useState("");
  const [PaymentID, setPaymentID] = useState("");
  const [selected, setSelected] = useState("");
  const [OptionID, setOptionID] = useState("");
  const [selected2, setSelected2] = useState("");
  const [ZipCode, setZipCode] = useState("");
  const steps = ["Personal / Shipping", "Payment"];
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [orderDate, setOrderDate] = useState("");
  const [PurcahseAdd, setPurcahseAdd] = useState("Home");
  const [showAddForm, setShowAddForm] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<
    shippingDeatilCustoemr[]
  >([]);
  const [DelievryDataStandard, setDelievryDataStandard] = useState<
    DelievryDataStandard[]
  >([]);
  const [DelievryName, setDelievryName] = useState("");
  const [delievryID, setDelievryID] = useState("");

  const [loading, setLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [orderType, setOrderType] = useState("now");
  const resetFunction = () => {
    setFullName("");
    setCityID("");
    setCityName("");
    setStateID("");
    setStateName("");
    setCountryID("");
    setCountryName("");
    setStreetAddress("");
    setZipCode("");
    setEmail("");
    setPhoneNo("");
  };

  const handleAddNewAddress = () => {
    setShowAddForm(!showAddForm);
    setSelectedAddressId("");
  };
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

  const subtotal = productItem2.reduce(
    (sum, item) =>
      sum +
      (item.price * item.qty - (item.price * item.qty * item.discount) / 100),
    0,
  );
  useEffect(() => {
    const storedItems = localStorage.getItem("checkoutItems");
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        if (!Array.isArray(parsedItems)) {
          console.error("checkoutItems is not an array:", parsedItems);
          setProductItem2([]);
          return;
        }
        const item = filterItem(parsedItems, ProductData);
        setProductItem2(item);
        console.log(item);
      } catch (error) {
        console.error("Failed to parse checkout items:", error);
        setProductItem2([]);
      }
    } else {
      setProductItem2([]);
    }
  }, [ProductData]);

  const filterItem = (
    cartItem: CartData[] | null | undefined,
    productList: ProductSectionHomePage[],
  ) => {
    const result: any[] = [];
    cartItem?.forEach((carItem) => {
      productList.forEach((product) => {
        product.variants.forEach((varient) => {
          if (carItem.attributeID === varient.varientID) {
            result.push({
              productID: product.productID,
              storeID: product.storeID,
              discount: product.discount,
              storeName: product.storeName,
              productName: product.productName,
              image: varient.images[0].url,
              attributeID: varient.varientID,
              weight: product.weight,
              variantValue: varient.values
                .map((item) => item.varientValue)
                .join(" - "),
              price: varient.salePrice,
              qty: carItem.qty,
            });
          }
        });
      });
    });
    return result;
  };
  const shipping = subtotal > 500 ? 0 : 9.99;
  const tax = subtotal * 0.1;
  const discount = 0;

  const extraCharges = PaymentMethodOption.filter(
    (item) => item.optionID === OptionID,
  ).reduce((sum, item) => {
    const data = sum + (subtotal * item.percentage) / 100;
    if (data > item.maxThreshold) {
      return item.maxThreshold;
    }
    return data;
  }, 0);
  const total = subtotal + extraCharges;
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

  const Standardget = async () => {
    const response = await CustomerPaymentMethodGet();
    if (response.status == 200) {
      const data = response.data as ResposnepaymentMethod;
      setPaymentMethod(data.paymentMethod);
      setPaymentID(data.paymentMethod[0].paymentID);
      setSelected(data.paymentMethod[0].bankName);
    } else {
      setPaymentMethod([]);
    }
  };
  const GetShipingDetail = async () => {
    const token = localStorage.getItem("customerToken");
    const response = await CustomerShippingDetailGet(String(token));
    if (response.status === 200) {
      const data2 = response.data as GetResponseShippingDeatail;
      setSavedAddresses(data2.shippingDeatil);
      setSelectedAddressId(data2.shippingDeatil[0].shippingDetailID);
    } else {
      setSavedAddresses([]);
    }
    if (response.status === 401) {
      setLoggedIn(true);
    }
  };
  const GetDelievryStandardGet = async () => {
    const response = await CustomerDeliveryStandardGet();
    if (response.status === 200) {
      const data2 = response.data as ResponpseDelievryStandard;
      setDelievryDataStandard(data2.delievryData);
      setDelievryID(data2.delievryData[0].deliveryTypeID);
      setDelievryName(data2.delievryData[0].typeName);
    } else {
      setDelievryDataStandard([]);
    }
    if (response.status === 401) {
      setLoggedIn(true);
    }
  };
  const AddShipingDetail = async () => {
    try {
      setLoading(true);
      if (
        !FullName ||
        !Email ||
        !PhoneNo ||
        !countryName ||
        !StateName ||
        !CityName ||
        !ZipCode ||
        !StreetAddress
      )
        return alert("Please Fill in all field with *");
      const country = countryData.find(
        (item) => item.countryName === countryName,
      );
      if (!country) return alert("Please Enter a valid Country Name");
      const state = StateData.find((item) => item.name === StateName);
      if (!state) return alert("Please Enter a valid State Name");
      const City = cityData.find((item) => item === CityName);
      if (!City) return alert("Please Enter a valid City Name");
      else {
        const token = localStorage.getItem("customerToken");
        const formData = {
          address:
            countryName +
            " /n " +
            StateName +
            " /n " +
            CityName +
            " /n " +
            StreetAddress +
            " /n " +
            ZipCode,
          phoneNo: PhoneNo,
          email: Email,
          fullName: FullName,
          deliverAt: PurcahseAdd,
        };
        //console.log(formData);
        const response = await CustomerShippingDetailAdd(
          formData,
          String(token),
        );
        if (response.status === 200) {
          window.scrollTo({
            top: 10,
            left: 10,
            behavior: "smooth",
          });
          GetShipingDetail();
          setShowAddForm(false);
          resetFunction();
        }
        if (response.status === 401) {
          setLoggedIn(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  const AddOrder = async () => {
    try {
      const token = localStorage.getItem("customerToken");
      const formData = {
        shippingDetailID: selectedAddressId,
        deliveryTypeID: delievryID,
        paymentStatus: "unPaid",
        paymentMethod: selected,
        additionalCharges: extraCharges,
        shippingCharges: 250,
        orderDate:
          orderType === "now"
            ? new Date().toISOString().split("T")[0]
            : orderDate,
        totalBill: total,
        amountPaid: 0,
        orderDetail: productItem2.map((item) => ({
          varientID: item.attributeID,
          qty: item.qty,
          rate: item.price - (item.price * item.discount) / 100,
        })),
      };
      const response = await CustomerOrderAdd(formData, String(token));
      if (response.status === 200) {
        setShowMessage(response.data);
        setMessageType("success");
        localStorage.removeItem("checkoutItems");
        window.location.href = "/";
      } else {
        setShowMessage(response.data);
        setMessageType("error");
      }
    } finally {
    }
  };

  useEffect(() => {
    if (PaymentID) {
      const data = PaymentMethod.find((item) => item.paymentID === PaymentID);
      if (data) {
        setOptionID(data.paymentOption[0].optionID || "");
        setSelected2(data.paymentOption[0].optionName || "");
        setPaymentMethodOption(data.paymentOption);
      } else {
        setPaymentMethodOption([]);
      }
    }
  }, [PaymentID]);

  useEffect(() => {
    getCountries();
    Standardget();
    GetShipingDetail();
    GetDelievryStandardGet();
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
      {showMessage && (
        <MessagePopUp
          message={showMessage}
          type={messageType}
          duration={3000}
          onClose={() => setShowMessage(null)}
        />
      )}
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
          <div className="flex flex-col lg:flex-row gap-8 mt-10">
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {currentStep === 0 && (
                  <>
                    <div className="p-6 max-w-7xl mx-auto">
                      {/* Header Section with Progress Indicator */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500 rounded-lg">
                              <Truck className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h2 className="text-xl font-semibold text-gray-900">
                                Shipping Address
                              </h2>
                              <p className="text-sm text-gray-500">
                                Select or add a shipping address
                              </p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                            Step 1 of 2
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full transition-all duration-500"
                            style={{ width: "50%" }}
                          />
                        </div>
                      </div>

                      {/* Address Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                        {/* Saved Address Cards */}
                        {savedAddresses.map((address) => (
                          <div
                            key={address.shippingDetailID}
                            onClick={() => {
                              setSelectedAddressId(address.shippingDetailID);
                              setShowAddForm(false);
                              resetFunction();
                            }}
                            className={`group relative border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                              selectedAddressId ===
                              String(address.shippingDetailID)
                                ? "border-purple-600  shadow-xl scale-[1.02]"
                                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg hover:scale-[1.01]"
                            }`}
                          >
                            {/* Selection Badge */}
                            {selectedAddressId ===
                              String(address.shippingDetailID) && (
                              <div className="absolute -top-3 -right-3 z-10 animate-in fade-in zoom-in duration-200">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                                  <Check
                                    className="w-4 h-4 text-white"
                                    strokeWidth={3}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Address Content */}
                            <div className="flex items-start gap-4">
                              {/* Avatar/Icon */}
                              <div
                                className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                  selectedAddressId ===
                                  String(address.shippingDetailID)
                                    ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25"
                                    : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700"
                                }`}
                              >
                                <User className="w-5 h-5" />
                              </div>

                              <div className="flex-1 min-w-0 space-y-2">
                                {/* Header with Deliver At Badge */}
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-3">
                                    <p className="font-semibold text-gray-900 text-lg truncate">
                                      {address.address.split("/n")[3] ||
                                        "Recipient"}
                                    </p>
                                    {/* {address.isDefault && (
                                      <span className="flex-shrink-0 text-xs font-medium bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                        Default
                                      </span>
                                    )} */}
                                  </div>
                                  {/* Deliver At Badge */}
                                  <span
                                    className={`flex-shrink-0 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 ${
                                      address.deliverAt === "Home"
                                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                                        : "bg-orange-50 text-orange-700 border border-orange-200"
                                    }`}
                                  >
                                    {address.deliverAt === "Home" ? (
                                      <HomeIcon className="w-3 h-3" />
                                    ) : (
                                      <Building2 className="w-3 h-3" />
                                    )}
                                    {address.deliverAt || "Other"}
                                  </span>
                                </div>

                                {/* Address Details */}
                                <div className="space-y-1 text-sm text-gray-600">
                                  <p className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="truncate">
                                      {address.address.split("/n")[2]},{" "}
                                      {address.address.split("/n")[1]}
                                    </span>
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <HomeIcon className="w-4 h-4 text-gray-400" />
                                    <span className="truncate">
                                      {address.address.split("/n")[0]} -{" "}
                                      {address.address.split("/n")[4]}
                                    </span>
                                  </p>
                                </div>

                                {/* Contact Info */}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 border-t border-gray-100">
                                  <p className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    {address.phoneNo}
                                  </p>
                                  <p className="flex items-center gap-1.5 text-sm text-gray-400">
                                    <Mail className="w-4 h-4 text-gray-300" />
                                    {address.email}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Hover Effect Glow */}
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent rounded-2xl" />
                            </div>

                            {/* Click Ripple Effect */}
                            {selectedAddressId ===
                              String(address.shippingDetailID) && (
                              <div className="absolute -inset-0.5 rounded-2xl  blur-xl -z-10 animate-pulse" />
                            )}
                          </div>
                        ))}
                        {/* Add New Address Card - Enhanced */}
                        <div
                          onClick={handleAddNewAddress}
                          className={`group relative border-2 border-dashed rounded-xl p-5 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-center min-h-[220px] ${
                            showAddForm
                              ? "border-gray-900 bg-gray-50 shadow-lg"
                              : "border-gray-300 hover:border-gray-500 hover:bg-gray-50/50"
                          }`}
                        >
                          <div
                            className={`p-3 rounded-full transition-all duration-300 ${
                              showAddForm
                                ? "bg-purple-500 text-white"
                                : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600"
                            }`}
                          >
                            <Plus className="w-8 h-8" />
                          </div>
                          <span className="text-sm font-medium text-gray-600 mt-3 group-hover:text-gray-900 transition-colors">
                            {showAddForm
                              ? "Adding New Address"
                              : "Add New Address"}
                          </span>
                          <span className="text-xs text-gray-400 mt-1">
                            Click to add a new shipping address
                          </span>
                        </div>
                      </div>

                      {/* Add Address Form - Animated Slide Down */}
                      {showAddForm && (
                        <div className="mt-6  rounded-xl flex flex-col  border border-gray-200 shadow-lg overflow-hidden transition-all duration-300 animate-slideDown">
                          {/* Form Header */}
                          <div className="p-6  border border-gray-100">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500 rounded-lg">
                                  <User className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-sm font-semibold text-gray-900">
                                    Add Personal Information
                                  </h3>
                                  <p className="text-xs text-gray-500">
                                    Fill in the details below
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="m-2">
                              <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Shipping Address
                              </label>

                              <div className="flex gap-5">
                                <GenericRadio
                                  label="Home"
                                  name="Purchase"
                                  value="Home"
                                  checked={PurcahseAdd === "Home"}
                                  onChange={setPurcahseAdd}
                                />

                                <GenericRadio
                                  label="Office"
                                  name="Purchase"
                                  value="Office"
                                  checked={PurcahseAdd === "Office"}
                                  onChange={setPurcahseAdd}
                                />
                              </div>
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
                                label="Phone No"
                                type="tel"
                                required={true}
                                placeholder="Enter Phone No"
                                SateChange={PhoneNo}
                                setSateChange={setPhoneNo}
                                disabled={false}
                              />
                            </div>
                          </div>
                          <div className="p-6 border border-gray-100">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500 rounded-lg">
                                  <Box className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-sm font-semibold text-gray-900">
                                    Add New Shipping
                                  </h3>
                                  <p className="text-xs text-gray-500">
                                    Fill in the details below
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="p-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DropDownList
                                  label="Country"
                                  placeholder="Select Country"
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
                                  label="State"
                                  placeholder="Select State"
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
                                  label="City"
                                  placeholder="Select City"
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
                                  required={true}
                                  placeholder="Enter Street Address"
                                  SateChange={StreetAddress}
                                  setSateChange={setStreetAddress}
                                  disabled={false}
                                />
                                <InputFieldGeneric
                                  label="Zip Code"
                                  type="text"
                                  required={true}
                                  placeholder="Enter Zip Code"
                                  SateChange={ZipCode}
                                  setSateChange={setZipCode}
                                  disabled={false}
                                />
                              </div>

                              {/* Form Actions */}
                              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                                <button
                                  onClick={() => AddShipingDetail()}
                                  className="px-6 py-2.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 transform hover:scale-[1.02] shadow-sm hover:shadow-md flex items-center gap-2"
                                >
                                  <Check size={15} />
                                  {loading ? "Saving..." : " Save Address"}
                                </button>
                                <button
                                  onClick={() => {
                                    window.scrollTo({
                                      top: 10,
                                      left: 10,
                                      behavior: "smooth",
                                    });
                                    setShowAddForm(false);
                                    resetFunction();
                                  }}
                                  className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                                >
                                  <X size={15} />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
                {currentStep === 1 && (
                  <div className="p-6">
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500 rounded-lg">
                            <CreditCard className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                              Payment Information
                            </h2>
                            <p className="text-sm text-gray-500">
                              Select a Payment Method
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                          Step 2 of 2
                        </span>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full transition-all duration-500 smooth"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                    <div className="w-full mt-5">
                      <h2 className="text-lg font-medium  mb-2">
                        Delivery Method
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {DelievryDataStandard.map((method) => (
                          <label
                            key={method.deliveryTypeID}
                            className={`flex items-center justify-between border rounded-md p-3 cursor-pointer transition-all duration-200 ${
                              DelievryName === method.typeName
                                ? "border-gray-400 bg-gray-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name="delievry"
                                checked={DelievryName === method.typeName}
                                onChange={() => {
                                  setDelievryID(method.deliveryTypeID);
                                  setDelievryName(method.typeName);
                                }}
                                className="text-gray-500 focus:ring-gray-500"
                              />
                              <div className="flex flex-col">
                                <span
                                  className={`font-medium text-sm ${
                                    DelievryName === method.typeName
                                      ? "text-gray-600"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {method.typeName.toUpperCase()}
                                </span>
                                <div className="flex items-center gap-3 mt-0.5">
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    <span>{method.numberofDays} days</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                      <h2 className="text-lg font-medium mt-2 mb-2">
                        Payment Method
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {PaymentMethod.map((method) => (
                          <label
                            key={method.paymentID}
                            className={`flex items-center justify-between border rounded-md p-3 cursor-pointer transition-all duration-200 ${
                              selected === method.bankName
                                ? "border-gray-400 bg-gray-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name="payment"
                                checked={selected === method.bankName}
                                onChange={() => {
                                  setPaymentID(method.paymentID);
                                  setSelected(method.bankName);
                                }}
                                className="text-gray-500 focus:ring-gray-500"
                              />
                              <span
                                className={`font-medium text-sm ${
                                  selected === method.bankName
                                    ? "text-gray-600"
                                    : "text-gray-700"
                                }`}
                              >
                                {method.bankName.toUpperCase()}
                              </span>
                            </div>
                          </label>
                        ))}
                        {PaymentMethodOption[0]?.iconUrl !== "" && (
                          <div className="w-full ">
                            <h2 className="text-md font-medium">
                              Select Method
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {PaymentMethodOption.map((method, index) => (
                                <label
                                  key={index}
                                  className={`flex items-center justify-between border rounded-md p-3 cursor-pointer transition-all duration-200 ${
                                    selected2 === method.optionName
                                      ? "border-gray-400 bg-gray-50"
                                      : "border-gray-200 hover:border-gray-300"
                                  }`}
                                >
                                  <div className="flex items-center space-x-3 ">
                                    <input
                                      type="radio"
                                      name="option"
                                      checked={selected2 === method.optionName}
                                      onChange={() => {
                                        setOptionID(method.optionID || "");
                                        setSelected2(method.optionName);
                                      }}
                                      className="text-gray-500 focus:ring-gray-500"
                                    />
                                    <span
                                      className={`font-medium text-sm ${
                                        selected2 === method.optionName
                                          ? "text-gray-600"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <img
                                          src={method.iconUrl}
                                          className="w-10"
                                        />
                                        {method.optionName.toUpperCase()}
                                      </div>
                                    </span>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
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
                    onClick={() => {
                      if (currentStep === 0) {
                        handleNext();
                      }
                      if (currentStep === 1) {
                        AddOrder();
                      }
                    }}
                    className={`
                    px-6 py-2 rounded-lg font-medium transition-all
                    ${
                      !selectedAddressId
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : currentStep === 1
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                    }
                  `}
                  >
                    {currentStep === 1 ? "Place Order" : "Next"}
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
                  {productItem2.map((item) => (
                    <Link href={`/subMenu/Product/${item.productID}`}>
                      <div
                        key={item.attributeID}
                        className=" relative bg-gray-50 border border-gray-100 flex gap-4 p-3 rounded-xl  hover:bg-gray-100 transition-all duration-300 cursor-pointer hover:border-gray-200"
                      >
                        {/* Product Image */}
                        <div className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Discount Badge - Enhanced */}
                          {item?.discount && item.discount > 0 && (
                            <div className="absolute top-1 right-1">
                              <div className="relative">
                                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-0.5">
                                  {item.discount}%
                                </div>
                                <div className="absolute -inset-0.5 bg-red-500/20 blur-sm rounded-full -z-10" />
                              </div>
                            </div>
                          )}

                          {/* Quantity Badge */}
                          <div className="absolute -bottom-1 -left-1 bg-white shadow-md rounded-full w-5 h-5 flex items-center justify-center border border-gray-200">
                            <span className="text-[10px] font-bold text-gray-600">
                              {item.qty}
                            </span>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 line-clamp-2  transition-colors">
                                {item.productName}
                              </h4>
                              {item.variantValue && (
                                <div className="flex items-center gap-1 mt-0.5">
                                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                                  <p className="text-xs text-gray-500 uppercase font-medium">
                                    {item.variantValue}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Remove Button - on hover */}
                            {/* <button
                              onClick={() => handleRemoveItem(item.attributeID)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button> */}
                          </div>

                          {/* Price and Details */}
                          <div className="flex flex-wrap items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <ShoppingBag className="w-3 h-3" />
                                Qty: {item.qty}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-900">
                                {(
                                  item.price * item.qty -
                                  (item.price *
                                    item.qty *
                                    (item.discount || 0)) /
                                    100
                                ).toLocaleString()}
                              </span>
                              {item.discount > 0 && (
                                <span className="text-xs text-gray-400 line-through">
                                  {(item.price * item.qty).toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-transparent rounded-xl" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-6 space-y-3">
                  {/* Divider */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <span className="font-medium">Choose Order Type</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          setOrderDate("");
                          setOrderType("now");
                        }}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all duration-300 ${
                          orderType === "now"
                            ? "border-gray-600 bg-gray-50 shadow-md "
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${orderType === "now" ? "text-gray-700" : "text-gray-700"}`}
                        >
                          Order Now
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setOrderDate("");
                          setOrderType("prebook");
                        }}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all duration-300 ${
                          orderType === "prebook"
                            ? "border-gray-500 bg-gray-50 shadow-md "
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${orderType === "prebook" ? "text-gray-700" : "text-gray-700"}`}
                        >
                          Pre-Book
                        </span>
                      </button>
                    </div>
                  </div>
                  {orderType === "prebook" && (
                    <input
                      value={orderDate}
                      onChange={(e) => setOrderDate(e.target.value)}
                      type="date"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                          focus:outline-none focus:ring-2 focus:ring-blue-500
                          focus:border-blue-500"
                    />
                  )}
                </div>
                {/* Price Breakdown */}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">
                      {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">
                      {shipping === 0 ? "Free" : `${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  {extraCharges > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Extra Charges</span>
                      <span className="text-gray-900">
                        {extraCharges.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-gray-900">
                      <span>Total</span>
                      <span className="text-lg">{total.toLocaleString()}</span>
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
