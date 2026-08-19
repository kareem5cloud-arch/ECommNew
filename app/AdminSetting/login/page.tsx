// app/login/page.tsx
"use client";
import LoginApi from "@/app/api/Controller/Authentication/Login/login";
import { Eye, EyeOff } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function LoginPage() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ShowMessage, setShowMessage] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [activeMessage, setActiveMessage] = useState<"success" | "error">(
    "success",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState("");

  const Login = async () => {
    try {
      setLoading(true);
      const formData = { email: Email, password: Password };
      const response = await LoginApi(formData);
      if (response.status === 200) {
        setEmail("");
        setPassword("");
        setShowMessage(true);
        setActiveMessage("success");
        setResponseMessage(response.data?.message);
        setUser(response.data?.status);
        const token = response.data?.token;

        if (response.data?.status === "Platform Owner") {
          localStorage.setItem("adminToken", token as string);
          window.location.href = "/AdminSetting/admin/Dashboard";
        }
        if (response.data?.status === "OnlineSeller") {
          localStorage.setItem("OnlineSellerToken", token as string);
          window.location.href = "/AdminSetting/OnlineSeller/Dashboard";
        }
        if (response.data?.status === "OfflineSeller") {
          localStorage.setItem("OfflineSellerToken", token as string);
          window.location.href = "/AdminSetting/OfflineSeller/Dashboard";
        }
        if (response.data?.status === "PurchaserLogin") {
          localStorage.setItem("PurchaserLoginToken", token as string);
          window.location.href = "/AdminSetting/Purchaserlogin/Dashboard";
        }
        if (response.data?.status === "WareHouseSeller") {
          localStorage.setItem("WareHouseSellerToken", token as string);
          window.location.href = "/AdminSetting/WareHouseSeller/Dashboard";
        }
      } else {
        setPassword("");
        setShowMessage(true);
        setActiveMessage("error");
        setResponseMessage(response.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (responseMessage) {
      const timer = setTimeout(() => {
        setResponseMessage("");
        setShowMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [responseMessage]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4 py-12 dark:from-slate-900 dark:to-slate-800 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/70 p-8 shadow-xl backdrop-blur-sm dark:bg-slate-900/70">
        {/* Logo / Brand */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email field */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="relative block w-full rounded-lg border border-slate-300 bg-white/50 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500"
                placeholder="Email address"
              />
            </div>

            {/* Password field */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="relative block w-full rounded-lg border border-slate-300 bg-white/50 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-slate-700 dark:text-slate-300"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400"
              >
                Forgot password?
              </a>
            </div>
          </div>
          {ShowMessage && (
            <div
              className={`${
                activeMessage === "success"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              } rounded-lg p-3 animate-in fade-in duration-200`}
            >
              <p
                className={`${
                  activeMessage === "success"
                    ? "text-green-600"
                    : "text-red-600"
                } text-sm text-center`}
              >
                {responseMessage}
              </p>
            </div>
          )}
          {/* Submit button */}
          <div>
            <button
              onClick={Login}
              type="button"
              className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
            >
              {loading ? "Signing In..." : "Sign in"}
            </button>
          </div>
        </div>

        {/* Sign up link */}
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <a
            href="#"
            className="font-medium text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
