"use client";
import ProductDataByID from "@/app/api/Controller/Customer/HomePage/ProductFecthByID/ProductByID";
import {
  ProductSectionHomePageByID,
  ProductSectionHomePageVarientByID,
  ResponseProductSectionHomePageByID,
} from "@/app/api/Types/Customer/ProductFetchedByID";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  RefreshCw,
  Shield,
  Minus,
  Plus,
  AlertCircle,
  Check,
  Package,
  Award,
  Loader2,
  ThumbsUp,
  Calendar,
  X,
  Upload,
  MessageCircle,
} from "lucide-react";
import { CartData } from "@/app/api/Types/Customer/Cookies/Cart";
import { addToServerCart } from "@/app/api/Controller/Customer/CookiesController/Cart/AddCart";
import { addToServerWishList } from "@/app/api/Controller/Customer/CookiesController/WishList/AddWishList";
import { SendDataToApi } from "@/app/api/Controller/MiddleWare/CloudinaryUplaod";
import AddReviewApi from "@/app/api/Controller/Customer/ReviewandReply/ReviewAndReplay";
import { AddReviewRequest } from "@/app/api/Types/Customer/AddReviewRating";

type VariantValue = {
  attributeID: string;
  variantName: string;
  varientValue: string;
};

type GroupedVariant = {
  headerText: string;
  values: values[];
};
type values = {
  attributeID: string;
  attributeName: string;
};

