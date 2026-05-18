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
import OtpSend from "@/api/authentication/OtpSend";
import { StoreApiResponse, storeInital } from "@/api/types/storeGet";
import GetInitalStore from "@/api/authentication/StoreGet";
import { useAsync } from "react-select/async";
import ChangePassword from "@/api/lib/CustomerAuthentication/ChangePassword/changePassword";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showList, setShowList] = useState(false);

  const [Email, setEmail] = useState("");
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

  const changePassword = async () => {
    try {
      setLoading(true);
      const email = localStorage.getItem("Email");
      const token = localStorage.getItem("token");
      const response = await ChangePassword(
        String(email),
        passwordSeller,
        String(token)
      );
      if (response.status === 200) {
        router.push("/login");
        setResponseBack(response.data.message);
        setShowMessage(true);
      } else {
        setResponseBack(response.data.message);
        setShowMessage(true);
      }
    } finally {
      setLoading(false);
    }
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
    }
    return newErrors;
  };
  const emailCheck = () => {
    const Email = localStorage.getItem("Email");
    if (!Email) {
      router.push("/login");
    } else {
      setEmail(Email);
    }
  };
  useEffect(() => {
    emailCheck();
    setTimeout(() => {
      setShowMessage(false);
      setResponseBack("");
    }, 2000);
  }, [ShowMessage]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <>
          <h3 className="text-center text-2xl font-semibold mb-6">
            Change Password
          </h3>

          <div>
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
                Submit
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  validate();
                  changePassword();
                }}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer"
              >
                {loading ? "Submit..." : "Submit"}
              </button>
            )}
          </div>
        </>
      </div>
    </div>
  );
}
