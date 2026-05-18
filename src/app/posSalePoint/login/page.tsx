"use client";
import LoginApi from "@/api/authentication/login";
import LoginOfflineSeller from "@/api/lib/MainDashbaord/CreteLogin/LoginSeller";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SellerPosLogin() {
  const router = useRouter();
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseBack, setResponseBack] = useState("");
  const [ShowMessage, setShowMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const Login = async () => {
    try {
      setLoading(true);
      const formData = { Email, password };
      const response = await LoginOfflineSeller(formData);
      console.log("Response from Login API:", response);
      if (response?.status === 200 || response?.status === 201) {
        setEmail("");
        setPassword("");
        setShowMessage(true);
        setResponseBack("Login Successfully");
        const token = response.data?.token;
        localStorage.setItem("tokenPosSale", token as string);
        if (response.status === 200) {
          router.push("/posSalePoint/salePanel/dashboard/");
        } else {
          router.push("/");
        }
      } else {
        setShowMessage(true);
        setResponseBack("Invalid UserName/Password");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (ShowMessage) {
      setTimeout(() => {
        setResponseBack("");
        setShowMessage(false);
      }, 2000);
    }
  }, [responseBack]);
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
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
                value={Email}
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
        </div>
      </div>
    </>
  );
}
