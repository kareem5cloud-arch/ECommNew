"use client";
import { useEffect, useState } from "react";

import { Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Footer from "@/component/Footer/page";
import Navbar from "@/component/Navbar/page";
import { useRouter } from "next/navigation";
import { CartData } from "@/api/types/Cart/CartData";
import {
  paymentget,
  paymentgetApiResponse,
} from "@/api/types/payment/getpayment";
import GetPayment from "@/api/lib/payment/getPayment/getPayment";
import GetCustomerLoginData from "@/api/lib/HomePage/CustomerData/CustomerGet";
import { CustomerDetailResponse } from "@/api/types/HomePage/CustomerData/Customerdata";
import GetPaymentCustomer from "@/api/lib/CheckOut/payment/payment";
import GetCountry from "@/api/lib/country/countryList/countryListGet";
import {
  Countryget,
  CountrygetApiResponse,
} from "@/api/types/country/countryget";
import axios from "axios";
import GetRates from "@/api/lib/Shippment/ShippmentRate/GetShimentRates";
import {
  informationList,
  requestAddStoreToGetRate,
  shiipingInformation,
  stores,
} from "@/api/types/Shippment/Rates/rates";
import AddOrder from "@/api/lib/Order/AddCustomerOrder";
import { removeItemFromServerCart } from "@/api/lib/Cart/AddCart";

export default function CheckOut() {
  const router = useRouter();
  const [activePage, setActivePage] = useState("login");
  const [paymentID, setPaymentID] = useState("");
  const [selected, setSelected] = useState("COD");
  const [isShow, setIsShow] = useState(false);
  const [cartList, setCartList] = useState<CartData[]>([]);
  const [selectedOption2, setSelectedOption2] = useState("PlaceOrder");
  const [orderDate, setOrderDate] = useState("");
  const [paymentList, setPaymentList] = useState<paymentget[]>([]);
  const [accountTitle, setAccountTitle] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [fullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [country, setCountry] = useState("");
  const [City, setCity] = useState("");
  const [PostalCode, setPostalCode] = useState("");
  const [Address, setAddress] = useState("");
  const [customerID, setCustomerID] = useState("");
  const [countryID, setCountryID] = useState("");
  const [token, setToken] = useState("");
  const [Countries, setCountries] = useState<Countryget[]>([]);
  const [storePayload, setStorePayload] =
    useState<requestAddStoreToGetRate | null>(null);
  const [ConfirmationBox, setConfirmationBox] = useState(false);

  const [isTrue, setIsTrue] = useState(false);
  const [responseBack, setResponseBack] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const [shippingListInformation, setShippingListInformation] = useState<
    informationList[]
  >([]);

  const [CityList, setCityList] = useState([]);
  const [cityName, setCityName] = useState("");

  const [promoCode, setPromoCode] = useState("PlaceOrder");

  useEffect(() => {
    const data = localStorage.getItem("token1");
    setToken(data || "");
  }, []);
  const onClear = async () => {};

  useEffect(() => {
    getCountry();
    getCustomer();
    getpayment();

    const data = localStorage.getItem("checkoutItems");
    if (data) {
      const parsedCart = JSON.parse(data);
      setCartList(parsedCart);

      const payload: requestAddStoreToGetRate = {
        storeList: parsedCart.map((item: { storeID: string }) => ({
          storeID: item.storeID,
        })),
      };

      setStorePayload(payload);
    }
  }, []);

  const getpayment = async () => {
    const response = await GetPaymentCustomer();
    if (response.status === 200 || response.status == 201) {
      const data = response.data as paymentgetApiResponse;
      setPaymentID(data.paymentMethod[0].paymentID);
      setPaymentList(data.paymentMethod);
    } else {
      console.log();
    }
  };
  const fetchData = (ID: string) => {
    const data = paymentList.find((item) => item.paymentID === ID);
    if (data) {
      setAccountTitle(data.accountTitle);
      setAccountNumber(data.accountNumber);
      setBankName(data.bankName);
    }
  };
  //
  const getCustomer = async () => {
    const token = localStorage.getItem("token1");
    const response = await GetCustomerLoginData(String(token), {});
    if (response.status === 200 || response.status == 201) {
      const data = response.data as CustomerDetailResponse;
      setCustomerID(data.customerData[0].userID);
      setFullName(data.customerData[0].customerName);
      setEmail(data.customerData[0].email);
      setPhoneNo(data.customerData[0].phoneNo);
    } else {
      console.log();
    }
  };
  const getCountry = async () => {
    const token = localStorage.getItem("token");
    const response = await GetCountry(String(token), {});
    if (response.status === 200 || response.status == 201) {
      const data = response.data as CountrygetApiResponse;
      setCountries(data.countryList);
      setCountryID(data.countryList[0].countryID);
    } else {
      console.log();
    }
  };
  const getCities = async (name: string) => {
    const response = await axios.post(
      `https://countriesnow.space/api/v0.1/countries/cities`,
      {
        country: name,
      },
    );
    if (response.status === 200) {
      setCityList(response.data.data);
    } else {
      setCityList([]);
    }
  };

  const addOrder = async () => {
    try {
      setisLoading(true);

      const formData = {
        customerName: fullName,
        phoneNo: PhoneNo,
        shippingAddress: Address,
        email: Email,
        city: cityName,
        country: countryID,
        postalCode: PostalCode,

        orderMainList: [
          {
            orderDate:
              selectedOption2 === "PlaceOrder"
                ? new Date().toISOString()
                : orderDate,
            paymentID: paymentID,
            paymentStatus: "Unpaid",
            orderMethod: selectedOption2,
            delievryCharges:
              getTotalShipping(cartList, shippingListInformation) || 0.0,
            shippingAddress: countryID + " " + cityName + " " + Address,
            couponDiscount: 0,
            totalBill:
              getCartSubTotal(cartList) +
              getTotalShipping(cartList, shippingListInformation),
            couponNumber: "",

            orderListSub: cartList.map((item) => ({
              productID: item.productID,
              qty: item.quantity,
              orignalPrice: item.salePrice,
              salePrice:
                (item.salePrice - (item.salePrice * item.discount) / 100) *
                item.quantity,
              discount: item.discount, // lowercase 'discount' matches interface
              shippingCharges:
                getShippingPrice(item, shippingListInformation) || 0.0,
            })),
          },
        ],
      };
      console.log(formData);
      // const response = await AddOrder(formData);
      // if (response.status === 200 || response.status === 201) {
      //   cartList.map((item) => {
      //     removeItemFromServerCart(item.productID);
      //   });
      //   localStorage.removeItem("checkoutItems");
      //   setIsTrue(true);
      //   setResponseBack(response.data.message);
      //   setCartList([]);
      //   setAddress("");
      //   setPhoneNo("");
      //   setCountry("");
      //   setCountryID("");
      //   setCity("");
      //   setCityList([]);
      //   setPaymentID("");
      //   setConfirmationBox(true);
      // } else if (response.status === 400) {
      //   setIsTrue(true);
      //   setConfirmationBox(false);
      //   setResponseBack("PLease Fill in Required Fields");
      // } else {
      //   setIsTrue(true);
      //   setConfirmationBox(false);
      //   setResponseBack("Something Went Wrong. Please try again later.");
      // }
    } catch {
      setisLoading(true);
    } finally {
      setisLoading(false);
    }
  };

  const fetch = async (cityName: string) => {
    if (!storePayload) return; // 👈 guard

    const response = await GetRates(cityName, storePayload);
    if (response.status === 200 || response.status === 201) {
      const data = response.data as shiipingInformation;
      console.log(response.data);
      setShippingListInformation(data.informationList);
    } else {
      console.log(response.data);
    }
  };

  const getShippingPrice = (
    cartItem: CartData,
    shippingRates?: informationList[] | null,
  ): number => {
    if (!shippingRates || shippingRates.length === 0) {
      return 0;
    }

    const rate = shippingRates.find((r) => r.storeID === cartItem.storeID);

    if (!rate) return 0;

    const weight = cartItem.weight * cartItem.quantity;

    if (weight <= 1) return rate.lessThen1KG;
    if (weight <= 5) return rate.lessThen5KG;
    return rate.greaterThen10KG;
  };

  const getTotalShipping = (
    cartList: CartData[],
    shippingRates?: informationList[] | null,
  ): number => {
    if (!shippingRates || shippingRates.length === 0) return 0;

    return cartList.reduce((total, item) => {
      return total + getShippingPrice(item, shippingRates);
    }, 0);
  };
  const getCartSubTotal = (cartList: CartData[]): number => {
    return cartList.reduce((total, item) => {
      const priceAfterDiscount =
        Number(item.salePrice) - (Number(item.salePrice) * item.discount) / 100;

      const itemTotal = priceAfterDiscount * Number(item.quantity);

      return total + itemTotal;
    }, 0);
  };

  const DURATION = 5;
  const [timeLeft, setTimeLeft] = useState(DURATION);
  useEffect(() => {
    if (!ConfirmationBox) return;

    setTimeLeft(DURATION);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [ConfirmationBox, router]);
  const progressPercentage = (timeLeft / DURATION) * 100;
  return (
    <>
      {ConfirmationBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center animate-fadeIn">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-3xl">
                ✓
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800">Thank You!</h2>

            {/* Message */}
            <p className="text-gray-500 mt-2">
              Your action was completed successfully. You will be redirected
              shortly.
            </p>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Redirecting in {timeLeft}s
              </p>
            </div>

            {/* Optional Button */}
            <button
              onClick={() => router.push("/")}
              className="mt-6 px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              Go Now
            </button>
          </div>
        </div>
      )}
      {/* <Navbar onPageChange={setActivePage} /> */}
      <Navbar
        onPageChange={(page) => console.log("Navigate to:", page)}
        SubCategoryID={(page) => console.log("Navigate to:", page)}
        onCategoriesLoaded={(categories) => {
          categories;
        }}
        cartList={cartList} // Pass full cartList, not just length
        setCartList={setCartList} // Pass setter so Navbar can update
        onClear={onClear} // Pass clear handler
      />
      {/* MAIN CONTENT */}
      <div className="flex flex-col items-center w-full min-h-[calc(100vh-200px)] bg-gray-100 px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">CheckOut</h1>
        <hr className="w-1/2 border-gray-300 mt-6 mb-10" />
        <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 🧾 Left Column - Forms */}

            <div className="lg:col-span-2 space-y-6">
              {/* Account Details */}
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                  Account Details
                </h2>
                <div className="p-2 rounded-xl max-w-md">
                  <h2 className="text-sm text-gray-800 font-medium mb-2">
                    Order Management
                  </h2>

                  <div className="flex flex-wrap  gap-4 ">
                    {/* Option 1 */}
                    <label className="text-sm text-gray-600 font-medium">
                      <input
                        type="radio"
                        name="StoreSale"
                        value="AdvanceBooking"
                        checked={selectedOption2 === "AdvanceBooking"}
                        onChange={(e) => setSelectedOption2("AdvanceBooking")}
                        className="w-3 h-3 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700 text-sm font-medium">
                        Advance Booking
                      </span>
                    </label>

                    {/* Option 2 */}
                    <label className="text-sm text-gray-600 font-medium">
                      <input
                        type="radio"
                        name="StoreSale"
                        value="PlaceOrder"
                        checked={selectedOption2 === "PlaceOrder"}
                        onChange={(e) => setSelectedOption2("PlaceOrder")}
                        className="w-3 h-3 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700 text-sm font-medium">
                        Place Order
                      </span>
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 font-medium">
                      Full Name
                    </label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      type="text"
                      placeholder="Your Name"
                      className="w-full mt-1 p-2 text-sm  border border-gray-200  rounded-md focus:ring-2 focus:ring-black/60 outline-none"
                    />
                  </div>
                  {!token ? (
                    <div>
                      <label className="text-sm text-gray-600 font-medium">
                        Email
                      </label>
                      <input
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Your Email"
                        className="w-full mt-1 p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-black/60 outline-none"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="text-sm text-gray-600 font-medium">
                        Email
                      </label>
                      <input
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                        readOnly
                        type="email"
                        placeholder="Your Email"
                        className="w-full mt-1 p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-black/60 outline-none"
                      />
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-600 font-medium">
                      Phone
                    </label>
                    <input
                      value={PhoneNo}
                      onChange={(e) => setPhoneNo(e.target.value)}
                      type="tel"
                      placeholder="+92 300 0000000"
                      className="w-full mt-1 p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-black/60 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Details */}
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                  Shipping Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={countryID}
                      onChange={(e) => {
                        setCountryID(e.target.value);
                        getCities(e.target.value);
                      }}
                      className="w-full px-3 py-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="">Select Country</option>
                      {Countries.map((item) => (
                        <option key={item.countryID} value={item.countryName}>
                          {item.countryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={cityName}
                      onChange={(e) => {
                        setCityName(e.target.value);
                        fetch(e.target.value);
                      }}
                      className="w-full px-3 py-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="">Select City</option>
                      {CityList.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 font-medium">
                      Postal Code
                    </label>
                    <input
                      value={PostalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      type="text"
                      placeholder="00000"
                      className="w-full mt-1 p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-black/60 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 font-medium">
                      Address
                    </label>
                    <input
                      value={Address}
                      onChange={(e) => setAddress(e.target.value)}
                      type="text"
                      placeholder="Street Address"
                      className="w-full mt-1 p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-black/60 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Billing Details */}
              <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                  Payment Method
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paymentList.map((method) => (
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
                          value={paymentID}
                          checked={selected === method.bankName}
                          onClick={() => {
                            setIsShow(true);
                            fetchData(method.paymentID);
                            setPaymentID(method.paymentID);
                          }}
                          onChange={() => setSelected(method.bankName)}
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
                </div>
              </div>
              {/*EasyPaisa Detail*/}
              {paymentID !== "847fbc57-016e-45b6-b9e7-603451f67040" &&
                isShow && (
                  <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">
                      {bankName}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600 font-medium">
                          Account Title
                        </label>
                        <input
                          type="text"
                          value={accountTitle}
                          readOnly
                          className="w-full mt-1 p-2 text-sm  border border-gray-200  rounded-md focus:ring-2 focus:ring-black/60 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 font-medium">
                          Account Number
                        </label>
                        <input
                          readOnly
                          value={accountNumber}
                          className="w-full mt-1 p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-black/60 outline-none"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className=" text-sm text-gray-600 font-medium">
                        Add Receipt
                      </label>
                      <input
                        type="file"
                        className="w-full mt-1 p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-black/60 outline-none"
                      />
                    </div>
                  </div>
                )}
            </div>
            <div className="flex flex-col">
              {selectedOption2 === "AdvanceBooking" ? (
                <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 h-fit">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Advance Booking
                  </h2>

                  <div className="space-y-4 overflow-y-auto  ">
                    {cartList.map((item) => (
                      <div
                        key={item.productID}
                        className="p-4 border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition "
                      >
                        <span className="text-sm text-gray-400">
                          {item.storeName}
                        </span>
                        <hr className="text-gray-300 w-[75%] mb-2 " />
                        <span className="text-md font-bold text-gray-800">
                          {item.productName}
                        </span>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-800">Price</span>
                          <span className="text-sm text-gray-600">
                            {item.salePrice} -/
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-800">
                            Quantity
                          </span>
                          <span className="text-sm text-gray-600">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-800">
                            Discount
                          </span>
                          <span className="text-sm text-gray-600">
                            {item.discount} %
                          </span>
                        </div>
                        <hr className="text-gray-300 w-full mb-2 mt-2  " />
                        <div></div>{" "}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-800">
                            Shipment
                          </span>
                          <span className="text-sm text-gray-600">
                            <span className="text-sm text-gray-600">
                              {getShippingPrice(item, shippingListInformation)}{" "}
                              -/
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-800">
                            SubTotal
                          </span>
                          <span className="text-sm text-gray-600">
                            {Number(item.quantity) *
                              (Number(item.salePrice) -
                                (Number(item.salePrice) * item.discount) / 100)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 border-t border-gray-200 pt-4">
                    <h3 className="text-md font-semibold mb-2">
                      Billing Summary
                    </h3>

                    <div className="text-sm mt-4 space-y-1">
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">
                          Order Date
                        </label>
                        <input
                          value={orderDate}
                          onChange={(e) => setOrderDate(e.target.value)}
                          type="datetime-local"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                          focus:outline-none focus:ring-2 focus:ring-blue-500
                          focus:border-blue-500"
                        />
                      </div>

                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{getCartSubTotal(cartList).toFixed(2)} -/</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Shipping</span>
                        <span>
                          {getTotalShipping(cartList, shippingListInformation)}{" "}
                          -/
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-900">
                        <span>Date/Time</span>
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-gray-900">
                        <span>Total</span>
                        <span>
                          {(
                            getCartSubTotal(cartList) +
                            getTotalShipping(cartList, shippingListInformation)
                          ).toFixed(2)}{" "}
                          -/
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => addOrder()}
                    className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                  >
                    {isLoading ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              ) : (
                <div className="mt-2 bg-white shadow-sm rounded-xl p-6 border border-gray-100 h-fit">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Summary Order
                  </h2>
                  <div className="space-y-4 overflow-y-auto  ">
                    {cartList.map((item) => (
                      <div
                        key={item.productID}
                        className="p-4 border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition "
                      >
                        <span className="text-sm text-gray-400">
                          {item.storeName}
                        </span>
                        <hr className="text-gray-300 w-[75%] mb-2 " />
                        <span className="text-md font-bold text-gray-800">
                          {item.productName}
                        </span>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-800">Price</span>
                          <span className="text-sm text-gray-600">
                            {item.salePrice} -/
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-800">
                            Quantity
                          </span>
                          <span className="text-sm text-gray-600">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-800">
                            Discount
                          </span>
                          <span className="text-sm text-gray-600">
                            {item.discount} %
                          </span>
                        </div>
                        <hr className="text-gray-300 w-full mb-2 mt-2  " />
                        <div></div>{" "}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-800">
                            Shipment
                          </span>
                          <span className="text-sm text-gray-600">
                            <span className="text-sm text-gray-600">
                              {getShippingPrice(item, shippingListInformation)}{" "}
                              -/
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-800">
                            SubTotal
                          </span>
                          <span className="text-sm text-gray-600">
                            {Number(item.quantity) *
                              (Number(item.salePrice) -
                                (Number(item.salePrice) * item.discount) / 100)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 border-t border-gray-200 pt-4">
                    <h3 className="text-md font-semibold mb-2">
                      Billing Summary
                    </h3>

                    <div className="text-sm mt-4 space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{getCartSubTotal(cartList).toFixed(2)} -/</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Total Shipping</span>
                        <span>
                          {getTotalShipping(cartList, shippingListInformation)}{" "}
                          -/
                        </span>
                      </div>

                      <div className="flex justify-between text-gray-900">
                        <span>Date/Time</span>
                        <span>02-Nov-2025 (15-30-00)</span>
                      </div>

                      <div className="flex justify-between font-semibold text-gray-900">
                        <span>Total</span>
                        <span>
                          {(
                            getCartSubTotal(cartList) +
                            getTotalShipping(cartList, shippingListInformation)
                          ).toFixed(2)}{" "}
                          -/
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => addOrder()}
                    className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                  >
                    {isLoading ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
