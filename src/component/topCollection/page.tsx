import { useState } from "react";
import Footer from "../Footer/page";
import Navbar from "../Navbar/page";
import Image from "next/image";
const products = [
  {
    id: 1,
    name: "DESIGN smart Bermuda ",
    price: "$599",
    rating: 5.0,
    image: "/collection1.jpg",
  },
  {
    id: 2,
    name: "Linen blend culottes ",
    price: "$499",
    rating: 4.8,
    image: "/collection3.jpg",
  },
  {
    id: 3,
    name: "DESIGN smart Bermuda",
    price: "$699",
    rating: 4.9,
    image: "/collection2.jpg",
  },
  {
    id: 4,
    name: "Linen blend culottes",
    price: "$329",
    rating: 4.6,
    image: "/collection1.jpg",
  },
  {
    id: 5,
    name: "DESIGN smart Bermuda",
    price: "$799",
    rating: 5.0,
    image: "/collection2.jpg",
  },
  {
    id: 6,
    name: "Linen blend culottes",
    price: "$279",
    rating: 4.7,
    image: "/collection3.jpg",
  },
];
export default function TopCollectionPage() {
  return (
    <>
      <div className="flex w-full flex-col p-4 items-center bg-gray-100 mt-2 mb-2">
        <h1 className="text-2xl font-bold mt-10 mb-2 text-blue-600">
          Special Offer
        </h1>
        <h1 className="text-4xl font-extrabold text-gray-700  underline mb-5 ">
          Top Collections
        </h1>

        <p className="text-center max-w-3xl text-gray-800 text-lg mt-2">
          Find Various types of quality chairs, and international standards.
          only with this one website you can see and buy quality chairs.
          immediately order the best seat.
        </p>
        <hr className="w-1/2 border-gray-300 mt-6 mb-10" />
        {/* Content for Top Collections can be added here */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <div
              key={item.id}
              className="w-full min-w-sm min-h-md mx-auto bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Full width responsive image */}
              <div className="relative w-full h-56 overflow-hidden rounded-t-lg">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover hov  er:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="px-5 pb-5">
                <h5 className="text-2xl font-semibold tracking-tight mt-3 text-gray-900 ">
                  {item.name}
                </h5>

                <div className="flex items-center mt-2.5 mb-5">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < 4 ? "text-yellow-300" : "text-gray-200"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                    ))}
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm ms-3">
                    {item.rating}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {item.price}
                  </span>
                  <div className="flex gap-1">
                    <del>{Number(300) - 50}</del>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
