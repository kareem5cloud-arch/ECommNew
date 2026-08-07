// components/OrderProcedure.tsx
"use client";
import {
  ShoppingCart,
  Truck,
  PackageCheck,
  Shield,
  Clock,
  ArrowRight,
} from "lucide-react";

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const steps: Step[] = [
  {
    id: "1",
    title: "Add to Cart",
    description:
      "Browse our collection and add your favorite items to the shopping cart",
    icon: <ShoppingCart className="w-6 h-6" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "2",
    title: "Shipping & Payment",
    description: "Enter your shipping details and complete secure payment",
    icon: <Truck className="w-6 h-6" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: "3",
    title: "Delivered",
    description: "Track your package and receive it safely at your doorstep",
    icon: <PackageCheck className="w-6 h-6" />,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
];

export default function OrderProcedure() {
  return (
    <section className="py-8 md:py-8 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-5">
          <span className="inline-block text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full mb-3">
            Simple Process
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            How It Works
          </h2>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Get your products delivered in just 3 easy steps
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Steps - 3 Cards with Connectors */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connector Line - Desktop */}
          <div className="hidden md:block absolute top-1/3 left-[16.6%] right-[16.6%] h-0.5 bg-gray-200 -translate-y-1/2">
            <div className="w-full h-full bg-gradient-to-r from-blue-400 via-purple-400 to-green-400"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="group relative bg-white rounded-2xl p-2 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                  {index + 1}
                </div>

                {/* Icon with Background */}
                <div
                  className={`${step.bgColor} ${step.color} w-10 h-10 rounded-xl flex items-center justify-center mb-1 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                >
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-gray-900  group-hover:text-purple-600 transition-colors">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-600 leading-relaxed w-60">
                  {step.description}
                </p>

                {/* Arrow Indicator - Mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center mt-3">
                    <ArrowRight className="w-5 h-5 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium">Secure Payment</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <span className="text-sm font-medium">Fast Delivery</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                <PackageCheck className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium">Track Orders</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
