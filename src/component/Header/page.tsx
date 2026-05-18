import GetLandingpageInfo from "@/api/lib/HomePage/LandingPage/ladingPage";
import {
  ladingPageDetail,
  ladingPageDetailResponse,
} from "@/api/types/HomePage/LandignPage/CarasoulText";
import { useState, useEffect, use } from "react";
import Navbar from "../Navbar/page";
import { CartData } from "@/api/types/Cart/CartData";

const AutoCarousel = () => {
  const slides = [
    { src: "/new3.jpg", alt: "Slide 1" },
    { src: "/new4.png", alt: "Slide 2" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [animateText, setAnimateText] = useState(true);
  const [categories, setCategories] = useState<ladingPageDetail[]>([]);
  const [cartList, setCartList] = useState<CartData[]>([]);
  const [isOpen, setisOpen] = useState(false);
  // Auto slide
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  // Re-trigger text animation on slide change
  useEffect(() => {
    setAnimateText(false);
    const timeout = setTimeout(() => setAnimateText(true), 50);
    return () => clearTimeout(timeout);
  }, [currentIndex]);

  const totalSlides = categories[0]?.listImg?.length || 0;

  const goToPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);

  const HandleLandingPage = async () => {
    const token = localStorage.getItem("token");
    const response = await GetLandingpageInfo(token || "");
    const data = response.data as ladingPageDetailResponse;
    if (response.status === 200 || response.status === 201) {
      console.log(data.storeGet[0].logoUrl);
      setCategories(data?.storeGet ?? []);
    } else {
      setCategories([]);
    }
  };

  useEffect(() => {
    HandleLandingPage();
  }, []);
  const onClear = () => {};
  return (
    <>
      {" "}
      <div
        className="relative w-full overflow-hidden bg-gray-200"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        role="region"
        aria-label="Image Carousel"
      >
        {categories.map((item) => (
          <div key={item.userID}>
            <div className="relative w-full h-[80vh]">
              {item.listImg.map((slide, index) => (
                <div
                  key={slide.imageID}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentIndex
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-105"
                  }`}
                >
                  <img
                    src={slide.url}
                    // src="/new1.webp"
                    alt={"Carousel image ${index + 1}"}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 " />
                </div>
              ))}
            </div>

            {/* TEXT CONTENT */}
            <div className="absolute inset-0 flex items-center mx-5">
              <div className="px-4 sm:px-10 md:px-16 max-w-xl text-white">
                {/* <h1
                  className={`text-lg sm:text-2xl lg:text-4xl font-extrabold leading-tight ${
                    animateText ? "animate-slide-in" : "opacity-0"
                  }`}
                >
                  {item.headerText}
                </h1>

                <p
                  className={`mt-3 text-sm sm:text-base lg:text-lg ${
                    animateText ? "animate-slide-in" : "opacity-0"
                  }`}
                  style={{ animationDelay: "0.15s" }}
                >
                  {item.subHeadingText}
                </p> */}
              </div>
            </div>
          </div>
        ))}
        {/* SLIDES */}

        {/* CONTROLS */}
        <button
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 p-3 rounded-full"
        >
          ❮
        </button>

        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 p-3 rounded-full"
        >
          ❯
        </button>
      </div>
    </>
  );
};

export default AutoCarousel;
