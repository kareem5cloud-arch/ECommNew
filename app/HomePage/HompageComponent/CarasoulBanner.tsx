"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  responseStoreListImageList,
  ResposneStoreListHomePage,
} from "@/app/api/Types/Customer/HomePageStoreSetting";

interface BannerSliderProps {
  slides?: responseStoreListImageList[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  storeInfo?: ResposneStoreListHomePage;
}

export default function BannerSlider({
  autoPlay = true,
  autoPlayInterval = 5000,
  showArrows = true,
  showDots = true,
  storeInfo,
  slides,
}: BannerSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Determine the actual slides to use
  const actualSlides = slides || storeInfo?.imagelist || [];

  const nextSlide = () => {
    if (isAnimating || actualSlides.length === 0) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % actualSlides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating || actualSlides.length === 0) return;
    setIsAnimating(true);
    setCurrentSlide(
      (prev) => (prev - 1 + actualSlides.length) % actualSlides.length,
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide || actualSlides.length === 0)
      return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    if (!autoPlay || actualSlides.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, currentSlide, actualSlides.length]);

  // Don't render if no slides
  if (actualSlides.length === 0) {
    return null;
  }
  return (
    <div className="relative w-full overflow-hidden bg-gray-900">
      {/* Slides Container */}
      <div className="relative h-[500px] md:h-[600px] lg:h-[800px] overflow-hidden">
        {actualSlides.map((slide, index) => (
          <div
            key={slide.imageID}
            className={`absolute inset-0 transition-all duration-700 ease-out transform
              ${
                index === currentSlide
                  ? "opacity-100 translate-x-0"
                  : index < currentSlide
                    ? "opacity-0 -translate-x-full"
                    : "opacity-0 translate-x-full"
              }
            `}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.url})` }}
            />

            {/* Semi-transparent Black Overlay for Text Readability */}
            <div className="absolute inset-0 " />

            {/* Gradient Overlay for Better Text Contrast (Optional) */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div
                  className={`max-w-3xl transform transition-all duration-700 delay-200
                    ${
                      index === currentSlide
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }
                  `}
                >
                  {/* Title */}
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                    {slide.headerText}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-base md:text-lg lg:text-xl text-white/95 mb-8 max-w-2xl leading-relaxed drop-shadow-md">
                    {slide.subHeadingText}
                  </p>

                  {/* CTA Button */}
                  <button className="group relative inline-flex items-center px-8 py-4 md:px-10 md:py-4 bg-white text-gray-900 font-semibold text-lg rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
                    <span>Explore Collection →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && actualSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-3 md:p-4 rounded-full transition-all duration-200 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-3 md:p-4 rounded-full transition-all duration-200 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && actualSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
          {actualSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-200 rounded-full
                ${
                  index === currentSlide
                    ? "w-10 h-2 bg-white"
                    : "w-2 h-2 bg-white/50 hover:bg-white/75"
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {autoPlay && actualSlides.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{
              width: `${((currentSlide + 1) / actualSlides.length) * 100}%`,
            }}
          />
        </div>
      )}

      {/* Slide Counter */}
      <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm font-medium">
        {currentSlide + 1} / {actualSlides.length}
      </div>
    </div>
  );
}
