// components/CategoryShowcaseVideo.tsx
"use client";
import { useEffect, useState } from "react";
import { ChevronRight, Play } from "lucide-react";
import { categoryListHomePageCategroyImages } from "@/app/api/Types/Customer/CategorySectionHomePage";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/app/useContext";

interface CategroyShowCaseProps {
  categroyMainInfo: categoryListHomePageCategroyImages[];
  ID: string;
}

export default function CategoryShowcaseVideo({
  categroyMainInfo,
  ID,
}: CategroyShowCaseProps) {
  const filterData = categroyMainInfo.filter((item) => item.categoryID === ID);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full mb-3">
            Categories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Explore Categories
          </h2>
          <p className="text-gray-600">
            Find your perfect style in our collections
          </p>
        </div>

        {/* Category Cards Grid - 3 columns on large screens */}
        <div className="">
          {filterData.map((mCategory) => (
            <div
              key={mCategory.categoryID}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {mCategory.subCategoryDetail.map((category) => (
                <div
                  key={category.subCategoryName}
                  className="group flex  relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  {/* Image with Zoom Effect */}
                  <img
                    src={category.url}
                    alt={category.subCategoryName}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 group-hover:via-black/50 transition-all duration-500" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    {/* Play Button */}
                    <div className="transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-white/30 transition-all duration-300">
                        <ChevronRight className="w-8 h-8 text-white ml-1 group-hover:text-blue-200 transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-2 transform transition-all duration-500 group-hover:translate-y-[-4px]">
                      {category.subCategoryName}
                    </h3>

                    {/* Explore Button */}
                    <Link
                      href="/subMenu/Shop"
                      className="inline-block bg-white text-gray-900 px-6 py-2.5 rounded-full font-semibold 
                        transition-all duration-300 
                        hover:bg-purple-600 hover:text-white hover:shadow-lg hover:shadow-purple-500/30 
                        hover:scale-105 active:scale-95
                        transform translate-y-0 opacity-100
                        group-hover:shadow-xl"
                    >
                      Explore Collection
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
