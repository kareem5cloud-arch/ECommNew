import GetSalesman from "@/api/lib/MainDashbaord/SalemanApi/GetSalesman";
import GetTillForSalesMan from "@/api/lib/MainDashbaord/TillCreate/GetTillForSpecficSaleMan";
import AddCustomer from "@/api/lib/PosIntegration/Customer/AddCustomer";
import GetCustomer from "@/api/lib/PosIntegration/Customer/GetCustomer";
import GetProductVarient from "@/api/lib/PosIntegration/ProductGet/FecthProductVareint/FetchProductVareint";
import GetProductBarcode from "@/api/lib/PosIntegration/ProductGet/GetByBarcode/getByBarcode";
import GetProductSalesMan from "@/api/lib/PosIntegration/ProductGet/productsGetSalesMan";
import SearchByInvoice from "@/api/lib/PosIntegration/Return/SearchHistory/SearchByInvoice/SearchByInvoice";
import SearchByProduct from "@/api/lib/PosIntegration/Return/SearchHistory/SearchByProduct/SearchByProduct";
import AddSalePos from "@/api/lib/PosIntegration/Sale/SaleAdd/SaleAdd";
import GetSalePosInvoice from "@/api/lib/PosIntegration/Sale/SaleGetInvoice/SaleGetInvoice";
import GetProduct from "@/api/lib/product/GetProduct/GetProduct";
import GetInitalStoreSalesMan from "@/api/lib/store/GetStoreSalesMan/GetStoreSalesMan";
import {
  CustomerData,
  ResponseCustomerGetData,
} from "@/api/types/PosIntegration/Customer/CustomerType";
import {
  ListItem,
  responseGetSale,
  Sale,
} from "@/api/types/PosIntegration/Sale/Sale";
import {
  Product,
  ProductApiResponse,
  ProductApiResponseSalesMan,
  VariantbyProductID,
  varinetMessage,
} from "@/api/types/product/getProduct";
import { StoreApiResponse, storeInital } from "@/api/types/storeGet";
import {
  Calendar,
  Coins,
  Mail,
  MapPin,
  Notebook,
  Phone,
  Plus,
  Tag,
  Trash,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Salesman {
  salesmanID: string;
  salesmanName: string;
}
interface SalesmanApiResponse {
  salesmanList: Salesman[];
  message?: string;
}
interface RespiosneGet {
  message: string;
  tillList: TillList[];
}
interface TillList {
  tillID: string;
  tillName: string;
  tillSubList: TillSubList[];
}
interface TillSubList {
  listID: string;
  productID: string;
  productName: string;
}

interface VarintList {
  productName: string;
  varientID: string;
  variantName: string;
  discount: number;
  variantValues: variantValues[];
}
interface variantValues {
  attributeID: string;
  varientValue: string;
  costPrice: number;
  salePrice: number;
  qty: number;
  barcode: string;
}
interface newItem {
  attributeID: string;
  productName: string;
  qty: number;
  varientValue: string;
  price: number;
  barcode: string;
  stockQty: number;
  discount: number;
}
interface responseList {
  message: string;
  showHistory: historyData[];
}

interface historyData {
  customerID: string;
  customerName: string;
  saleID: string;
  productID: string;
  productName: string;
  attributeID: string;
  saleDate: string;
  varientValue: string;
  barcode: string;
  qty: number;
  salePrice: number;
  maxQty: number;
}
interface ProductApiResponseBarcode {
  messaga: string;
  productList: BarcodeResposne[];
}
type BarcodeResposne = {
  productID: string;
  barcode: string;
  productName: string;
  attributeID: string;
  varientValue: string;
  costPrice: number;
  salePrice: number;
  qty: number;
};
export default function SaleForm() {
  const router = useRouter();
  const [TillID, setTillID] = useState("");
  const [Loading1, setLoading1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [Email, setEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [address, setAddress] = useState("");
  const [AddCustomerForm, setAddCustomerForm] = useState(false);
  const [CustomerList, setCustomerList] = useState<CustomerData[]>([]);
  const [salesmanList, setSalesmanList] = useState<Salesman[]>([]);
  const [productList2, setProductList2] = useState<Product[]>([]);
  const [productList3, setProductList3] = useState<BarcodeResposne[]>([]);
  const [TillList, setTillList] = useState<TillList[]>([]);
  const [vareintList, setvareintList] = useState<VariantbyProductID[]>([]);
  const [InvocieHistory, setInvocieHistory] = useState<historyData[]>([]);
  const [selectedSalesman, setSelectedSalesman] = useState("");
  const [Customer, setCustomer] = useState("");
  const [Description, setDescription] = useState("");
  const [SaleDate, setSaleDate] = useState("");
  const [Barcode, setBarcode] = useState("");
  const [ProductID, setProductID] = useState("");
  const [productName, setProductName] = useState("");
  const [VarintShowList, setVarintShowList] = useState(false);
  const [VarintListInPopUp, setVarintListInPopUp] = useState<VarintList[]>([]);
  const [newItem, setNewItem] = useState<newItem[]>([]);
  const [AmountPaid, setAmountPaid] = useState(0);
  const [Discount, setDiscount] = useState(0);
  const [RescponseBack, setRersponseBack] = useState("");
  const [ShowMessage, setShowMessage] = useState(false);
  const [ReturnMenu, setReturnMenu] = useState(false);
  const [selectedOption, setSelectedOption] = useState("inovice");
  const [SaleList, setSaleList] = useState<Sale[]>([]);

  const CustomerGet = async () => {
    const token = localStorage.getItem("tokenPosSale");
    const response = await GetCustomer(String(token));
    if (response.status === 200 || response.status === 201) {
      const data = response.data as ResponseCustomerGetData;
      setCustomerList(data.customerList || []);
      setCustomer(data.customerList[0].customerID);
    } else if (response.status === 401) {
      router.push("/sellerlogin");
    }
  };
  const addCustoemr = async () => {
    const token = localStorage.getItem("tokenPosSale");
    if (!token) return router.push("/posSalePoint/login");
    try {
      setLoading1(true);
      const formData = {
        customerName: customerName,
        phoneNo: phoneNo,
        email: Email,
        description: "",
        openingBalance: 0,
        address: address,
      };
      const response = await AddCustomer(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        CustomerGet();
        setEmail("");
        setAddress("");
        setCustomerName("");
        setPhoneNo("");
        setAddCustomerForm(false);
        // setResponseBack(response.data.message || "Customer Added Successfully");
        // setShowMessage(true);
      } else if (response.status === 401) {
        router.push("/posSalePoint/login");
      }
    } catch (error) {
    } finally {
      setLoading1(false);
    }
  };
  const fetchSalesman = async () => {
    const token = localStorage.getItem("tokenPosSale");
    if (!token) return;

    try {
      const response = await GetSalesman(String(token));

      if (response.status === 200 || response.status === 201) {
        const data = response.data as SalesmanApiResponse;

        setSalesmanList(data.salesmanList || []);
        setSelectedSalesman(data.salesmanList[0].salesmanID);
      }
    } catch (error) {
      console.error("Error fetching salesman list", error);
    }
  };
  const saleGet = async () => {
    const token = localStorage.getItem("tokenPosSale");
    const response = await GetSalePosInvoice(String(token));
    if (response.status === 200 || response.status === 201) {
      const data = response.data as responseGetSale;
      console.log("New Sale Data", data);
      setSaleList(data.saleList);
    }
  };
  const getProductHistory = async (name: string) => {
    const token = localStorage.getItem("tokenPosSale");
    if (!token) return;

    const data = productList2.find((item) => item.productName === name);
    if (data) {
      const response = await SearchByProduct(token, data.productID);

      if (response.status === 200 || response.status === 201) {
        const data = response.data as responseList;
        console.log(data.showHistory);
        setInvocieHistory(data.showHistory || []);
      }
    }
  };
  const getInvoiceHistory = async (ID: string) => {
    const token = localStorage.getItem("tokenPosSale");

    if (!token) return;

    const response = await SearchByInvoice(token, ID);
    if (response.status === 200 || response.status === 201) {
      const data = response.data as responseList;

      setInvocieHistory(data.showHistory || []);
      setCustomerName(data.showHistory[0].customerName);
    }
  };
  const getTill = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("tokenPosSale");
      const response = await GetTillForSalesMan(String(token));

      if (response.status === 200) {
        const data = response.data as RespiosneGet;

        if (data?.tillList?.length > 0) {
          setTillList(data.tillList);
          setTillID(data.tillList[0].tillID);
        } else {
          setTillList([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!productName || productName.trim().length === 0) return;

    const delayDebounce = setTimeout(() => {
      getProduct();
    }, 50); // ⏱ 500ms debounce

    return () => clearTimeout(delayDebounce); // cleanup
  }, [productName]);

  const getProductBarcode = async (barcode: string) => {
    const token = localStorage.getItem("tokenPosSale");

    if (!token) return;

    const response = await GetProductBarcode(token, barcode);

    if (response.status === 200 || response.status === 201) {
      const data = response.data as ProductApiResponseBarcode;
      setProductList3(data.productList || []);
    }
  };

  const addInTheList = (barcode: string) => {
    const data = productList3.find((item) => item.barcode === barcode);
    if (data) {
      setNewItem((prev) => {
        // **Make sure we only have one entry per attributeID**
        const existingItem = prev.find(
          (item) => item.attributeID === data.attributeID,
        );

        if (existingItem) {
          setBarcode("");
          // Item exists → increment qty by 1
          return prev.map((item) =>
            item.attributeID === data.attributeID
              ? { ...item, qty: item.qty + 1 }
              : item,
          );
        }

        // Item does not exist → add new entry
        const newEntry: newItem = {
          attributeID: data.attributeID,
          productName: data.productName,
          qty: 1,
          varientValue: data.varientValue,
          price: data.salePrice,
          barcode: data.barcode,
          stockQty: data.qty,
          discount: 0,
        };
        setBarcode("");
        return [...prev, newEntry];
      });
    }
  };

  const getProduct = async () => {
    const token = localStorage.getItem("tokenPosSale");

    if (!token) return;

    const response = await GetProductSalesMan(token, TillID, productName);

    if (response.status === 200 || response.status === 201) {
      const data = response.data as ProductApiResponseSalesMan;
      console.log(data);
      const newData = data.productList.filter(
        (item) => item.storeSale !== "OnlineStore",
      );
      if (newData) {
        setProductList2(newData || []);
      } else {
        setProductList2([]);
      }
    }
  };
  const varinetList = async (ID: string) => {
    const token = localStorage.getItem("tokenPosSale");
    const response = await GetProductVarient(String(token), ID);
    if (response.status === 200 || response.status === 201) {
      const data = response.data as varinetMessage;
      console.log(data);
      setVarintListInPopUp(data.variants);
    }
  };
  const addItemForReturnListFromInvoice = async (
    ID: string,
    attribuetID: string,
  ) => {
    // Make sure varinetList updates VarintListInPopUp
    await varinetList(ID);

    // Find the variant
    const variantValueWithProduct = VarintListInPopUp.flatMap((item) =>
      item.variantValues.map((variant) => ({
        ...variant,
        productName: item.productName,
        discount: item.discount,
      })),
    ).find((v) => v.attributeID === attribuetID);

    if (!variantValueWithProduct) return;

    setNewItem((prev) => {
      const existingItem = prev.find(
        (item) => item.attributeID === variantValueWithProduct.attributeID,
      );

      if (existingItem) {
        // Subtract quantity if it already exists
        return prev.map((item) =>
          item.attributeID === variantValueWithProduct.attributeID
            ? { ...item, qty: item.qty - 1 }
            : item,
        );
      }

      // Otherwise, add new item normally
      const newEntry: newItem = {
        attributeID: variantValueWithProduct.attributeID,
        productName: variantValueWithProduct.productName,
        qty: -1,
        varientValue: variantValueWithProduct.varientValue,
        price: variantValueWithProduct.salePrice,
        barcode: variantValueWithProduct.barcode,
        stockQty: -variantValueWithProduct.qty,
        discount: variantValueWithProduct.discount,
      };
      return [...prev, newEntry];
    });
  };

  const DeletFromTableList = (ID: string) => {
    const data = newItem.filter((item) => item.attributeID !== ID);
    setNewItem(data);
  };
  const FetchAttribuetToAddInATable = (ID: string) => {
    // keep productName with each variantValue
    const variantValueWithProduct = VarintListInPopUp.flatMap((item) =>
      item.variantValues.map((variant) => ({
        ...variant,
        productName: item.productName,
        discount: item.discount,
      })),
    ).find((v) => v.attributeID === ID);

    if (!variantValueWithProduct) return;

    setNewItem((prev) => {
      const existingItem = prev.find(
        (item) => item.attributeID === variantValueWithProduct.attributeID,
      );

      if (existingItem) {
        return prev.map((item) =>
          item.attributeID === variantValueWithProduct.attributeID
            ? { ...item, qty: item.qty + 1 }
            : item,
        );
      }

      const newEntry: newItem = {
        attributeID: variantValueWithProduct.attributeID,
        productName: variantValueWithProduct.productName,
        qty: 1,
        varientValue: variantValueWithProduct.varientValue,
        price: variantValueWithProduct.salePrice,
        barcode: variantValueWithProduct.barcode,
        stockQty: variantValueWithProduct.qty,
        discount: variantValueWithProduct.discount,
      };

      return [...prev, newEntry];
    });
  };

  const getItemTotal = (item: any) => {
    const totalWithoutDiscount = item.qty * item.price;
    const discountAmount = (item.price * item.discount) / 100; // discount only once
    return totalWithoutDiscount - discountAmount;
  };
  const totalSum = newItem.reduce(
    (total, item) => total + getItemTotal(item),
    0,
  );
  useEffect(() => {
    const getItemTotal = (item: any) => {
      const totalWithoutDiscount = item.qty * item.price;
      const discountAmount = (item.price * item.discount) / 100; // discount only once
      return totalWithoutDiscount - discountAmount;
    };
    const totalSum = newItem.reduce(
      (total, item) => total + getItemTotal(item),
      0,
    );
    setAmountPaid(totalSum);
  }, [newItem]);

  const SaleAdd = async () => {
    try {
      setLoading(true);
      const listForRequest: ListItem[] = newItem.map((item) => ({
        attributeID: item.attributeID,
        qty: item.qty,
        amount: item.price,
        remakrs: "",
      }));
      const formData = {
        postingDate: SaleDate,
        customerID: Customer,
        amountPaid: AmountPaid,
        adjustment: Discount,
        totalBill: totalSum,
        remarks: Description,
        salesmanID: selectedSalesman,
        list: listForRequest,
      };
      const token = localStorage.getItem("tokenPosSale");
      console.log(formData);
      const response = await AddSalePos(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        saleGet();
        getTill();
        setProductName("");
        setCustomerName("");
        setSaleDate("");
        setNewItem([]);
        setSelectedSalesman("");
        setAmountPaid(0);
        setDiscount(0);
        setDescription("");
        setRersponseBack(response.data.message || "Sale Added Successfully");
        setShowMessage(true);
      } else if (response.status === 400) {
        setRersponseBack(
          response.data.message || "PLease Fill in All Required Fields",
        );
        setShowMessage(false);
      } else {
        setRersponseBack(
          response.data.message ||
            "Something Went Wrong. Please Try Again later.",
        );
        setShowMessage(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const date = new Date().toISOString().split("T")[0];
    setSaleDate(date);
    saleGet();
    fetchSalesman();
    CustomerGet();
    getTill();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (ShowMessage) {
        setRersponseBack("");
        setShowMessage(false);
      }
    }, 2000);
  }, [ShowMessage, RescponseBack]);
  return (
    <>
      {AddCustomerForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md ">
            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-800">
              Customer Add
            </h2>
            <div className="mt-2 ">
              <label className="block text-gray-700 font-medium mb-2">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <User className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  name="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter Customer Name"
                  className="w-full bg-transparent outline-none text-gray-900"
                />
              </div>
            </div>

            {/* Email */}

            {/* Phone */}
            <div className="mt-2 ">
              <label className="block text-gray-700 font-medium mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <Phone className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  name="phone"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full bg-transparent outline-none text-gray-900"
                />
              </div>
            </div>
            <div className="mt-2 ">
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <Mail className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  name="phone"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full bg-transparent outline-none text-gray-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Address
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <MapPin className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full address"
                  className="w-full bg-transparent outline-none text-gray-900 resize-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between gap-4">
              <button
                onClick={() => setAddCustomerForm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  addCustoemr();
                }}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
              >
                {Loading1 ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
      {VarintShowList && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-4xl">
            {/* Close Button */}
            <div className="flex justify-end mb-4">
              <span
                onClick={() => setVarintShowList(false)}
                className="text-gray-600 text-xl hover:text-red-500 cursor-pointer"
              >
                X
              </span>
            </div>

            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Item List
            </h2>
            {/* Table Wrapper for scrolling */}
            <div className="overflow-x-auto w-full">
              {VarintListInPopUp.map((item) => (
                <>
                  <h1 key={item.varientID} className="text-lg font-bold">
                    {item.variantName}
                  </h1>
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-700 font-medium">
                          Barcode
                        </th>
                        <th className="px-4 py-2 text-center text-gray-700 font-medium">
                          Variant
                        </th>
                        <th className="px-4 py-2 text-center text-gray-700 font-medium">
                          Quantity
                        </th>
                        <th className="px-4 py-2 text-center text-gray-700 font-medium">
                          Original Price
                        </th>
                        <th className="px-4 py-2 text-center text-gray-700 font-medium">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.variantValues.map((item2) => (
                        <tr className="border-t">
                          <td className="px-4 py-2 text-left">
                            {item2.barcode}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {item2.varientValue}
                          </td>
                          <td className="px-4 py-2 text-center">{item2.qty}</td>
                          <td className="px-4 py-2 text-center">
                            {item2.salePrice}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              onClick={() =>
                                FetchAttribuetToAddInATable(item2.attributeID)
                              }
                              className="px-2 py-1 bg-yellow-500 text-white rounded-md"
                            >
                              <Plus />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ))}
            </div>
          </div>
        </div>
      )}
      {ReturnMenu && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-5xl">
            {/* Close Button */}
            <div className="flex justify-end mb-4">
              <span
                onClick={() => setReturnMenu(false)}
                className="text-gray-600 text-xl hover:text-red-500 cursor-pointer"
              >
                X
              </span>
            </div>
            <div className="p-6  rounded-xl w-full">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Search By
              </h2>

              <div className="flex flex-wrap gap-4 ">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="inline-radio"
                    value="inovice"
                    checked={selectedOption === "inovice"}
                    onChange={(e) => {
                      setSelectedOption(e.target.value);
                      setProductID("");
                      setInvocieHistory([]);
                    }}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 text-sm font-medium">
                    Invoice No
                  </span>
                </label>
                {/* Option 1 */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="inline-radio"
                    value="product"
                    checked={selectedOption === "product"}
                    onChange={(e) => {
                      setSelectedOption(e.target.value);
                      setInvoiceNo("");
                      setInvocieHistory([]);
                    }}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 text-sm font-medium">
                    Product
                  </span>
                </label>

                {/* Option 2 */}
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-6 mt-2">
                {selectedOption === "product" ? (
                  <div>
                    <label className="text-gray-600 font-medium mb-2 block">
                      Product Name
                    </label>
                    <div className="flex gap-2">
                      <input
                        list="productOptions"
                        value={productName}
                        onChange={(e: any) => {
                          setProductName(e.target.value);
                          getProductHistory(e.target.value);
                        }}
                        placeholder="Select or type product"
                        className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <datalist id="productOptions">
                        {productList2.length === 0 ? (
                          <option value="" disabled>
                            No products found
                          </option>
                        ) : (
                          productList2.map((item) => (
                            <option
                              key={item.productID}
                              value={item.productName}
                            >
                              {item.productName}
                            </option>
                          ))
                        )}
                      </datalist>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-gray-600 font-medium mb-2 block">
                      Select Invoice
                    </label>
                    <div className="flex gap-2">
                      <input
                        list="productOptions"
                        value={invoiceNo}
                        onChange={(e) => {
                          setInvoiceNo(e.target.value);
                          const value = e.target.value;
                          const data = SaleList.find(
                            (item) => item.invoiceNo === Number(value),
                          );
                          if (data) {
                            getInvoiceHistory(data.saleID);
                          }
                        }}
                        placeholder="Select or type Invoice No"
                        className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <datalist id="productOptions">
                        {SaleList.length === 0 ? (
                          <option value="" disabled>
                            No Invoice found
                          </option>
                        ) : (
                          SaleList.map((item) => (
                            <option key={item.saleID} value={item.invoiceNo}>
                              {item.invoiceNo}
                            </option>
                          ))
                        )}
                      </datalist>
                    </div>
                  </div>
                )}
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-2">
                    Customer Name
                  </label>

                  <div className="flex gap-2">
                    <div className="w-full flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                      <User className="text-gray-400 mr-2" size={18} />

                      <input
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Customer Name"
                        readOnly
                        className="w-full bg-transparent outline-none text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full overflow-x-auto">
                <table className="w-full border border-gray-50 rounded-lg overflow-hidden ">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-700 font-medium">
                        Sale Date
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700 font-medium">
                        Barcode
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700 font-medium">
                        Product Name
                      </th>
                      <th className="px-4 py-2 text-center text-gray-700 font-medium">
                        Variant
                      </th>
                      <th className="px-4 py-2 text-center text-gray-700 font-medium">
                        Quantity
                      </th>
                      <th className="px-4 py-2 text-center text-gray-700 font-medium">
                        Orignal Price
                      </th>
                      <th className="px-4 py-2 text-center text-gray-700 font-medium">
                        Total Bill
                      </th>
                      <th className="px-4 py-2 text-center text-gray-700 font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {InvocieHistory.map((item, index) => (
                      <tr
                        key={item.attributeID}
                        className={`${item.maxQty < item.qty && "bg-red-200"}`}
                      >
                        <td className="px-4 py-2 text-left text-gray-700 font-medium">
                          {item.saleDate.split("T")[0]}
                        </td>
                        <td className="px-4 py-2 text-left text-gray-700 font-medium">
                          {item.barcode}
                        </td>
                        <td className="px-4 py-2 text-left text-gray-700 font-medium">
                          {item.productName}
                        </td>
                        <td className="px-4 py-2 text-center text-gray-700 font-medium">
                          {item.varientValue}
                        </td>

                        {/* Editable Quantity */}
                        <td className="px-4 py-2 text-center text-gray-700 font-medium">
                          <input
                            type="number"
                            className="w-16 text-center border rounded-md px-1 py-1"
                            value={item.qty}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              setNewItem((prev) =>
                                prev.map((itm, i) =>
                                  i === index ? { ...itm, qty: value } : itm,
                                ),
                              );
                            }}
                          />
                        </td>
                        {/* Editable Original Price */}
                        <td className="px-4 py-2 text-center text-gray-700 font-medium">
                          {item.salePrice}
                        </td>

                        {/* Total Bill */}
                        <td className="px-4 py-2 text-center text-gray-700 font-medium">
                          {item.salePrice * item.qty}
                        </td>

                        {/* Action */}
                        <td className="px-4 py-2 text-center text-gray-700 font-medium">
                          <button
                            onClick={() =>
                              addItemForReturnListFromInvoice(
                                item.productID,
                                item.attributeID,
                              )
                            }
                            className="px-2 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
                          >
                            <Plus />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="w-full relative">
        <h2 className="text-2xl font-semibold text-gray-800">
          Sale Management
        </h2>
        <div className="w-full  mx-auto p-6 rounded-2xl">
          <div className="w-full flex justify-end">
            <button
              onClick={() => setReturnMenu(true)}
              className=" px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              Return Item
            </button>
          </div>
          <div className="mt-6 w-full flex justify-center">
            <div className="w-full max-w-8xl px-4">
              <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                {/* ---------------- Left Card: Sale Information ---------------- */}
                <div className="flex flex-col bg-white shadow-lg p-6 rounded-xl gap-4 w-full lg:flex-[6] min-w-0">
                  <h1 className="text-lg font-semibold tracking-wide text-gray-800">
                    Sale Information
                  </h1>

                  {/* Salesman */}
                  <div className="w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                      Salesman <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 w-full">
                      <User className="text-gray-400 mr-2" size={18} />
                      <select
                        value={selectedSalesman}
                        onChange={(e) => setSelectedSalesman(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-gray-900 p-2"
                      >
                        {salesmanList.length > 0 ? (
                          salesmanList.map((sm) => (
                            <option key={sm.salesmanID} value={sm.salesmanID}>
                              {sm.salesmanName}
                            </option>
                          ))
                        ) : (
                          <option>No Record Found</option>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Sale Date & Customer */}
                  <div className="flex flex-col md:flex-row gap-4 w-full">
                    {/* Sale Date */}
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-2">
                        Sale Date
                      </label>
                      <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 w-full">
                        <Calendar className="text-gray-400 mr-2" size={18} />
                        <input
                          value={SaleDate}
                          onChange={(e) => setSaleDate(e.target.value)}
                          type="date"
                          readOnly
                          placeholder="Enter Sale Date"
                          className="flex-1 bg-transparent outline-none text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Customer */}
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-2">
                        Customer Name
                      </label>
                      <div className="flex gap-2 w-full">
                        <div className="flex-1 flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                          <User className="text-gray-400 mr-2" size={18} />
                          <select
                            value={Customer}
                            onChange={(e) => {
                              setDescription("");
                              const value = e.target.value;
                              setCustomer(value);
                              const data = CustomerList.find(
                                (item) => item.customerID === value,
                              );
                              if (data) setCustomerName(data.customerName);
                            }}
                            className="flex-1 p-1 bg-transparent outline-none text-gray-900"
                          >
                            {CustomerList.length !== 0 ? (
                              CustomerList.map((customer) => (
                                <option
                                  key={customer.customerID}
                                  value={customer.customerID}
                                >
                                  {customer.customerName}
                                </option>
                              ))
                            ) : (
                              <option value="">No Record Found</option>
                            )}
                          </select>
                        </div>
                        <button
                          onClick={() => setAddCustomerForm(true)}
                          className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
                        >
                          <Plus />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Walk-in Customer Name */}
                  {customerName === "Walk in Customer" && (
                    <div className="w-full">
                      <label className="block text-gray-700 font-medium mb-2">
                        Customer Name
                      </label>
                      <div className="flex items-center w-full border border-gray-200 rounded-lg bg-gray-50 px-3 py-2">
                        <Tag className="text-gray-400 mr-2" size={18} />
                        <input
                          type="text"
                          value={Description}
                          placeholder="Enter Customer Name"
                          onChange={(e) => setDescription(e.target.value)}
                          className="flex-1 bg-transparent outline-none text-gray-900 p-1"
                        />
                      </div>
                    </div>
                  )}

                  {/* Barcode & Product */}
                  <div className="w-full flex flex-col md:flex-row gap-4">
                    {/* Barcode */}
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-2">
                        Barcode
                      </label>
                      <div className="flex items-center w-full border border-gray-200 rounded-lg bg-gray-50 px-3 py-2">
                        <Tag className="text-gray-400 mr-2" size={18} />
                        <input
                          type="text"
                          value={Barcode}
                          placeholder="Enter Barcode"
                          onChange={(e) => {
                            setBarcode(e.target.value);
                            getProductBarcode(e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") addInTheList(Barcode);
                          }}
                          className="flex-1 bg-transparent outline-none text-gray-900 p-1"
                        />
                      </div>
                    </div>

                    {/* Product Name */}
                    <div className="flex-1 min-w-0">
                      <label className="block text-gray-700 font-medium mb-2">
                        Product Name
                      </label>
                      <div className="flex gap-1">
                        <div className="flex items-center w-full border border-gray-200 rounded-lg bg-gray-50 px-3 py-2">
                          <Tag className="text-gray-400 mr-2" size={18} />
                          <input
                            type="text"
                            list="productList"
                            value={productName}
                            onChange={(e) => {
                              const value = e.target.value;
                              setProductName(value);
                              const data = productList2.find(
                                (item) => item.productName === value,
                              );
                              if (data) {
                                setProductID(data.productID);
                                varinetList(data.productID);
                              }
                            }}
                            placeholder="Select Product"
                            className="flex-1 bg-transparent outline-none text-gray-900 p-1 truncate"
                          />
                          <datalist id="productList">
                            {productList2.map((item) => (
                              <option
                                key={item.productID}
                                value={item.productName}
                              />
                            ))}
                          </datalist>
                        </div>
                        <button
                          onClick={() => {
                            setProductName("");
                            setVarintShowList(true);
                          }}
                          className="px-2 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                        >
                          <Notebook />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Product Table */}
                  <div className="w-full overflow-x-auto rounded-lg border border-gray-100">
                    <table className="w-full text-sm border-collapse">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-gray-700 font-medium">
                            Barcode
                          </th>
                          <th className="px-4 py-2 text-left text-gray-700 font-medium">
                            Product Name
                          </th>
                          <th className="px-4 py-2 text-center text-gray-700 font-medium">
                            Variant
                          </th>
                          <th className="px-4 py-2 text-center text-gray-700 font-medium">
                            Quantity
                          </th>
                          <th className="px-4 py-2 text-center text-gray-700 font-medium">
                            Original Price
                          </th>
                          <th className="px-4 py-2 text-center text-gray-700 font-medium">
                            Discount Price
                          </th>
                          <th className="px-4 py-2 text-center text-gray-700 font-medium">
                            Total Bill
                          </th>
                          <th className="px-4 py-2 text-center text-gray-700 font-medium">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {newItem.map((item, index) => (
                          <tr
                            key={item.attributeID}
                            className={`${item.stockQty < item.qty && "bg-red-200"}`}
                          >
                            <td className="px-4 py-2 text-left text-gray-700 font-medium">
                              {item.barcode}
                            </td>
                            <td className="px-4 py-2 text-left text-gray-700 font-medium">
                              {item.productName}
                            </td>
                            <td className="px-4 py-2 text-center text-gray-700 font-medium">
                              {item.varientValue}
                            </td>
                            <td className="px-4 py-2 text-center text-gray-700 font-medium">
                              <input
                                type="number"
                                className="w-16 text-center border rounded-md px-1 py-1"
                                value={item.qty}
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  setNewItem((prev) =>
                                    prev.map((itm, i) =>
                                      i === index
                                        ? { ...itm, qty: value }
                                        : itm,
                                    ),
                                  );
                                }}
                              />
                            </td>
                            <td className="px-4 py-2 text-center text-gray-700 font-medium">
                              <input
                                type="number"
                                className="w-20 text-center border rounded-md px-1 py-1"
                                value={item.price}
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  setNewItem((prev) =>
                                    prev.map((itm, i) =>
                                      i === index
                                        ? { ...itm, price: value }
                                        : itm,
                                    ),
                                  );
                                }}
                              />
                            </td>
                            <td className="px-4 py-2 text-center text-gray-700 font-medium">
                              {item.discount}%
                            </td>
                            <td className="px-4 py-2 text-center text-gray-700 font-medium">
                              {(item.price -
                                (item.price * item.discount) / 100) *
                                item.qty}
                            </td>
                            <td className="px-4 py-2 text-center text-gray-700 font-medium">
                              <button
                                onClick={() =>
                                  DeletFromTableList(item.attributeID)
                                }
                                className="px-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                              >
                                <Trash />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Description */}
                  {customerName !== "Walk in Customer" && (
                    <div className="w-full">
                      <label className="block text-gray-700 font-medium mb-2">
                        Description
                      </label>
                      <div className="flex items-start border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                        <Notebook
                          className="text-gray-400 mr-2 mt-1"
                          size={18}
                        />
                        <textarea
                          value={Description}
                          onChange={(e) => setDescription(e.target.value)}
                          name="description"
                          placeholder="Enter Description"
                          className="w-full bg-transparent outline-none text-gray-900 resize-none"
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

                  {/* Save Button & Response */}
                  <div className="flex flex-col gap-6 mt-4">
                    {RescponseBack && (
                      <div
                        className={`w-full text-center px-4 py-3 mb-2 rounded ${
                          ShowMessage
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {RescponseBack}
                      </div>
                    )}
                  </div>
                </div>

                {/* ---------------- Right Card: Billing Detail ---------------- */}
                <div className="flex flex-col bg-white shadow-lg p-6 rounded-xl gap-4 w-full lg:flex-[2] min-w-[280px]">
                  <h1 className="text-lg font-semibold tracking-wide text-gray-800">
                    Billing Detail
                  </h1>

                  <div className="flex flex-col gap-4 mt-3">
                    {/* Amount Paid */}
                    <div className="w-full">
                      <label className="block text-gray-700 font-medium mb-2">
                        Discount
                      </label>
                      <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                        <Coins className="text-gray-400 mr-2" size={18} />
                        <input
                          type="number"
                          value={Discount || 0}
                          onChange={(e) => setDiscount(Number(e.target.value))}
                          placeholder="Enter Discount"
                          className="w-full text-right bg-transparent outline-none text-gray-900"
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <label className="block text-gray-700 font-medium mb-2">
                        Amount Paid
                      </label>
                      <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                        <Coins className="text-gray-400 mr-2" size={18} />
                        <input
                          type="number"
                          value={AmountPaid || 0}
                          onChange={(e) =>
                            setAmountPaid(Number(e.target.value))
                          }
                          name="totalBill"
                          placeholder="Enter Amount Paid"
                          className="w-full text-right bg-transparent outline-none text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Discount */}

                    {/* Total Bill */}
                    <div className="w-full">
                      <label className="block text-gray-700 font-medium mb-2">
                        Total Bill
                      </label>
                      <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                        <Coins className="text-gray-400 mr-2" size={18} />
                        <input
                          type="number"
                          value={totalSum || 0}
                          readOnly
                          className="w-full text-center bg-transparent outline-none text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Remaining Balance */}
                    <div className="w-full">
                      <label className="block text-gray-700 font-medium mb-2">
                        Remaining Balance
                      </label>
                      <div
                        className={`flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 ${
                          totalSum - AmountPaid - Discount < 0
                            ? "text-red-500"
                            : ""
                        }`}
                      >
                        <Coins className="text-gray-400 mr-2" size={18} />
                        <input
                          type="number"
                          value={totalSum - AmountPaid - Discount || 0}
                          readOnly
                          placeholder="Auto Calculated"
                          className="w-full text-center bg-transparent outline-none text-gray-900"
                        />
                      </div>
                      <div className="w-full mt-6 flex justify-end">
                        <button
                          onClick={SaleAdd}
                          type="button"
                          className="w-full  py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
                        >
                          {loading ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
