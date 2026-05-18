"use client";
import Spinner from "@/component/spinner/page";
import { ChevronLeft, ChevronRight, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import AddSalesman from "@/api/lib/MainDashbaord/SalemanApi/AddSalesman";

import GetSalesman from "@/api/lib/MainDashbaord/SalemanApi/GetSalesman";
/*
Code by @Adil Dated: 2-2-26

*/


interface SalesmanList {
  salesmanID: string;
  salesmanName: string;
}

export default function Salesman() {
  const [showList, setShowList] = useState(true);
  const [loading, setLoading] = useState(true);
  const [Update, setUpdate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isTrue, setIsTrue] = useState(false);
  const [responseBack, setResponseBack] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const [salesmanName, setSalesmanName] = useState("");
  const [salesmanList, setSalesmanList] = useState<SalesmanList[]>([]);
  const [ID, setID] = useState("");

 const getSalesman = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    const response = await GetSalesman(String(token));

    // Cast the response to any or a specific interface to access the property
    if (response.status === 200 && response.data) {
      const data = response.data as any; 
      setSalesmanList(data.salesmanList || []);
    }
  } catch (error) {
    console.error("Failed to fetch:", error);
  } finally {
    setLoading(false);
  }
};

  const addSalesman = async () => {
  try {
   
    setisLoading(true);
    const token = localStorage.getItem("token");
    console.log("new: "+token);
    const response = await AddSalesman( salesmanName , String(token));
    
    if (response.status === 200 || response.status === 201) {
      setResponseBack("Record Added Successfully");
      setIsTrue(true);
      setSalesmanName("");
      getSalesman(); // Refresh the list
      setShowList(true);
    } else {
      setResponseBack(response.message);
      setIsTrue(true);
    }
  } finally {
    setisLoading(false);
  }
};

  const fetchData = (id: string) => {
    setShowList(false);
    setUpdate(true);
    const data = salesmanList.find((item) => item.salesmanID === id);
    if (data) {
      setID(data.salesmanID);
      setSalesmanName(data.salesmanName);
    }
  };

  useEffect(() => {
    getSalesman();
  }, []);

  useEffect(() => {
    if (!responseBack) return;
    const timer = setTimeout(() => {
      setIsTrue(false);
      setResponseBack("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [responseBack]);

  return (
    <div className="w-full relative">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Salesman Management</h1>
      
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center">
            <h2 className="text-xl font-semibold text-gray-800">Delete Confirmation</h2>
            <p className="text-gray-500 mt-2">Are you sure you want to delete this salesman?</p>
            <div className="mt-6 flex justify-center gap-4">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">Cancel</button>
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => { setShowList(!showList); setUpdate(false); setSalesmanName(""); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {showList ? <><ChevronRight size={18} /> Add New</> : <><ChevronLeft size={18} /> Show List</>}
          </button>
        </div>

        {showList ? (
          <>
            {loading ? (
              <div className="flex justify-center py-10"><Spinner /></div>
            ) : (
              <div className="space-y-2">
                {salesmanList.length > 0 ? (
                  salesmanList.map((item) => (
                    <div key={item.salesmanID} className="p-4 border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">{item.salesmanName}</h3>
                      <div className="flex gap-4">
                        <button onClick={() => fetchData(item.salesmanID)} className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"><Pencil className="w-5 h-5" /></button>
                        <button onClick={() => { setIsOpen(true); setID(item.salesmanID); }} className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"><Trash className="w-5 h-5" /></button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full bg-red-100 text-red-800 text-center px-4 py-3 rounded">No Record Found</div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-5 mt-2">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Salesman Name <span className="text-red-500">*</span>
              </label>
              <input
                value={salesmanName}
                onChange={(e) => setSalesmanName(e.target.value) }
                type="text"
                placeholder="Enter Salesman Name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none text-gray-900"
              />
              
            </div>

            {isTrue && responseBack && (
              <div className={`w-full text-center px-4 py-3 mb-2 rounded ${responseBack.includes("Successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {responseBack}
              </div>
            )}

            <div className="flex justify-end pt-3">
              <button
                type="button"
               onClick={Update ? undefined : () => salesmanName.trim() && addSalesman()}
// Also, add 'disabled={isLoading || !salesmanName.trim()}' to the button for better UX // Link your modify function to Update when ready
                className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
              >
                {isLoading ? (Update ? "Updating..." : "Saving...") : (Update ? "Update" : "Save")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}