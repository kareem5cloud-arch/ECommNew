"use client";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import {
  Category,
  NavbarApiResponse,
} from "@/api/types/HomePage/Navbar/Navbar";
import GetNavbar from "@/api/lib/HomePage/Navbar/Navbar";

// interface FilterComponentProps {
//   SelectedCategoryId: string | null;
//   setSelectedCategoryID: (id: string | null) => void;
//   selectedSubCategorie: string[];
//   setSelectedSubCategorie: (ids: string[]) => void;
//   onApply: () => void; // Callback to handle applying filters
// }
export default function FilterComponent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Fetch categories
  const handleShowCategories = async () => {
    const token = localStorage.getItem("token");
    const response = await GetNavbar(token || "");
    const data = response.data as NavbarApiResponse;
    if (response.status === 200 || response.status === 201) {
      setCategories(data.categoryList ?? []);
    } else {
      setCategories([]);
    }
  };

  useEffect(() => {
    handleShowCategories();
  }, []);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSubCategoryChange = (id: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full h-[100vh] flex flex-col p-5 rounded-2xl">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        Filter & Sorting
      </h1>

      <div className="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
        {/* === Main Categories Accordion === */}
        <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
          <button
            type="button"
            onClick={() => toggleAccordion(0)}
            className="flex items-center justify-between w-full p-4 font-semibold text-gray-800 hover:bg-gray-50 transition-all"
          >
            Categories
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${
                activeIndex === 0 ? "rotate-180" : ""
              }`}
            />
          </button>
          {activeIndex === 0 && (
            <div className="p-4 border-t border-gray-100">
              {categories.map((cat) => (
                <label
                  key={cat.subCategoryID}
                  className="flex items-center gap-3 mb-2"
                >
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategoryId === cat.subCategoryID}
                    onChange={() => setSelectedCategoryId(cat.subCategoryID)}
                    className="w-5 h-5 rounded accent-gray-900"
                  />
                  <span className="text-lg">{cat.subCategoryName}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* === Subcategories Accordion === */}
        {/* {selectedSubCategories.length > 0 && ( */}
        <>
          {selectedCategoryId &&
            (() => {
              const selectedCategory = categories.find(
                (cat) => cat.subCategoryID === selectedCategoryId
              );

              if (
                !selectedCategory ||
                selectedCategory.subCategory.length === 0
              ) {
                return null; // don't render if no subcategories
              }

              return (
                <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(1)}
                    className="flex items-center justify-between w-full p-4 font-semibold text-gray-800 hover:bg-gray-50 transition-all"
                  >
                    Sub Categories
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        activeIndex === 1 ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {activeIndex === 1 && (
                    <div className="p-4 border-t border-gray-100 grid grid-cols-2 gap-2">
                      {selectedCategory.subCategory.map((sub) => (
                        <label
                          key={sub.subCategoryDetailID}
                          className="flex items-center gap-3"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSubCategories.includes(
                              sub.subCategoryDetailID
                            )}
                            onChange={() =>
                              handleSubCategoryChange(sub.subCategoryDetailID)
                            }
                            className="w-5 h-5 rounded accent-gray-900"
                          />
                          <span className="text-lg">{sub.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
        </>

        {/* )} */}
      </div>

      {/* Apply Button */}
      <button
        // onClick={applyNow}
        className="mt-4 flex items-center justify-between px-4 py-3 bg-black text-white rounded-lg hover:bg-white hover:text-black transition-all duration-300"
      >
        Apply
        <ArrowRight />
      </button>
    </div>
  );
}
