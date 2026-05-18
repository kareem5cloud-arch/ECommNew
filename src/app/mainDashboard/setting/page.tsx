"use client";

import GetUserData from "@/api/lib/userData/userDataGet/dataGet";
import { userDatagetApiResponse } from "@/api/types/userData/userDataType";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import UpdatePassword from "@/api/lib/userData/modifyPassword/modifyPassword";

export default function ProfileSetting() {
  const router = useRouter();

  // UI State
  const [mode, setMode] = useState("list");
  const [responseBack, setResponseBack] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [UserName, setUserName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  // Icons State
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Fetch User Data
  const getData = async () => {
    const token = localStorage.getItem("token");
    const response = await GetUserData(String(token));

    if (response.status === 200 || response.status === 201) {
      const user = response.data as userDatagetApiResponse;
      setEmail(user.userData[0].email);
      setUserName(user.userData[0].userName);
    }

    if (response.status === 401) {
      router.push("/sellerlogin");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Validation + Save Handler
  const validateAndSave = async () => {
    // Required fields check
    if (!Password || !ConfirmPassword) {
      setResponseBack(2);
      return;
    }
    // Password match check
    if (Password !== ConfirmPassword) {
      setResponseBack(5);
      return;
    }
    const token = localStorage.getItem("token");
    const response = await UpdatePassword(String(token), Password);
    if (response.status === 200 || response.status === 201) {
      setResponseBack(1);
      setPassword("");
      setConfirmPassword("");
    }

    if (response.status === 401) {
      router.push("/sellerlogin");
    }
    // Proceed API call
    setLoading(true);
    setPassword("");
    setConfirmPassword("");

    setTimeout(() => {
      setLoading(false);
      setResponseBack(1);
      setPassword("");
      setConfirmPassword("");
    }, 1500);
  };

  // Auto-hide messages
  useEffect(() => {
    if (responseBack !== 0) {
      setTimeout(() => setResponseBack(0), 2000);
    }
  }, [responseBack]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Profile Management
        </h2>

        <div className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="text"
              required
              readOnly
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-3 border rounded-md border-gray-300 bg-gray-100"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-3 pr-12 border rounded-md ${
                responseBack === 2 && !Password
                  ? "border-red-500"
                  : responseBack === 5 && Password !== ConfirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 bottom-3 text-gray-500 hover:text-gray-700"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirmPass ? "text" : "password"}
              value={ConfirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3 py-3 pr-12 border rounded-md ${
                responseBack === 2 && !ConfirmPassword
                  ? "border-red-500"
                  : responseBack === 5 && Password !== ConfirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="absolute right-3 bottom-3 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Messages */}
          {responseBack === 2 && (
            <div className="w-full bg-red-100 text-red-800 p-3 rounded text-center">
              Fill in All Required Fields
            </div>
          )}

          {responseBack === 5 && (
            <div className="w-full bg-red-100 text-red-800 p-3 rounded text-center">
              Password & Confirm Password do not match
            </div>
          )}

          {responseBack === 1 && (
            <div className="w-full bg-green-100 text-green-800 p-3 rounded text-center">
              Updated Successfully
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={validateAndSave}
            type="button"
            className="w-full py-3 bg-indigo-500 text-white rounded-xl font-semibold shadow-lg hover:bg-indigo-600 transition"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
