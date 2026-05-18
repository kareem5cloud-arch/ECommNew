import { Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo + About */}
        <div className="flex flex-col item-center md:items-start">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold text-white">N.</h2>
          </div>
          <p className="text-sm leading-relaxed">
            We provide top-notch services and reliable support to ensure your
            satisfaction. Join thousands of happy customers who trust us.
          </p>
          <div className="flex gap-3 mx-0">
            <Facebook cursor={"pointer"} />
            <Instagram cursor={"pointer"} />
            <Twitter cursor={"pointer"} />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-white">
                Services
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Blogs
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="font-semibold text-white">Phone:</span> +92 300
              1234567
            </li>
            <li>
              <span className="font-semibold text-white">Email:</span>{" "}
              info@yourbrand.com
            </li>
            <li>
              <span className="font-semibold text-white">Address:</span>{" "}
              Karachi, Pakistan
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Newsletter</h3>
          <p className="text-sm mb-3">
            Subscribe to get the latest updates and offers.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-l-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="bg-blue-600 px-4 py-2 rounded-r-md text-white hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 pt-5 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} YourBrand. All rights reserved.</p>
      </div>
    </footer>
  );
}
