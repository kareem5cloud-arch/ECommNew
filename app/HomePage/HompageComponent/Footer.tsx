// components/Footer.tsx
"use client";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Apple,
  Smartphone,
  CreditCard,
  Shield,
  Truck,
  RefreshCw,
  ChevronRight,
  Heart,
  Sparkles,
  Award,
  Clock,
  Headphones,
  Globe,
  Star,
  ShoppingBag,
} from "lucide-react";
import { ResposneStoreListHomePage } from "@/app/api/Types/Customer/HomePageStoreSetting";

// Custom social icons (not in Lucide)
const FacebookIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

interface BannerSliderProps {
  storeInfo?: ResposneStoreListHomePage;
}
export default function Footer({ storeInfo }: BannerSliderProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full opacity-5 blur-3xl"></div>
      </div>

      {/* Main Footer */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top Section with Gradient Border */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 pb-12 border-b border-white/10">
          {/* Brand Section */}
          <div>
            {/* <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                ShopHub
              </h2>
            </div> */}
            <div className="flex-shrink-0 ml-4 lg:ml-0">
              {storeInfo?.logoUrl ? (
                <img
                  src={storeInfo.logoUrl}
                  alt="Store Logo"
                  className="h-8 lg:h-10 w-auto object-contain"
                />
              ) : (
                <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"></span>
              )}
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed max-w-md">
              Experience the future of online shopping with premium quality
              products, exclusive deals, and unparalleled customer service. Join
              millions of happy customers worldwide.
            </p>

            {/* Social Links with Modern Design */}
            <div className="flex gap-3 mb-8">
              <a
                href={storeInfo?.facebook}
                className="group relative w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              >
                <FacebookIcon />
              </a>
              <a
                href={storeInfo?.facebook}
                className="group relative w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              >
                <TwitterIcon />
              </a>
              <a
                href={storeInfo?.instagram}
                className="group relative w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              >
                <InstagramIcon />
              </a>
              <a
                href={storeInfo?.linkdin}
                className="group relative w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              >
                <LinkedinIcon />
              </a>
              <a
                href={storeInfo?.youtube}
                className="group relative w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              >
                <YoutubeIcon />
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5 backdrop-blur-sm">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-xs">Award Winner 2024</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5 backdrop-blur-sm">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-xs">100% Secure</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5 backdrop-blur-sm">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-xs">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Stay in the Loop
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to get special offers, free giveaways, and exclusive
              deals.
            </p>
            <form onSubmit={handleSubscribe} className="relative mb-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-5 py-3 pr-32 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="text-sm font-medium">Subscribe</span>
              </button>
            </form>
            {isSubscribed && (
              <p className="text-green-400 text-xs animate-pulse">
                🎉 Thanks for subscribing! Check your inbox.
              </p>
            )}
            <p className="text-gray-500 text-xs mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-semibold text-lg mb-4 relative inline-block">
              Shop
              <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </h4>
            <ul className="space-y-2">
              {[
                "New Arrivals",
                "Best Sellers",
                "Trending Now",
                "Exclusive Deals",
                "Gift Cards",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 transition-all flex items-center gap-1 text-sm group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4 relative inline-block">
              Categories
              <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </h4>
            <ul className="space-y-2">
              {[
                "Electronics",
                "Fashion",
                "Home & Living",
                "Beauty",
                "Sports",
                "Books",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 transition-all flex items-center gap-1 text-sm group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4 relative inline-block">
              Support
              <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </h4>
            <ul className="space-y-2">
              {[
                "Help Center",
                "Returns & Exchanges",
                "Shipping Info",
                "Track Order",
                "Contact Us",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 transition-all flex items-center gap-1 text-sm group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4 relative inline-block">
              Contact
              <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-purple-400" />
                <span>{storeInfo?.address}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-purple-400" />
                <span>{storeInfo?.phoneNo}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>{storeInfo?.email}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Headphones className="w-4 h-4 text-purple-400" />
                <span>24/7 Customer Support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Bar */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-b border-white/10 mb-8">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Truck className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="font-semibold text-sm">Free Express Shipping</p>
              <p className="text-xs text-gray-400">On orders $50+</p>
            </div>
          </div>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <RefreshCw className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="font-semibold text-sm">30-Day Returns</p>
              <p className="text-xs text-gray-400">Easy & hassle-free</p>
            </div>
          </div>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="font-semibold text-sm">Secure Checkout</p>
              <p className="text-xs text-gray-400">256-bit encryption</p>
            </div>
          </div>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="font-semibold text-sm">Rewards Program</p>
              <p className="text-xs text-gray-400">Earn points & save</p>
            </div>
          </div>
        </div> */}

        {/* App & Payment Section */}
        {/* <div className="flex flex-col md:flex-row justify-between items-cnter gap-6 mb-8">
          <div className="flex gap-3">
            <a
              href="#"
              className="group flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500 transition-all"
            >
              <Apple className="w-6 h-6" />
              <div>
                <p className="text-xs text-gray-400">Download on</p>
                <p className="text-sm font-semibold">App Store</p>
              </div>
            </a>
            <a
              href="#"
              className="group flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500 transition-all"
            >
              <Smartphone className="w-6 h-6" />
              <div>
                <p className="text-xs text-gray-400">Get it on</p>
                <p className="text-sm font-semibold">Google Play</p>
              </div>
            </a>
          </div>

          <div className="flex gap-2">
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-gray-400" />
            </div>
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400">
              Visa
            </div>
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400">
              MC
            </div>
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400">
              PP
            </div>
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400">
              AE
            </div>
          </div>
        </div> */}

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 text-sm">
          <p className="text-gray-400">
            © {currentYear} ShopHub. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-gray-400 hover:text-purple-400 transition"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-purple-400 transition"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-purple-400 transition"
            >
              Cookie Settings
            </a>
          </div>
          <p className="text-gray-500 flex items-center gap-1 text-xs">
            Made with <Heart className="w-3 h-3 text-red-500 animate-pulse" />{" "}
            by ShopHub Team
          </p>
        </div>
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
    </footer>
  );
}
