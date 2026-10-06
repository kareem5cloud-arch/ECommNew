import GetDamageProductApi from "@/app/api/Controller/OnlineManager/DamageProduct/GetDamageProduct";
import GetGeneralExpenseApi from "@/app/api/Controller/OnlineManager/GeneralExpense/GetGeneralExpense";
import {
  expenseList,
  ResponseExpense,
} from "@/app/api/Types/OnlineSeller/GenralExpense/GenralExpense";
import Spinner from "@/app/ui/UseFulLComponent/Spinner/Spinner";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface propsForAddRegion {
  setDelete: (data: boolean) => void;
  setID: (data: string) => void;
  setExpenseListDelete: (data: expenseList[]) => void;
  expenseListDelete: expenseList[];
  update: (data: boolean) => void;
  setExpenseList: (data: expenseList) => void;
}
export default function GetExpenseList({
  setExpenseList,
  setDelete,
  setID,
  update,
  expenseListDelete,
  setExpenseListDelete,
}: propsForAddRegion) {
  const [DamageListData, setDamageListData] = useState<expenseList[]>([]);
  const [isloading, setisLoading] = useState(false);

  useEffect(() => {
    if (expenseListDelete) {
      setDamageListData(expenseListDelete);
    }
  }, [expenseListDelete]);

  const damageget = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("OnlineSellerToken");
      const response = await GetGeneralExpenseApi(String(token));
      if (response.status == 200) {
        const data = response.data as ResponseExpense;
        setDamageListData(data.expenseList);
      } else {
        setDamageListData([]);
      }
    } finally {
      setisLoading(false);
    }
  };
  const fetchData = (ID: string) => {
    const data = DamageListData.find((item) => item.expenseID === ID);
    if (data) {
      setExpenseList(data);
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
              key={item.expenseID}
              className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              {/* Left Side */}
              <div className="flex items-center gap-3">
                <div className="w-2 h-10 bg-blue-500 rounded-full" />
                <div className="min-w-0">
                  <p className="max-w-[450px] truncate text-sm font-semibold uppercase text-gray-900">
                    {item.expenseName}
                  </p>

                  <div className="mt-1 flex flex-wrap gap-2">
                    <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-600">
                      Amount: {item.expenseAmount}
                    </span>
                  </div>
                  <p className="mt-2 max-w-[450px] truncate text-xs   text-gray-600">
                    Description: {item.remarks}
                  </p>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchData(item.expenseID)}
                  className="p-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                >
                  <Pencil />
                </button>
                <button
                  onClick={() => {
                    setDelete(true);
                    setID(item.expenseID);
                    setExpenseListDelete(DamageListData);
                  }}
                  className="p-2 text-red-600 border border-red-600 rounded hover:bg-red-50 transition"
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
