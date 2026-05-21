"use client";

import { Eye, EyeClosed } from "lucide-react";
import React, { useEffect, useState } from "react";
import LoginApi from "@/api/authentication/login";
import { useRouter } from "next/navigation";
import { create } from "domain";
import SignUpApi from "@/api/authentication/signup";
import CheckAuth from "@/api/authentication/checkAuth";
import LogoutApi from "@/api/authentication/logout";
import SellerVerificationApi from "@/api/authentication/sellerVerification";
import VerifyOtpPage from "./otpVerification/page";
import OtpSend from "@/api/authentication/OtpSend";
import { StoreApiResponse, storeInital } from "@/api/types/storeGet";
import GetInitalStore from "@/api/authentication/StoreGet";
import { useAsync } from "react-select/async";
import { stat } from "fs";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showList, setShowList] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [UserNameSeller, setUserNameSeller] = useState("");
  const [EmailSeller, setEmailSeller] = useState("");
  const [passwordSeller, setPasswordSeller] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phoneNo, setphoneNo] = useState("");

  const [createAccount, setCreateAccount] = useState(false);
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const [storeList, setStoreList] = useState<storeInital[]>([]);
  const [loading, setLoading] = useState(false);
  const [responseBack, setResponseBack] = useState("");
  const [ShowMessage, setShowMessage] = useState(false);
  //Login Function
  const Login = async () => {
    try {
      setLoading(true);
      const formData = { email, password };
      const response = await LoginApi(formData);
      console.log("Response from Login API:", response);
      if (response?.status === 200 || response?.status === 201) {
        setEmail("");
        setPassword("");
        setShowMessage(true);
        setResponseBack("Login Successfully");
        const token = response.data?.token;
        localStorage.setItem("token", token as string);
        verfiedSeller(String(token));
        console.log(response);
      } else {
        setShowMessage(true);
        setResponseBack("Invalid Email/Password");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const verfiy = async () => {
    const token = localStorage.getItem("token");
    const response = await OtpSend(token as string);
    console.log("Response from VerifySeller API:", response);
  };

  const verfiedSeller = async (token: string) => {
    const response = await SellerVerificationApi(token as string);
    console.log("Response from SellerVerification API:", response.data);
    if (response.data === "UnVerified Seller") {
      verfiy();
      localStorage.setItem("userEmail", email.toLowerCase());
      router.push("/sellerlogin/otpVerification");
    } else {
      setShowList(true);
      router.push("/mainDashboard");
    }
  };
  //SignUp Function
  const SignUp = async () => {
    var data = {
      userName: UserNameSeller,
      email: EmailSeller,
      phoneNo: phoneNo,
      password: passwordSeller,
      status: "Platform Owner",
    };
    const response = await SignUpApi(data);
    console.log("Response from SignUp API:", response);
    if (response?.status === 200 || response?.status === 201) {
      setUserNameSeller("");
      setEmailSeller("");
      setphoneNo("");
      setPasswordSeller("");
      setPasswordConfirm("");
      setResponseBack(response.message);
      setCreateAccount(false);
    }
    if (response?.status === 400 || response?.status === 401) {
      setResponseBack(response.message);
    } else setResponseBack(response.message);
  };

  const validate = () => {
    let newErrors: { [key: string]: string } = {};

    if (phoneNo.length < 11) {
      newErrors.phoneNo = "Phone No must be at least 11 characters";
    }
    if (passwordSeller.length < 8) {
      newErrors.passwordSeller = "Password must be at least 8 characters";
    }
    if (passwordSeller !== passwordConfirm) {
      newErrors.passwordConfirm = "Passwords do not match";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      SignUp();
    }
    return newErrors;
  };

  useEffect(() => {
    setTimeout(() => {
      setShowMessage(false);
      setResponseBack("");
    }, 2000);
  }, [ShowMessage]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        {createAccount ? (
          <>
            <h3 className="text-center text-2xl font-semibold mb-6">Sign Up</h3>

            <div>
              {/* Email Field */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  UserName
                </label>
                <input
                  type="Email"
                  id="email"
                  value={UserNameSeller}
                  onChange={(e) => setUserNameSeller(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="UserName"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="Email"
                  id="email"
                  value={EmailSeller}
                  onChange={(e) => setEmailSeller(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone No
                </label>
                <input
                  type="text"
                  value={phoneNo}
                  onChange={(e) => setphoneNo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Phone No"
                  minLength={11}
                  required
                />
                {errors.phoneNo && (
                  <p className="text-red-500 text-sm">{errors.phoneNo}</p>
                )}
              </div>

              {/* Password Field with Toggle */}
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    value={passwordSeller}
                    onChange={(e) => setPasswordSeller(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder="Password"
                    minLength={8}
                    required
                  />

                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showPassword ? <Eye /> : <EyeClosed />}
                  </button>
                  {errors.passwordSeller && (
                    <p className="text-red-500 text-sm">
                      {errors.passwordSeller}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    type={showPassword1 ? "text" : "password"}
                    id="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder="Confirm Password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
                    onClick={() => setShowPassword1((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showPassword1 ? <Eye /> : <EyeClosed />}
                  </button>
                </div>
              </div>
              {errors.passwordConfirm && (
                <p className="text-red-500 text-sm">{errors.passwordConfirm}</p>
              )}
              {ShowMessage && (
                <>
                  {responseBack && (
                    <div
                      className={`w-full text-center px-4 py-3 mb-2 rounded ${
                        responseBack === "Record Added Successfully" ||
                        responseBack === "Login Successfully" ||
                        responseBack === "Request successful"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {responseBack}
                    </div>
                  )}
                </>
              )}
              {passwordSeller !== passwordConfirm ? (
                <button
                  type="button"
                  disabled
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 cursor-not-allowed"
                >
                  SignUp
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    validate();
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer"
                >
                  SignUp
                </button>
              )}
              <div
                onClick={() => setCreateAccount(!createAccount)}
                className="text-blue-500 text-sm hover:underline mt-2 cursor-pointer"
              >
                Already Have an Account?
              </div>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-center text-2xl font-semibold mb-6">Login</h3>

            <div>
              {/* Email Field */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="Email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email"
                  required
                />
              </div>

              {/* Password Field with Toggle */}
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showPassword ? <Eye /> : <EyeClosed />}
                  </button>
                </div>
              </div>
              {ShowMessage && (
                <>
                  {responseBack && (
                    <div
                      className={`w-full text-center px-4 py-3 mb-2 rounded ${
                        responseBack === "Record Added Successfully" ||
                        responseBack === "Login Successfully" ||
                        responseBack === "Request successful"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {responseBack}
                    </div>
                  )}
                </>
              )}
              <button
                type="submit"
                onClick={Login}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                {loading ? "logging in..." : "Login"}
              </button>
              {/* <div
                onClick={() => setCreateAccount(!createAccount)}
                className="text-blue-500 text-sm hover:underline mt-2 cursor-pointer"
              >
                Create an Account?
              </div> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
