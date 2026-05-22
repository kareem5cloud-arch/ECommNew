import { Check } from "lucide-react";
import { useState } from "react";
import ProductBasicInfo from "./AddProduct/ProductBasicInfo";
import ProductCategroyInfo from "./AddProduct/ProductCategroyInfo";

export default function AddProductForm() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { number: 1, title: "Shipping" },
    { number: 2, title: "Payment" },
    { number: 3, title: "Review" },
    { number: 4, title: "Confirm" },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    // Optional: allow clicking on completed steps
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
    }
  };
  return (
    <>
      <div>
        {/* Stepper Component */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  {/* Circle */}
                  <div
                    onClick={() => handleStepClick(step.number)}
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all duration-200 cursor-pointer
                    ${
                      currentStep > step.number
                        ? "bg-blue-500 text-white" // COMPLETED
                        : currentStep === step.number
                          ? "bg-blue-600 text-white ring-2 ring-blue-200" // ACTIVE
                          : "bg-gray-100 text-gray-400 border border-gray-300" // PENDING
                    }
                  `}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>

                  {/* Label */}
                  <div
                    className={`
                    text-xs mt-2 hidden sm:block
                    ${
                      currentStep >= step.number
                        ? "text-gray-700 font-medium"
                        : "text-gray-400"
                    }
                  `}
                  >
                    {step.title}
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                    flex-1 h-px mx-2 transition-all duration-200
                    ${currentStep > step.number ? "bg-blue-300" : "bg-gray-200"}
                  `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mt-2">
              {currentStep === 1 && (
                <div className="flex gap-2">
                  <ProductBasicInfo />
                  <ProductCategroyInfo />
                </div>
              )}
              {currentStep === 2 && "Choose your payment method"}
              {currentStep === 3 && "Review your order details"}
              {currentStep === 4 && "Confirm and complete your order"}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-3">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`
              px-5 py-2 rounded-lg font-medium transition-all
              ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
            `}
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep === steps.length}
              className={`
              px-5 py-2 rounded-lg font-medium transition-all
              ${
                currentStep === steps.length
                  ? "bg-blue-100 text-blue-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }
            `}
            >
              {currentStep === steps.length ? "Completed" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
