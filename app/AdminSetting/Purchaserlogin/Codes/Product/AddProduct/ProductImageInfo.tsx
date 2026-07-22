// AddProductImage.tsx
import { useEffect, useRef, useState } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Move,
  Trash2,
  Star,
  Plus,
} from "lucide-react";

interface AddProductImageProps {
  images: File[];
  setImages: (images: File[]) => void;
  dragIndex: number | null;
  setDragIndex: (index: number | null) => void;
  hoverIndex: number | null;
  setHoverIndex: (index: number | null) => void;
  isDragOver: boolean;
  setIsDragOver: (isDragOver: boolean) => void;
}

export default function AddProductImage({
  images,
  setImages,
  dragIndex,
  setDragIndex,
  hoverIndex,
  setHoverIndex,
  isDragOver,
  setIsDragOver,
}: AddProductImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleImageChange(e.dataTransfer.files);
  };

  const handleClick = () => fileInputRef.current?.click();

  const handleImageChange = (files: FileList | null) => {
    if (!files) return;
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );
    setImages([...images, ...validFiles]);
  };

  const reorderImages = (from: number, to: number) => {
    const updated = [...images];
    const moved = updated.splice(from, 1)[0];
    updated.splice(to, 0, moved);
    setImages(updated);
  };

  const handleDeleteImage = (indexToDelete: number) => {
    setImages(images.filter((_, index) => index !== indexToDelete));
  };

  const handleSetAsPrimary = (index: number) => {
    const updated = [...images];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    setImages(updated);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Body */}
      <div className="p-6">
        {/* Upload Area */}
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          className={`
            w-full p-8 border-2 border-dashed rounded-xl cursor-pointer text-center transition-all duration-200
            ${
              isDragOver
                ? "border-purple-500 bg-purple-50"
                : "border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50/50"
            }
          `}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <Upload
              className={`w-12 h-12 ${isDragOver ? "text-purple-500" : "text-gray-400"}`}
            />
            <div>
              <p className="text-gray-600 font-medium">
                Drag & drop images here or{" "}
                <span className="text-purple-600 underline">browse</span>
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Supports JPG, PNG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        {images.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">
                Uploaded Images ({images.length})
              </h3>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Move className="w-3 h-3" />
                Drag to reorder
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((img, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={() => setDragIndex(i)}
                  onDragEnter={() => setHoverIndex(i)}
                  onDragEnd={() => {
                    if (
                      dragIndex !== null &&
                      hoverIndex !== null &&
                      dragIndex !== hoverIndex
                    ) {
                      reorderImages(dragIndex, hoverIndex);
                    }
                    setDragIndex(null);
                    setHoverIndex(null);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  className={`
                    relative group rounded-lg overflow-hidden border-2 transition-all duration-200
                    ${hoverIndex === i ? "border-purple-500 shadow-lg scale-105" : "border-gray-200"}
                    ${i === 0 ? "ring-2 ring-yellow-400 ring-offset-2" : ""}
                  `}
                >
                  {/* Image */}
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={URL.createObjectURL(img)}
                      className="w-full h-full object-cover"
                      alt={`Product ${i + 1}`}
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    {/* Set as Primary Button */}
                    {i !== 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetAsPrimary(i);
                        }}
                        className="p-1.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                        title="Set as primary"
                      >
                        <Star className="w-3 h-3" />
                      </button>
                    )}

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(i);
                      }}
                      className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                      title="Delete image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Badge */}
                  {i === 0 && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      Primary
                    </div>
                  )}

                  {/* Drag Handle */}
                  <div className="absolute bottom-2 right-2 bg-black/50 rounded p-1 opacity-0 group-hover:opacity-100 transition">
                    <Move className="w-3 h-3 text-white" />
                  </div>
                </div>
              ))}

              {/* Add More Button */}
              <button
                type="button"
                onClick={handleClick}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-6 h-6 text-gray-400 group-hover:text-purple-500" />
                <span className="text-xs text-gray-500">Add More</span>
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-700 flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                The first image will be used as the primary product image
              </p>
            </div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleImageChange(e.target.files)}
          className="hidden"
        />
      </div>
    </div>
  );
}
