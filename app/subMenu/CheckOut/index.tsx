// app/checkout/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Truck,
  CreditCard,
  Lock,
  Shield,
  Check,
  AlertCircle,
  Building2,
  MapPin,
  Phone,
  Mail,
  User,
  Home,
  Calendar,
  Clock,
} from "lucide-react";

// Types
interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Shipping Information
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  saveInfo: boolean;

  // Payment Information
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

// Sample cart data
const cartItems: CartItem[] = [
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

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
];
const states = {
  "United States": ["California", "New York", "Texas", "Florida", "Illinois"],
  Canada: ["Ontario", "Quebec", "British Columbia", "Alberta"],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
};

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<
    "personal" | "shipping" | "payment"
  >("personal");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    saveInfo: false,
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Calculate order totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 500 ? 0 : 9.99;
  const tax = subtotal * 0.1;
  const discount = 0;
  const total = subtotal + shipping + tax - discount;

  const validatePersonalInfo = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^[\d\s\-+()]{10,}$/.test(formData.phone))
      newErrors.phone = "Phone number is invalid";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateShippingInfo = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.zipCode) newErrors.zipCode = "ZIP code is required";
    if (!formData.country) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentInfo = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.cardNumber) newErrors.cardNumber = "Card number is required";
    else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, "")))
      newErrors.cardNumber = "Card number must be 16 digits";
    if (!formData.cardName) newErrors.cardName = "Name on card is required";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
    else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.expiryDate))
      newErrors.expiryDate = "Expiry date must be MM/YY";
    if (!formData.cvv) newErrors.cvv = "CVV is required";
    else if (!/^\d{3,4}$/.test(formData.cvv))
      newErrors.cvv = "CVV must be 3 or 4 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === "personal" && validatePersonalInfo()) {
      setCurrentStep("shipping");
      window.scrollTo(0, 0);
    } else if (currentStep === "shipping" && validateShippingInfo()) {
      setCurrentStep("payment");
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === "shipping") setCurrentStep("personal");
    if (currentStep === "payment") setCurrentStep("shipping");
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    if (!validatePaymentInfo()) return;

    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s/g, "").slice(0, 16);
    return v.replace(/(\d{4})/g, "$1 ").trim();
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2)}`;
    }
    return v;
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
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
              <p className="text-sm text-gray-600">
                Confirmation sent to: {formData.email}
              </p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Checkout</h1>
          <p className="text-gray-500 mt-1">Complete your purchase securely</p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {["personal", "shipping", "payment"].map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition ${
                      currentStep === step
                        ? "border-gray-900 bg-gray-900 text-white"
                        : currentStep === "shipping" && step === "personal"
                          ? "border-green-500 bg-green-500 text-white"
                          : currentStep === "payment" &&
                              (step === "personal" || step === "shipping")
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    {currentStep !== step &&
                    (step === "personal" || step === "shipping") &&
                    currentStep !== "personal" ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <p
                    className={`text-xs mt-2 font-medium capitalize ${
                      currentStep === step ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step}
                  </p>
                </div>
                {index < 2 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      (currentStep === "shipping" && index === 0) ||
                      (currentStep === "payment" && index <= 1)
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Personal Information */}
              {currentStep === "personal" && (
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <User className="w-5 h-5 text-gray-900" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Personal Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                        placeholder="(555) 123-4567"
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Information */}
              {currentStep === "shipping" && (
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Truck className="w-5 h-5 text-gray-900" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Shipping Information
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                        placeholder="123 Main St"
                      />
                      {errors.address && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apartment, Suite, etc. (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.apartment}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            apartment: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                        placeholder="Apt 4B"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country *
                        </label>
                        <select
                          value={formData.country}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              country: e.target.value,
                              state: "",
                            });
                          }}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                        >
                          {countries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                        {errors.country && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.country}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                          placeholder="Los Angeles"
                        />
                        {errors.city && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.city}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State *
                        </label>
                        <select
                          value={formData.state}
                          onChange={(e) =>
                            setFormData({ ...formData, state: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                        >
                          <option value="">Select State</option>
                          {states[formData.country as keyof typeof states]?.map(
                            (state) => (
                              <option key={state} value={state}>
                                {state}
                              </option>
                            ),
                          )}
                        </select>
                        {errors.state && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.state}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          value={formData.zipCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              zipCode: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                          placeholder="90210"
                        />
                        {errors.zipCode && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.zipCode}
                          </p>
                        )}
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.saveInfo}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            saveInfo: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">
                        Save this information for next time
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Payment Information */}
              {currentStep === "payment" && (
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="w-5 h-5 text-gray-900" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Payment Information
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cardNumber: formatCardNumber(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                      />
                      {errors.cardNumber && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.cardNumber}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name on Card *
                      </label>
                      <input
                        type="text"
                        value={formData.cardName}
                        onChange={(e) =>
                          setFormData({ ...formData, cardName: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                        placeholder="John Doe"
                      />
                      {errors.cardName && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.cardName}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          value={formData.expiryDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              expiryDate: formatExpiryDate(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {errors.expiryDate && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.expiryDate}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV *
                        </label>
                        <input
                          type="password"
                          value={formData.cvv}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cvv: e.target.value.slice(0, 4),
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                          placeholder="123"
                          maxLength={4}
                        />
                        {errors.cvv && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.cvv}
                          </p>
                        )}
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.saveCard}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            saveCard: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">
                        Save this card for future purchases
                      </span>
                    </label>

                    <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                      <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Secure Payment
                        </p>
                        <p className="text-xs text-gray-500">
                          Your payment information is encrypted and secure.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="border-t border-gray-100 p-6 flex justify-between">
                {currentStep !== "personal" && (
                  <button
                    onClick={handlePreviousStep}
                    className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-700"
                  >
                    <ChevronLeft className="w-4 h-4 inline mr-1" />
                    Back
                  </button>
                )}
                {currentStep !== "payment" ? (
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition ml-auto"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 inline ml-1" />
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition ml-auto disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Place Order
                        <Lock className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
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
                    {shipping === 0 ? "Free" : `$${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estimated Tax</span>
                  <span className="text-gray-900">${tax.toLocaleString()}</span>
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
  );
}
