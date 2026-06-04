import ProductGetApi from "@/app/api/Controller/OnlineSellerController/Product/GetProduct";
import {
  productList,
  responseGetProduct,
} from "@/app/api/Types/OnlineSetting/Product/Product";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
interface GetProductModifyInfomrationProps {
  setShowBasicINfoModel: (data: boolean) => void;
  initalData: (data: productList) => void;
  setShowImageListModel: (data: boolean) => void;
  refreshevent: boolean;
}

export default function GetProductList({
  setShowBasicINfoModel,
  initalData,
  setShowImageListModel,
  refreshevent,
}: GetProductModifyInfomrationProps) {
  const [isloading, setisLoading] = useState(false);
  const [productList, setProductList] = useState<productList[]>([]);
  const [Searchproduct, setSearchproduct] = useState("");

  useEffect(() => {
    if (refreshevent) {
      ProductGet();
    }
  }, [refreshevent]);
  const ProductGet = async () => {
    try {
      setisLoading(true);

      const token = localStorage.getItem("OnlineSellerToken");
      const response = await ProductGetApi(String(token));
      if (response.status == 200) {
        const data = response.data as responseGetProduct;
        setProductList(data.productList);
      } else {
        setProductList([]);
      }
    } finally {
      setisLoading(false);
    }
  };

  const modifyBasicINfo = (ID: string) => {
    setShowBasicINfoModel(true);
    const data = productList.find((item) => item.productID === ID);
    if (data) {
      initalData(data);
    }
  };

  const modifyImageINfo = (ID: string) => {
    setShowImageListModel(true);
    const data = productList.find((item) => item.productID === ID);
    if (data) {
      initalData(data);
    }
  };

  useEffect(() => {
    ProductGet();
  }, []);

  const filteredCapital = productList.filter((emp) => {
    return emp?.productName.toLowerCase().includes(Searchproduct.toLowerCase());
  });
  return (
    <>
      <div className="w-full">
        <InputFieldGeneric
          label="Product"
          type="text"
          required={false}
          placeholder="Enter Product"
          SateChange={Searchproduct}
          setSateChange={setSearchproduct}
          disabled={false}
        />
      </div>
      <div className="space-y-4 mt-2 ">
        {isloading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : filteredCapital.length === 0 ? (
          <div className="flex justify-center py-10">
            <span className="text-lg font-semibold text-gray-500">
              No Record Found
            </span>
          </div>
        ) : (
          filteredCapital.map((item) => (
            <div
              key={item.productID}
              className="bg-white shadow-md rounded-lg hover:shadow-lg transition overflow-hidden"
            >
              <div className="flex justify-between md:flex-row gap-3">
                {/* SECTION 1 - Image with Camera Button - FIXED SIZE */}
                <div className="relative group p-2 flex-shrink-0">
                  <div className="w-12 h-12">
                    <img
                      src={
                        item.images?.[0]?.url ||
                        "https://via.placeholder.com/150"
                      }
                      alt={item.productName}
                      className="w-full h-full object-cover rounded"
                    />
                    {/* Camera button on top of image */}
                    <button
                      onClick={() => modifyImageINfo(item.productID)}
                      className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        top: "8px",
                        left: "8px",
                        right: "8px",
                        bottom: "8px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* SECTION 2 - Product Name and Description - FIXED HEIGHT & WIDTH */}
                <div className="flex items-center gap-2 p-4 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="h-12 flex flex-col justify-between">
                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 break-words">
                        {item.productName}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2 break-words">
                        {item.description || "No description available"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => modifyBasicINfo(item.productID)}
                    className="flex-shrink-0 text-xs border border-yellow-500 p-1 rounded-md text-yellow-600 hover:text-yellow-800"
                  >
                    <Pencil />
                  </button>
                </div>

                {/* SECTION 3 - Only Variant Names - FIXED WIDTH */}
                <div className="flex items-center gap-2 p-4 flex-shrink-0 w-48">
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    Variants:
                  </span>
                  <div className="flex flex-wrap gap-1 min-w-0 flex-1">
                    {item.variants && item.variants.length > 0 ? (
                      item.variants.map((variant, idx) => (
                        <span
                          key={variant.varientID || idx}
                          className="text-xs text-gray-700 truncate"
                        >
                          {variant.variantName}
                          {idx < item.variants.length - 1 && ","}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 truncate">
                        None
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      console.log("Edit variants:", item.productID)
                    }
                    className="flex-shrink-0 text-xs border border-yellow-500 p-1 rounded-md text-yellow-600 hover:text-yellow-800"
                  >
                    <Pencil />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
