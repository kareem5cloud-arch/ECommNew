// components/FeaturesSection.tsx
"use client";
import {
  Truck,
  Shield,
  RefreshCw,
  Headphones,
  Gift,
  CreditCard,
  Lock,
  Clock,
  MapPin,
  Package,
  Trophy,
  Users,
} from "lucide-react";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const features: Feature[] = [
  {
    id: "1",
    title: "Free Shipping",
    description: "Free shipping on all orders over $50",
    icon: <Truck className="w-6 h-6" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "2",
    title: "Secure Payment",
    description: "100% secure payment with encryption",
    icon: <Shield className="w-6 h-6" />,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: "3",
    title: "Easy Returns",
    description: "30 days easy return policy",
    icon: <RefreshCw className="w-6 h-6" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    id: "4",
    title: "24/7 Support",
    description: "Dedicated customer support team",
    icon: <Headphones className="w-6 h-6" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: "5",
    title: "Best Prices",
    description: "Price match guarantee on all products",
    icon: <Trophy className="w-6 h-6" />,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    id: "6",
    title: "Loyalty Rewards",
    description: "Earn points on every purchase",
    icon: <Gift className="w-6 h-6" />,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Why Shop With Us?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide the best shopping experience with these amazing benefits
          </p>
          <div className="w-20 h-1 bg-purple-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-100 overflow-hidden"
            >
              {/* Background Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-5">
                {/* Icon */}
                <div
                  className={`${feature.bgColor} ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Line */}
                <div
                  className={`w-12 h-0.5 ${feature.color.replace("text", "bg")} mt-4 rounded-full group-hover:w-20 transition-all duration-300`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center gap-2 text-gray-500">
              <Lock className="w-4 h-4" />
              <span className="text-sm">SSL Secure</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Track Orders</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Package className="w-4 h-4" />
              <span className="text-sm">Secure Packaging</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Users className="w-4 h-4" />
              <span className="text-sm">2M+ Happy Customers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
