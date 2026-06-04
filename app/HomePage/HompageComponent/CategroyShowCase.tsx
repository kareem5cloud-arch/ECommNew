// components/CategoryShowcaseVideo.tsx
"use client";
import { useState } from "react";
import { Play } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  video?: string;
  description: string;
}

const categories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop",
    description: "Latest gadgets and tech innovations",
  },
  {
    id: "2",
    name: "Fashion",
    slug: "fashion",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop",
    description: "Trendy styles for every occasion",
  },
  {
    id: "3",
    name: "Home Decor",
    slug: "home-decor",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop",
    description: "Transform your living space",
  },
  {
    id: "4",
    name: "Electronics",
    slug: "electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop",
    description: "Latest gadgets and tech innovations",
  },
  {
    id: "5",
    name: "Fashion",
    slug: "fashion",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop",
    description: "Trendy styles for every occasion",
  },
  {
    id: "6",
    name: "Home Decor",
    slug: "home-decor",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop",
    description: "Transform your living space",
  },
];

export default function CategoryShowcaseVideo() {
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
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative group rounded-2xl overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative h-96">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div
                    className={`transform transition-all duration-500 ${
                      hoveredId === category.id ? "scale-110" : "scale-100"
                    }`}
                  >
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    {category.description}
                  </p>

                  <button
                    className={`bg-white text-gray-900 px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:bg-purple-600 hover:text-white
                    ${hoveredId === category.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                  `}
                  >
                    Explore Collection
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
