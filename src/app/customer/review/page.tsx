"use client";
import { useState } from "react";
import {
  Star,
  Trash2,
  Edit3,
  Send,
  MessageSquare,
  ImagePlus,
  X,
} from "lucide-react";
import Image from "next/image";

export default function Review() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      product: "Beige Trouser",
      image: "/collection1.jpg",
      rating: 5,
      message: "Excellent quality and perfect fit!",
      date: "Oct 28, 2025",
      reviewImages: ["/collection1.jpg", "/collection2.jpg"],
    },
  ]);

  const [newReview, setNewReview] = useState({
    product: "",
    rating: 0,
    message: "",
    reviewImages: [] as string[],
  });
  const [newReview2, setNewReview2] = useState({
    product: "",
    rating: 0,
    message: "",
    reviewImages: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.product || !newReview.rating || !newReview.message) return;

    const newEntry = {
      id: Date.now(),
      product: newReview.product,
      image: "/collection1.jpg",
      rating: newReview.rating,
      message: newReview.message,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      reviewImages: newReview.reviewImages,
    };

    setReviews([newEntry, ...reviews]);
    setNewReview({ product: "", rating: 0, message: "", reviewImages: [] });
    setNewReview2({ product: "", rating: 0, message: "", reviewImages: [] });
  };

  const handleDelete = (id: number) => {
    setReviews(reviews.filter((review) => review.id !== id));
  };

  const handleRating = (value: number) => {
    setNewReview({ ...newReview, rating: value });
  };

  const handleRating2 = (value: number) => {
    setNewReview2({ ...newReview2, rating: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selectedImages = Array.from(files).slice(
      0,
      2 - newReview.reviewImages.length
    );
    const imageUrls = selectedImages.map((file) => URL.createObjectURL(file));

    setNewReview((prev) => ({
      ...prev,
      reviewImages: [...prev.reviewImages, ...imageUrls].slice(0, 2),
    }));
  };

  const removeImage = (index: number) => {
    setNewReview((prev) => ({
      ...prev,
      reviewImages: prev.reviewImages.filter((_, i) => i !== index),
    }));
  };

  return (
    <div>
      <h1 className="flex gap-2 text-2xl font-bold text-gray-900 mb-8">
        <Star className="text-yellow-400" size={30} />
        My Reviews
      </h1>

      {/* === Write Review Form === */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" /> Write a Review
        </h3>

        {/* Product Select */}
        <select
          value={newReview.product}
          onChange={(e) =>
            setNewReview({ ...newReview, product: e.target.value })
          }
          className="w-full mb-4 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">Select a Product</option>
          <option value="Beige Trouser">Beige Trouser</option>
          <option value="Casual Shirt">Casual Shirt</option>
          <option value="Denim Jacket">Denim Jacket</option>
        </select>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-medium text-gray-700">Quality Rating:</span>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              onClick={() => handleRating(i + 1)}
              className={`w-6 h-6 cursor-pointer transition ${
                i < newReview.rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300 hover:text-yellow-400"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="font-medium text-gray-700">Delivery Rating:</span>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              onClick={() => handleRating2(i + 1)}
              className={`w-6 h-6 cursor-pointer transition ${
                i < newReview2.rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300 hover:text-yellow-400"
              }`}
            />
          ))}
        </div>
        {newReview.rating === 1 ||
          (newReview2.rating === 1 && (
            <button className="bg-black text-white px-3 py-2 rounded mt-3 mb-3 hover:bg-gray-900 transition">
              Return / Refund
            </button>
          ))}

        {/* Message */}
        <textarea
          rows={3}
          value={newReview.message}
          onChange={(e) =>
            setNewReview({ ...newReview, message: e.target.value })
          }
          placeholder="Share your experience..."
          className="w-full mb-4 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
        ></textarea>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-gray-700 font-medium cursor-pointer w-fit hover:text-black transition">
            <ImagePlus size={18} /> Upload Images (Max 2)
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {/* Preview */}
          {newReview.reviewImages.length > 0 && (
            <div className="flex gap-3 mt-3 flex-wrap">
              {newReview.reviewImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200"
                >
                  <a
                    href={img}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    <Image
                      src={img}
                      alt={`Review Image ${idx + 1}`}
                      fill
                      className="object-contain bg-gray-100"
                    />
                  </a>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition flex justify-center items-center gap-2"
        >
          <Send size={18} /> Submit Review
        </button>
      </form>

      {/* === User Reviews List === */}
      <div className="space-y-5">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex flex-col md:flex-row justify-between bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:shadow-md transition"
          >
            <div className="flex items-start gap-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={review.image}
                  alt={review.product}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {review.product}
                </h4>
                <div className="flex items-center gap-1 my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-sm">{review.message}</p>

                {/* Review Images */}
                {review.reviewImages.length > 0 && (
                  <div className="flex gap-3 mt-3">
                    {review.reviewImages.map((img, idx) => (
                      <a
                        key={idx}
                        href={img}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 hover:opacity-90 transition"
                      >
                        <Image
                          src={img}
                          alt={`Review Image ${idx + 1}`}
                          fill
                          className="object-contain bg-gray-100"
                        />
                      </a>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">{review.date}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                onClick={() => handleDelete(review.id)}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition"
              >
                <Trash2 size={16} /> Delete
              </button>
              <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-black transition">
                <Edit3 size={16} /> Edit
              </button>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <p className="text-center text-gray-500 text-sm">
            You haven’t submitted any reviews yet.
          </p>
        )}
      </div>
    </div>
  );
}