interface getPorodcutprops {
  functionCalling: () => void;
  returnCategroySubID: (data: string) => void;
}
export default function ProductInformation({
  functionCalling,
  returnCategroySubID,
}: getPorodcutprops) {
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedYThumbNailImage, setSelectedYThumbNailImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [defaultImageUrl, setdefaultImageUrl] = useState("");
  const [ProductData, setProductData] = useState<ProductSectionHomePageByID>();
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attribuetID, setAttributeID] = useState("");

  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [ID, setID] = useState("");
  const [variantID, setVaraintID] = useState("");
  const [variantValue, setVaraintValue] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [varintList, setVarintList] = useState<GroupedVariant[]>([]);
  const getProductInfo = async (ID: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ProductDataByID(ID);

      if (response.status === 200) {
        const data = response.data as ResponseProductSectionHomePageByID;
        // Handle case where productList is an array

        const productList = Array.isArray(data.productList)
          ? data.productList[0]
          : data.productList;
        setProductData(productList);

        setSelectedImage(productList.variants[0].images[0].urlID);
        setImageUrl(productList.variants[0].images[0].url);
        // Auto-select first variant and its first attribute
        // if (productList?.variants && productList.variants.length > 0) {
        //   const firstVariant = productList.variants[0];

        //   if (
        //     firstVariant.variantValues &&
        //     firstVariant.variantValues.length > 0
        //   ) {
        //     const firstVariantValue = firstVariant.variantValues[0];
        //     setAttributeID(firstVariant.variantValues[0].attributeID);
        //   }
        // }

        setQuantity(1);
      } else {
        setError("Failed to load product data");
        setProductData(undefined);
      }
    } catch (error) {
      setError("An error occurred while loading the product");
      setProductData(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ProductData) {
      returnCategroySubID(ProductData.subCategoryID);
    }
  }, [ProductData]);
  const param = useParams();
  useEffect(() => {
    if (param.Product) {
      setID(String(param.Product));
      getProductInfo(String(param.Product));
    }
  }, [param]);

  const currentPrice = ProductData?.variants[0].salePrice || 0;
  const discountedPrice =
    ProductData?.discount && ProductData.discount > 0
      ? currentPrice * (1 - ProductData.discount / 100)
      : currentPrice;

  const handleAddToCart = async (attrId: string, qty: number) => {
    if (attrId) {
      const data: CartData[] = [
        {
          attributeID: attrId,
          qty: qty,
        },
      ];
      await addToServerCart(data);
      functionCalling();
    }
  };
  const handleAddToWishList = async (attrId: string, qty: number) => {
    if (attrId) {
      const data: CartData[] = [
        {
          attributeID: attrId,
          qty: qty,
        },
      ];
      await addToServerWishList(data);
      functionCalling();
    }
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setReviewImages([...reviewImages, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setReviewImages(reviewImages.filter((_, i) => i !== index));
  };

  const AddReview = async () => {
    const token = localStorage.getItem("customerToken");
    if (!token) return alert("No Token Found");
    else {
      try {
        setLoading(true);
        const imageUrl = await Promise.all(
          reviewImages.map((item) => SendDataToApi(item)),
        );
        const formData = {
          productID: ID,
          rating: reviewRating,
          messagentext: reviewText,
          dataList: imageUrl.map((url) => ({
            data: url.data,
          })),
        };
        const response = await AddReviewApi(formData, String(token));
        if (response.status == 200) {
          window.location.reload();
        } else {
          alert("Could Not Add Review");
        }
      } finally {
        setLoading(false);
      }
    }
  };
  const groupedImages =
    ProductData?.variants?.reduce(
      (acc, variant) => {
        const color = variant.values[0].varientValue;

        if (!color) return acc;

        if (!acc[color]) {
          acc[color] = [];
        }

        variant.images.forEach((image) => {
          if (!acc[color].some((img) => img.urlID === image.urlID)) {
            acc[color].push(image);
          }
        });

        return acc;
      },
      {} as Record<string, { urlID: string; url: string }[]>,
    ) ?? {};

  const selectedVariant = ProductData?.variants.find(
    (item) => item.varientID === variantID,
  );

  const variants = ProductData?.variants ?? [];

  useEffect(() => {
    const filteredVariants = variants.filter((variant) =>
      variant.values.some((v) => v.varientValue === variantValue),
    );
    console.log(filteredVariants);
    const grouped = filteredVariants.reduce<Record<string, GroupedVariant>>(
      (acc, variant) => {
        variant.values.forEach((value: VariantValue) => {
          if (!acc[value.variantName]) {
            acc[value.variantName] = {
              headerText: value.variantName,
              values: [],
            };
          }

          if (
            !acc[value.variantName].values.some(
              (v) => v.attributeID === value.attributeID,
            )
          ) {
            acc[value.variantName].values.push({
              attributeID: value.attributeID,
              attributeName: value.varientValue,
            });
          }
        });

        return acc;
      },
      {},
    );
    const formData = Object.values(grouped);
    console.log(formData);
    setVarintList(formData);
    const defaultSelected = formData.map(
      (group) => group.values[0].attributeID,
    );

    setSelectedVariants(defaultSelected);
  }, [variants, variantValue]);

  const filterVarientLabel = ProductData?.variants.find(
    (item) => item.varientID === variantID,
  );
  const filterImageThumnail = ProductData?.variants.find(
    (item) => item.varientID === variantID,
  );

  useEffect(() => {
    const variant = ProductData?.variants.find((item) =>
      item.images.some((img) => img.urlID === selectedImage),
    );

    if (variant) {
      setVaraintID(variant.varientID);
      setVaraintValue(variant.values[0].varientValue);
    }
  }, [selectedImage, ProductData]);
  useEffect(() => {
    const filterImageThumnail = ProductData?.variants.find(
      (item) => item.varientID === variantID,
    );
    if (filterImageThumnail) {
      setSelectedYThumbNailImage(filterImageThumnail.images[0].urlID);
      setImageUrl(filterImageThumnail.images[0].url);
      setdefaultImageUrl(filterImageThumnail.images[0].url);
    }
  }, [variantID, ProductData]);
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="relative aspect-square">
                  <img
                    src={
                      imageUrl ||
                      "https://media.istockphoto.com/id/1980276924/vector/no-photo-thumbnail-graphic-element-no-found-or-available-image-in-the-gallery-or-album-flat.jpg?s=612x612&w=0&k=20&c=ZBE3NqfzIeHGDPkyvulUw14SaWfDj2rZtyiKv3toItk="
                    }
                    alt={ProductData?.productName || "Product image"}
                    className="w-full h-full object-cover"
                  />
                  {ProductData?.discount && ProductData.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                      -{ProductData.discount}%
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-3 overflow-x-auto">
                  {filterImageThumnail?.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedYThumbNailImage(img.urlID);
                        setImageUrl(img.url);
                        setdefaultImageUrl(img.url);
                      }}
                      onMouseEnter={() => setImageUrl(img.url)}
                      onMouseLeave={() => setImageUrl(defaultImageUrl)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                        selectedYThumbNailImage === img.urlID
                          ? "border-gray-900"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`Product image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                {/* Store Name */}
                <div className="text-sm text-gray-500 mb-2">
                  {ProductData?.storeName || "Store Name"}
                </div>

                {/* Title */}
                <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                  {ProductData?.productName || "Product Name"}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-900">
                      {ProductData?.rating?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                  <span className="text-gray-400">|</span>
                  <span className="text-sm text-gray-500">
                    {ProductData?.review?.filter((r) => r.rating > 0).length ||
                      0}{" "}
                    reviews
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="text-sm text-gray-500">
                    SKU: {ProductData?.shortCode || "N/A"}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {discountedPrice.toLocaleString()}
                    </span>
                    {ProductData?.discount &&
                      ProductData.discount > 0 &&
                      currentPrice > 0 && (
                        <>
                          <span className="text-lg text-gray-400 line-through">
                            {currentPrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-green-600 font-medium">
                            Save {(currentPrice - discountedPrice).toFixed(2)}
                          </span>
                        </>
                      )}
                  </div>
                </div>

                {/* Thumbnails */}

                <div className="p-4 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900 mb-2 uppercase">
                    {filterVarientLabel?.values[0].variantName || ""}:{" "}
                    {filterVarientLabel?.values[0].varientValue || ""}
                  </h3>
                  <div className="flex gap-3 overflow-x-auto">
                    {Object.entries(groupedImages).map(
                      ([color, images], idx) => {
                        const firstImage = images[0];

                        if (!firstImage) return null;

                        return (
                          <button
                            key={color}
                            onClick={() => {
                              setSelectedImage(firstImage.urlID);
                              setVaraintValue(
                                filterVarientLabel?.values[0].varientValue ||
                                  "",
                              );
                            }}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                              selectedImage === firstImage.urlID
                                ? "border-gray-900"
                                : "border-gray-200"
                            }`}
                          >
                            <img
                              src={firstImage.url}
                              alt={`Product color ${color}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>
                <div className="p-4 border-t border-gray-100">
                  {varintList?.map((item, index) => (
                    <div key={item.headerText}>
                      {index !== 0 && (
                        <>
                          <h4>{item.headerText}</h4>

                          {item.values.map((val, valueIndex) => (
                            <button
                              key={val.attributeID}
                              onClick={() => {
                                setSelectedVariants((prev) => {
                                  const filtered = prev.filter(
                                    (id) =>
                                      !item.values.some(
                                        (groupVal) =>
                                          groupVal.attributeID === id,
                                      ),
                                  );

                                  // Add newly selected value
                                  return [...filtered, val.attributeID];
                                });
                              }}
                              className={`px-2 py-2 ml-2 border rounded-md hover:bg-gray-100 ${
                                selectedVariants.includes(val.attributeID)
                                  ? "border-gray-900"
                                  : "border-gray-200"
                              }`}
                            >
                              {val.attributeName}
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => handleAddToCart(attribuetID, quantity)}
                  //disabled={!isInStock || !selectedVariantValue}
                  className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => handleAddToWishList(attribuetID, quantity)}
                  className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                  >
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="border-b border-gray-100">
              <div className="flex gap-6 px-6">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`py-4 text-sm font-medium transition relative ${
                    activeTab === "description"
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Description
                  {activeTab === "description" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("specifications")}
                  className={`py-4 text-sm font-medium transition relative ${
                    activeTab === "specifications"
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Specifications
                  {activeTab === "specifications" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`py-4 text-sm font-medium transition relative ${
                    activeTab === "reviews"
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Reviews (
                  {ProductData?.review?.filter((r) => r.rating > 0).length || 0}
                  )
                  {activeTab === "reviews" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                  )}
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === "description" && (
                <div className="space-y-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {ProductData?.description || "No description available"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Dimensions & Weight
                        </p>
                        <p className="text-sm text-gray-500">
                          Width: {ProductData?.width || 0} cm
                          <br />
                          Height: {ProductData?.height || 0} cm
                          <br />
                          Depth: {ProductData?.depth || 0} cm
                          <br />
                          Weight: {ProductData?.weight || 0} kg
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Category Info
                        </p>
                        <p className="text-sm text-gray-500">
                          Category: {ProductData?.categoryName || "N/A"}
                          <br />
                          Subcategory: {ProductData?.subCategoryName || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "specifications" && ProductData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Store Name</span>
                    <span className="text-sm text-gray-900 font-medium">
                      {ProductData.storeName}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Category</span>
                    <span className="text-sm text-gray-900 font-medium">
                      {ProductData.categoryName}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Subcategory</span>
                    <span className="text-sm text-gray-900 font-medium">
                      {ProductData.subCategoryName}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">
                      Further Category
                    </span>
                    <span className="text-sm text-gray-900 font-medium">
                      {ProductData.furtherSubCategoryName || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Rating</span>
                    <span className="text-sm text-gray-900 font-medium">
                      {ProductData.rating?.toFixed(1) || "0.0"} / 5.0
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Discount</span>
                    <span className="text-sm text-gray-900 font-medium">
                      {ProductData.discount || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">
                      Dimensions (W x H x D)
                    </span>
                    <span className="text-sm text-gray-900 font-medium">
                      {ProductData.width} x {ProductData.height} x{" "}
                      {ProductData.depth} cm
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Weight</span>
                    <span className="text-sm text-gray-900 font-medium">
                      {ProductData.weight} kg
                    </span>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Review Summary */}
                  <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
                    <div className="text-center">
                      {/* <div className="text-4xl font-bold text-gray-900">
                          {averageRating.toFixed(1)}
                        </div> */}
                      <div className="flex text-yellow-400 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 `} />
                        ))}
                      </div>
                      {/* <div className="text-sm text-gray-500 mt-1">
                          {allReviews.length} reviews
                        </div> */}
                    </div>
                    <div className="flex-1">
                      <button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                      >
                        Write a Review
                      </button>
                    </div>
                  </div>

                  {/* Review Form */}
                  {showReviewForm && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Write a Review
                        </h3>
                        <button
                          onClick={() => setShowReviewForm(false)}
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
                                  className={`w-8 h-8 ${star <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Review
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
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={AddReview}
                          //disabled={isSubmittingReview}
                          className="w-full py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
                        >
                          Submit Review
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-6">
                    {ProductData?.review && ProductData.review.length > 0 ? (
                      ProductData.review.map((review, idx) => (
                        <div
                          key={review.replyID || idx}
                          className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow duration-300"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                            <div className="flex items-start gap-3">
                              {/* Avatar */}
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-medium text-sm">
                                  {review.email?.[0]?.toUpperCase() || "U"}
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center flex-wrap gap-2 mb-1">
                                  <span className="font-semibold text-gray-900">
                                    {review.email?.split("@")[0] || "Anonymous"}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    •
                                  </span>
                                  <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3.5 h-3.5 ${
                                          i < (review.rating || 0)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-200"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                  <Calendar className="w-3 h-3" />
                                  <span>
                                    {review.date ||
                                      new Date().toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Review Message */}
                          <div className="pl-0 sm:pl-13">
                            <p className="text-gray-600 text-sm leading-relaxed mb-3">
                              {review.messagentext}
                            </p>

                            {/* Images Grid - Fixed sizing */}
                            {review.fileAttached &&
                              review.fileAttached.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {review.fileAttached
                                    .slice(0, 6)
                                    .map((img, i) => (
                                      <div
                                        key={i}
                                        className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-50"
                                        style={{
                                          width: "80px",
                                          height: "80px",
                                          flexShrink: 0,
                                        }}
                                        onClick={() => {
                                          window.open(img.data, "_blank");
                                        }}
                                      >
                                        <img
                                          src={img.data}
                                          alt={`Review image ${i + 1}`}
                                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        {i === 5 &&
                                          review.fileAttached.length > 6 && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-medium">
                                              +{review.fileAttached.length - 6}
                                            </div>
                                          )}
                                      </div>
                                    ))}
                                </div>
                              )}

                            {/* Helpful Section */}
                            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
                              <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                                <ThumbsUp className="w-3.5 h-3.5" />
                                Helpful
                              </button>
                              <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                                <MessageCircle className="w-3.5 h-3.5" />
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-500 text-sm mb-3">
                          No reviews yet
                        </p>
                        <p className="text-gray-400 text-xs">
                          Be the first to review this product!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
