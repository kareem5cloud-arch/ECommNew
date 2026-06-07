// components/CategoryShowcaseVideo.tsx
"use client";
import { useState } from "react";
import { Play } from "lucide-react";
import { categoryListHomePageCategroyImages } from "@/app/api/Types/Customer/CategorySectionHomePage";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CategroyShowCaseProps {
  categroyMainInfo: categoryListHomePageCategroyImages[];
}
export default function CategoryShowcaseVideo({
  categroyMainInfo,
}: CategroyShowCaseProps) {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Explore Categories
          </h2>
          <p className="text-gray-600">
            Find your perfect style in our collections
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categroyMainInfo.map((category) => (
            <div
              key={category.subCategoryID}
              className="relative group rounded-2xl overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredId(category.subCategoryID)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative h-96">
                <img
                  src={category.url}
                  alt={category.subCategoryName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div
                    className={`transform transition-all duration-500 ${
                      hoveredId === category.subCategoryID
                        ? "scale-110"
                        : "scale-100"
                    }`}
                  >
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">
                    {category.subCategoryName}
                  </h3>
                  {/* <p className="text-white/80 text-sm mb-4">
                    {category.description}
                  </p> */}

                  <Link
                    href="/subMenu/Shop"
                    className={`bg-white text-gray-900 px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:bg-purple-600 hover:text-white
                    ${hoveredId === category.subCategoryID ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                  `}
                  >
                    Explore Collection
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
