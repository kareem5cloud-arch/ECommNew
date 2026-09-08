"use client";
import CustomerGetOrder from "@/app/api/Controller/Customer/Order/GetOrder";
import CustomerGetRatingOrder from "@/app/api/Controller/Customer/Order/GetRatingOrder";
import DeleteImageApi from "@/app/api/Controller/Customer/ReviewandReply/DeleteImageReview";
import AddReviewApi from "@/app/api/Controller/Customer/ReviewandReply/ReviewAndReplay";
import GetReviewApi from "@/app/api/Controller/Customer/ReviewandReply/ReviewAndReplayGet";
import UpdateReviewApi from "@/app/api/Controller/Customer/ReviewandReply/UpdateReview";
import { SendDataToApi } from "@/app/api/Controller/MiddleWare/CloudinaryUplaod";
import {
  CustomerOrderList,
  ResponseCustomerOrder,
} from "@/app/api/Types/Customer/CustomerOrder";
import {
  CustomerOrderRatingList,
  GetResponseForReviewAdded,
  ResponseCustomerOrderRating,
  reveiwsAdded,
} from "@/app/api/Types/Customer/CustomerOrderRating";
import ShowAddFile from "@/app/ui/ShowAndAddFile/ShowAndAddFile";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import {
  ChevronDown,
  Package,
  Pencil,
  ShoppingBag,
  Star,
  Trash,
  Upload,
  X,
  Truck,
  Minus,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
interface data {
  id: string;
  url: string;
}
export default function RatingReview() {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [ProductID, setProductID] = useState("");
  const [ID, setID] = useState("");
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [ImagesList, setImagesList] = useState<data[]>([]);
  const [orderList, setOrderList] = useState<CustomerOrderRatingList[]>([]);
  const [CustomerReview, setCustomerReview] = useState<reveiwsAdded[]>([]);

  const removeImage = (index: number) => {
    setReviewImages(reviewImages.filter((_, i) => i !== index));
  };

  const AddReview = async () => {
    const token = localStorage.getItem("customerToken");
    if (!token) return alert("No Token Found");
    else {
      if (!reviewText) return alert("Please Fill in all Required Filed");
      try {
        setLoading(true);
        const imageUrl = await Promise.all(
          reviewImages.map((item) => SendDataToApi(item)),
        );
        const formData = {
          varientID: ProductID,
          rating: reviewRating,
          messagentext: reviewText,
          dataList: imageUrl.map((url) => ({
            data: url.data,
          })),
        };
        const response = await AddReviewApi(formData, String(token));
        if (response.status == 200) {
          GetOrder();
          setShowReviewForm(false);
          setReviewRating(5);
          setReviewImages([]);
          setProductID("");
          setReviewText("");
        } else {
          alert("Could Not Add Review");
        }
      } finally {
        setLoading(false);
      }
    }
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setReviewImages([...reviewImages, ...files]);
    }
  };

  const GetOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("customerToken");
      const response = await CustomerGetRatingOrder(String(token));
      const data = response.data as ResponseCustomerOrderRating;
      if (response.status === 200) {
        setOrderList(data.orderList);
      } else {
        setOrderList([]);
      }
    } finally {
      setLoading(false);
    }
  };
  const GetReview = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("customerToken");
      const response = await GetReviewApi(String(token));
      const data = response.data as GetResponseForReviewAdded;
      if (response.status === 200) {
        setCustomerReview(data.reveiws);
      } else {
        setCustomerReview([]);
      }
    } finally {
      setLoading(false);
    }
  };
  const UpdateReview = async () => {
    const token = localStorage.getItem("customerToken");
    if (!token) return alert("No Token Found");
    else {
      if (!reviewText) return alert("Please Fill in all Required Filed");
      try {
        setLoading(true);
        const imageUrl = await Promise.all(
          reviewImages.map((item) => SendDataToApi(item)),
        );
        const formData = {
          replyID: ID,
          varientID: ProductID,
          rating: reviewRating,
          messagentext: reviewText,
          dataList: imageUrl.map((url) => ({
            data: url.data,
          })),
        };
        const response = await UpdateReviewApi(formData, String(token));
        if (response.status == 200) {
          GetReview();
          setShowReviewForm(false);
          setReviewRating(5);
          setReviewImages([]);
          setImagesList([]);
          setProductID("");
          setReviewText("");
          setID("");
          setUpdate(false);
        } else {
          alert("Could Not Modify Review");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const DeleteImage = async (ID: string) => {
    const token = localStorage.getItem("customerToken");
    const formData = {
      ID: ID,
    };
    const response = await DeleteImageApi(formData, String(token));
    if (response.status == 200) {
      const data = ImagesList.filter((item) => item.id !== ID);
      if (data) {
        setImagesList(data);
      }
    } else {
      setImagesList(ImagesList);
    }
  };
  useEffect(() => {
    GetOrder();
    GetReview();
  }, []);

  return (
    <>
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBag className="h-7 w-7 text-blue-600" />
              My Reviews
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage all your Experience of Store here
            </p>
          </div>
          <div className="text-sm text-gray-400">
            {orderList.length} {orderList.length === 1 ? "Order" : "Orders"}
          </div>
        </div>
        <div>
          <ShowAddFile
            update={setUpdate}
            setView={setView}
            view={view}
            setlistView={() => {}}
          />
          {view === "form" && (
            <div className="space-y-6 mt-2">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Spinner />
                </div>
              ) : orderList.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <span className="text-lg font-semibold text-gray-400">
                    No Order Found
                  </span>
                  <p className="text-sm text-gray-400 mt-1">
                    Your orders will appear here once you make a purchase
                  </p>
                </div>
              ) : (
                // Display Orders
                <div className="space-y-4">
                  {orderList.map((order, orderIndex) => (
                    <div
                      key={orderIndex}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                    >
                      {/* Order Header */}
                      <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="text-md font-medium text-gray-700">
                              {order.productName}
                            </span>
                            <div className="flex gap-2">
                              {order.values.map((item) => (
                                <div className="text-xs text-gray-600 bg-gray-100 px-2  py-1 rounded-md uppercase">
                                  {item.value}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {new Date(order.postingDate).toLocaleDateString()}
                          </span>
                          <span
                            className={
                              "px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 capitalize"
                            }
                          >
                            {order.status || "Pending"}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setShowReviewForm(true);
                              setProductID(order.varientID);
                            }}
                            className="rounded-lg p-1.5 bg-white text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 transition-all cursor-pointer"
                            title="Add Review"
                          >
                            <Star className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {view === "list" && (
            <div className="space-y-6 mt-2 px-2 sm:px-4">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Spinner />
                </div>
              ) : orderList.length === 0 ? (
                <div className="text-center py-12 sm:py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                  <span className="text-lg sm:text-xl font-semibold text-gray-400">
                    No Order Found
                  </span>
                  <p className="text-sm sm:text-base text-gray-400 mt-1 px-4">
                    Your orders will appear here once you make a purchase
                  </p>
                </div>
              ) : (
                // Display Orders
                <div className="space-y-4">
                  {CustomerReview.map((order, orderIndex) => (
                    <div
                      key={orderIndex}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      {/* Order Header */}
                      <div className="px-3 py-3 sm:px-4 sm:py-3 bg-gray-50/80 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                          <div className="flex-1 min-w-0">
                            <span className="text-sm sm:text-md font-medium text-gray-700 block truncate">
                              {order.productName}
                            </span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {order.values.map((item, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] sm:text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md uppercase whitespace-nowrap"
                                >
                                  {item.value}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Mobile: Additional info in row */}
                          <div className="flex flex-wrap items-center gap-2 sm:hidden">
                            {order.messagentext && (
                              <span className="text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded-md">
                                {order.messagentext}
                              </span>
                            )}
                            {order.rating && (
                              <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                {order.rating}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Desktop: Additional info */}
                        <div className="hidden sm:flex sm:items-center gap-3 flex-shrink-0">
                          {order.messagentext && (
                            <span className="text-xs text-gray-600 bg-blue-50 px-2.5 py-1 rounded-md">
                              {order.messagentext}
                            </span>
                          )}
                          {order.rating && (
                            <span className="text-xs text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-md flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                              {order.rating}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons - Always visible */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setShowReviewForm(true);
                              setReviewRating(order.rating);
                              setImagesList(order.data);
                              setProductID(order.varientID);
                              setReviewText(order.messagentext);
                              setID(order.replyID);
                              setUpdate(true);
                            }}
                            className="rounded-lg p-1.5 sm:p-2 bg-white text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 transition-all cursor-pointer"
                            title="Add Review"
                          >
                            <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Write a Review
                </h3>
                <button
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewRating(5);
                    setReviewImages([]);
                    setProductID("");
                    setReviewText("");
                    setImagesList([]);
                    setID("");
                    //setSelectedProduct(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= reviewRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Review <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Share your experience with this product..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Images (Optional)
                  </label>
                  <div className="flex items-center gap-4 flex-wrap">
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Upload</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    {reviewImages.map((file, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${idx}`}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {update && (
                      <>
                        {ImagesList.map((item, idx) => (
                          <div key={item.id} className="relative">
                            <img
                              src={item.url}
                              alt={`Preview ${idx}`}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => DeleteImage(item.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (update) {
                      UpdateReview();
                    } else {
                      AddReview();
                    }
                  }}
                  className="w-full py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {loading ? "Submitting...." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
