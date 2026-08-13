// components/AuthModal.tsx
"use client";
import { useState, useEffect } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import CustomerSignupApi from "@/app/api/Controller/Authentication/Signup/CustomerSignUp";
import LoginApi from "@/app/api/Controller/Authentication/Login/login";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "signup";
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setloading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ShowMessage, setShowMessage] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [activeMessage, setActiveMessage] = useState<"success" | "error">(
    "success",
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const StoreAdd = async () => {
    try {
      setloading(true);
      if (!email || !password || !phoneNo)
        return alert("Please Fill in Filed with *");
      else {
        const formData = {
          userName: userName,
          email: email,
          password: password,
          phoneNo: phoneNo,
          status: "customer",
          address: "",
          stores: [],
        };
        //console.log(formData);
        //const token = localStorage.getItem("adminToken");
        const response = await CustomerSignupApi(formData);
        if (response.status == 200) {
          setEmail("");
          setPassword("");
          setShowMessage(true);
          setActiveMessage("success");
          setResponseMessage(response.data?.message);

          onClose();
        } else {
          setPassword("");
          setShowMessage(true);
          setActiveMessage("error");
          setResponseMessage(response.data?.message);
        }
      }
    } finally {
      setloading(false);
    }
  };
  const Login = async () => {
    try {
      setloading(true);
      const formData = { email: email, password: password };
      const response = await LoginApi(formData);
      if (response.status === 200) {
        setEmail("");
        setPassword("");
        setShowMessage(true);
        setActiveMessage("success");
        setResponseMessage(response.data?.message);
        setUser(response.data?.status);
        const token = response.data?.token;
        localStorage.setItem("customerToken", token as string);
        onclose;
      } else {
        setPassword("");
        setShowMessage(true);
        setActiveMessage("error");
        setResponseMessage(response.data?.message);
      }
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            className={`relative w-full max-w-md bg-white rounded-2xl shadow-xl transition-all duration-300 ${
              isOpen
                ? "scale-100 opacity-100 translate-y-0"
                : "scale-95 opacity-0 translate-y-4"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {mode === "login" ? "Welcome back" : "Create an account"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {mode === "login"
                    ? "Sign in to your account"
                    : "Join us for a better shopping experience"}
                </p>
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-700">
                    {successMessage}
                  </span>
                </div>
              )}

              {/* Form */}
              <div className="space-y-4">
                {/* Name Field */}
                {mode === "signup" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errors.name
                              ? "border-red-300 focus:ring-red-100"
                              : "border-gray-200 focus:border-gray-300 focus:ring-gray-100"
                          }`}
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone No
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={phoneNo}
                          onChange={(e) => setPhoneNo(e.target.value)}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errors.name
                              ? "border-red-300 focus:ring-red-100"
                              : "border-gray-200 focus:border-gray-300 focus:ring-gray-100"
                          }`}
                          placeholder="+92-123-45678912"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.email
                          ? "border-red-300 focus:ring-red-100"
                          : "border-gray-200 focus:border-gray-300 focus:ring-gray-100"
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.password
                          ? "border-red-300 focus:ring-red-100"
                          : "border-gray-200 focus:border-gray-300 focus:ring-gray-100"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                {mode === "signup" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.confirmPassword
                            ? "border-red-300 focus:ring-red-100"
                            : "border-gray-200 focus:border-gray-300 focus:ring-gray-100"
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                {/* Forgot Password */}
                {mode === "login" && (
                  <div className="text-right">
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-gray-900 transition"
                    >
                      Forgot password?
                    </a>
                  </div>
                )}
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
                {/* Submit Button */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={mode === "login" ? Login : StoreAdd}
                  className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {loading ? "Signing in..." : "Creating account..."}
                    </>
                  ) : (
                    <>
                      {loading ? "Sign in" : "Create account"}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-400">Or</span>
                </div>
              </div>

              {/* Social Login - Clean version */}
              <div className="space-y-2">
                <button className="w-full py-2 border border-gray-200 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>
                <button className="w-full py-2 border border-gray-200 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                  <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  Continue with Facebook
                </button>
              </div>

              {/* Switch Mode */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-500">
                  {mode === "login"
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <button
                    onClick={() => {
                      setMode(mode === "login" ? "signup" : "login");
                      setErrors({});
                    }}
                    className="ml-1 text-gray-900 font-medium hover:underline transition"
                  >
                    {mode === "login" ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
