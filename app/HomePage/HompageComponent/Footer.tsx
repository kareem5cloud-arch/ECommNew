// components/Footer.tsx
"use client";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ChevronRight,
  Heart,
  Clock,
  Headphones,
} from "lucide-react";
import { ResposneStoreListHomePage } from "@/app/api/Types/Customer/HomePageStoreSetting";
import { categoryListHomePageCustomerCategroy } from "@/app/api/Types/Customer/HomePageCustomerCategroy";

// Custom social icons
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
  categroyMainInfo: categoryListHomePageCustomerCategroy[];
}

export default function Footer({
  storeInfo,
  categroyMainInfo,
}: BannerSliderProps) {
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
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 pb-8 border-b border-gray-800">
          {/* Brand Section */}
          <div>
            {storeInfo?.logoUrl ? (
              <img
                src={storeInfo.logoUrl}
                alt="Store Logo"
                className="h-10 w-auto object-contain mb-4"
              />
            ) : (
              <h2 className="text-2xl font-bold text-white mb-4">ShopHub</h2>
            )}
            <p className="text-gray-400 text-sm mb-5 leading-relaxed max-w-md">
              Experience quality shopping with premium products, great deals,
              and dedicated customer service. Join thousands of happy customers
              worldwide.
            </p>

            {/* Social Links */}
            <div className="flex gap-3 mb-6">
              <a
                href={storeInfo?.facebook}
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <FacebookIcon />
              </a>
              <a
                href={storeInfo?.facebook}
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <TwitterIcon />
              </a>
              <a
                href={storeInfo?.instagram}
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <InstagramIcon />
              </a>
              <a
                href={storeInfo?.linkdin}
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <LinkedinIcon />
              </a>
              <a
                href={storeInfo?.youtube}
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <YoutubeIcon />
              </a>
            </div>

            {/* Info Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1.5">
                <Headphones className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="bg-gray-800/50 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-1">
              Stay Updated
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Get exclusive offers and updates directly to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="relative mb-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 pr-28 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all text-sm"
                required
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-gray-700 hover:bg-gray-600 rounded-md transition-all flex items-center gap-2 text-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Subscribe</span>
              </button>
            </form>
            {isSubscribed && (
              <p className="text-green-500 text-xs">
                ✓ Thanks for subscribing!
              </p>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h4 className="font-semibold text-white text-md mb-3">Shop</h4>
            <ul className="space-y-2">
              {["New Arrivals", "Explore Product"].map((item) => (
                <li key={item}>
                  <a
                    href="/subMenu/Shop"
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-md mb-3">
              Categories
            </h4>
            <ul className="space-y-2">
              {categroyMainInfo.map((item) => (
                <li key={item.categoryID}>
                  <a
                    href="/subMenu/Shop"
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {item.categoryName}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-md mb-3">Support</h4>
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
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-md mb-3">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{storeInfo?.address || "123 Commerce St, City"}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{storeInfo?.phoneNo || "+1 234 567 890"}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>{storeInfo?.email || "support@shophub.com"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-800 text-sm">
          <p className="text-gray-500">
            © {currentYear} Karim5. All rights reserved.
          </p>
          <div className="flex gap-5">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-300 transition text-xs"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-300 transition text-xs"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-300 transition text-xs"
            >
              Cookie Settings
            </a>
          </div>
          <p className="text-gray-600 text-xs flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500" /> by
            MindLink(IT-House)
          </p>
        </div>
      </div>
    </footer>
  );
}
