import React, { useEffect, useRef, useState } from "react";

interface OptionType {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  label?: string;
  value: string;
  options: OptionType[];
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

export default function DropDownList({
  label,
  value,
  options,
  placeholder,
  required,
  onChange,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((item) =>
    item.label.toLowerCase().includes(value.toLowerCase()),
  );
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    // DOWN
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0,
      );
    }

    // UP
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1,
      );
    }

    // ENTER
    if (e.key === "Enter") {
      e.preventDefault();

      if (filteredOptions[highlightIndex]) {
        handleSelect(filteredOptions[highlightIndex]);
      }
    }

    // ESC
    if (e.key === "Escape") {
      setOpen(false);
    }
  };
  const handleSelect = (selected: OptionType) => {
    onChange(selected.value);
    setOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="relative w-full " ref={containerRef}>
        {label && (
          <label className="block text-sm font-medium text-neutral-700 ">
            {label}
            {required && <span className="text-red-600 text-lg ml-1">*</span>}
          </label>
        )}

        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setHighlightIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
        />

        {open && filteredOptions.length > 0 && (
          <ul className="absolute z-20 w-full bg-white border border-neutral-200 rounded-lg mt-1 shadow-sm max-h-52 overflow-auto">
            {filteredOptions.map((option, index) => (
              <li
                key={option.value}
                onMouseDown={() => handleSelect(option)}
                className={`px-4 py-2 cursor-pointer transition
              ${
                highlightIndex === index
                  ? "bg-neutral-900 text-white"
                  : "hover:bg-neutral-100"
              }`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
