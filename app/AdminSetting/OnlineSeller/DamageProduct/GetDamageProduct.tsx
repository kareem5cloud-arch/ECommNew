import GetDamageProductApi from "@/app/api/Controller/OnlineManager/DamageProduct/GetDamageProduct";
import {
  DamageList,
  ResponseDamageProduct,
} from "@/app/api/Types/OnlineSeller/DamageProduct/DamageProduct";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  update: (data: boolean) => void;
  setDamageList: (data: DamageList) => void;
}
export default function GetDamageProductList({
  setDamageList,
  update,
}: propsForAddRegion) {
  const [DamageListData, setDamageListData] = useState<DamageList[]>([]);
  const [isloading, setisLoading] = useState(false);

  const damageget = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("OnlineSellerToken");
      const response = await GetDamageProductApi(String(token));
      if (response.status == 200) {
        const data = response.data as ResponseDamageProduct;
        setDamageListData(data.data);
      } else {
        setDamageListData([]);
      }
    } finally {
      setisLoading(false);
    }
  };
  const fetchData = (ID: string) => {
    const data = DamageListData.find((item) => item.dID === ID);
    if (data) {
      console.log(data);
      setDamageList(data);
      update(true);
    }
  };
  useEffect(() => {
    damageget();
  }, []);
  return (
    <>
      <div className="space-y-4">
        {isloading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : DamageListData.length === 0 ? (
          <div className="flex justify-center py-10">
            <span className="text-lg font-semibold text-gray-500">
              No Record Found
            </span>
          </div>
        ) : (
          DamageListData.map((item) => (
            <div
              key={item.dID}
              className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              {/* Left Side */}
              <div className="flex items-center gap-3">
                <div className="w-2 h-10 bg-blue-500 rounded-full" />
                <div className="min-w-0">
                  <p className="max-w-[450px] truncate text-sm font-semibold uppercase text-gray-900">
                    {item.productName}
                  </p>

                  <div className="mt-1 flex flex-wrap gap-2">
                    {item.valuesList.map((variant, variantIndex) => (
                      <span
                        key={variantIndex}
                        className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-600"
                      >
                        {variant.value}
                      </span>
                    ))}
                    <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-600">
                      Qty: {item.qty}
                    </span>
                  </div>
                  <p className="mt-2 max-w-[450px] truncate text-xs   text-gray-600">
                    Reason: {item.remarks}
                  </p>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchData(item.dID)}
                  className="p-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                >
                  <Pencil />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
