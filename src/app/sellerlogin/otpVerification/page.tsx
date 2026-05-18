"use client";

import OtpSend from "@/api/authentication/OtpSend";
import GetInitalStore from "@/api/authentication/StoreGet";
import VerfiedSeller from "@/api/authentication/verifySeller";
import { StoreApiResponse, storeInital } from "@/api/types/storeGet";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [showStore, setShowStore] = useState(false);
  const [storeList, setStoreList] = useState<storeInital[]>([]);

  const verfiy = async () => {
    const token = localStorage.getItem("token");
    const response = await OtpSend(token as string);
    console.log("Response from VerifySeller API:", response);
    if (response.status === 200 || response.status === 201) {
    }
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setMessage("No logged in user found. Please login first.");
    }
  }, []);

  const handleVerifyOtp = async () => {
    const token = localStorage.getItem("token");
    const response = await VerfiedSeller({ code: String(otp) }, String(token));
    console.log("Response from new API:", response);
    if (response.status === 200 || response.status === 201) {
      setMessage("Email verified successfully!");
      router.push("/mainDashboard");
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center  px-4">
        <p className="text-center text-red-700 text-lg font-semibold bg-white px-6 py-4 rounded-lg shadow-lg max-w-sm">
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="bg-white rounded-xl shadow-xl p-10 max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Welcome, <span className="font-semibold">{email}</span>
        </p>

        <label htmlFor="otp" className="block text-gray-700 font-semibold mb-2">
          Enter OTP sent to your email
        </label>
        <input
          id="otp"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          placeholder="6-digit OTP"
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6 text-center text-xl tracking-widest font-mono"
          inputMode="numeric"
          autoFocus
        />

        {message && (
          <p
            className={`mb-6 text-center font-semibold ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <button
          onClick={handleVerifyOtp}
          className="w-full py-3 bg-indigo-600 text-white font-bold rounded-md shadow-md hover:bg-indigo-700 active:bg-indigo-800 transition"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
}
