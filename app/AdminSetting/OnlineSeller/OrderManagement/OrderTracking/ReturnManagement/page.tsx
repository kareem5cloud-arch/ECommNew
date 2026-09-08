import AddOrderExchangeCouponAPi from "@/app/api/Controller/OnlineManager/OrderTracking/AddOrderExchangeCoupon";
import ProductIDGetApi from "@/app/api/Controller/PurchaserLogin/Codes/Product/GetProductByStore";
import { storeList } from "@/app/api/Types/AdminSetting/Store/Store";
import {
  productList,
  responseGetProduct,
  variantsList,
} from "@/app/api/Types/PurchaserLogin/Codes/Product/Product";
import ActionButton from "@/app/ui/ActionButton/ActionButton";
import DropDownList from "@/app/ui/DropDownList/DropDownList";
import InputFieldGeneric from "@/app/ui/inputFiled/inputField";
import GenericRadio from "@/app/ui/RadioButton/RadioButton";
import TextAreaFieldGeneric from "@/app/ui/TextArea/textArea";
import { useEffect, useState } from "react";
interface ReturnProps {
  bagNo: string;
  setReturnItem: (data: boolean) => void;
  onShowMessage: (message: string, type: "success" | "error") => void;
  storeList: storeList[];
  VarientID: string;
  ProductID: string;
  SellerID: string;
  varinatValue: string;
  Email: string;
  qty: string;
  Rate: string;
}
export default function ReturnManagement({
  storeList,
  bagNo,
  setReturnItem,
  onShowMessage,
  VarientID,
  ProductID,
  SellerID,
  Email,
  qty,
  Rate,
  varinatValue,
}: ReturnProps) {
  const [description, setDescription] = useState("");
  const [StoreName, setStoreName] = useState("");
  const [StoreID, setStoreID] = useState("");
  const [ReturnMethod, setReturnMethod] = useState("Coupon");
  const [StartDate, setStartDate] = useState("");
  const [ExpiryDate, setExpiryDate] = useState("");
  const [CustomerID, setCustomerID] = useState("");
  const [CustomerName, setCustomerName] = useState("");
  const [PromoCode, setPromoCode] = useState("");
  const [Amount, setAmount] = useState("");
  const [productID, setProductID] = useState("");
  const [productName, setProductName] = useState("");
  const [varientID, setVarientID] = useState("");
  const [varientName, setVarientName] = useState("");
  const [Qty, setQty] = useState("");
  const [AvaliableQty, setAvaliableQty] = useState("");
  const [loading, setLoading] = useState(false);

  const [productList, setProductList] = useState<productList[]>([]);
  const [varientList, setVarientList] = useState<variantsList[]>([]);

  const resetFunction = () => {
    setDescription("");
    setStoreName("");
    setStoreID("");
    setStartDate("");
    setExpiryDate("");
    setCustomerID("");
    setCustomerName("");
    setPromoCode("");
    setAmount("");
    setProductID("");
    setProductName("");
    setProductList([]);
    setVarientID("");
    setVarientName("");
    setAvaliableQty("");
    setVarientList([]);
    setQty("");
  };

  const generateRandomNumber = () => {
    const date = new Date();

    const day = date.getDate(); // 8
    const month = date.getMonth() + 1; // 8
    const year = date.getFullYear().toString().slice(-2); // 26

    const random = Math.floor(100 + Math.random() * 900); // 3 random digits

    return `${day}${month}${year}${random}`;
  };

  useEffect(() => {
    setStoreID(storeList[0].storeID);
    setStoreName(storeList[0].storeName);
    setVarientID(VarientID);
    setCustomerName(Email);
    const number = generateRandomNumber();
    setPromoCode(String(number));
    setVarientName(varinatValue);
    setQty(qty);
    setAmount(Rate);
  }, [VarientID, ProductID, SellerID, Email, qty, Rate]);

  const getProducts = async (ID: string) => {
    const token = localStorage.getItem("OnlineSellerToken");
    const response = await ProductIDGetApi(ID, String(token));
    if (response.status == 200) {
      const data = response.data as responseGetProduct;
      setProductList(data.productList);
      const filterData = data.productList.find(
        (item) => item.productID === ProductID,
      );
      if (filterData) {
        setProductID(filterData.productID);
        setProductName(filterData.productName);
      }
    } else {
      setProductList([]);
    }
  };
  useEffect(() => {
    getProducts(StoreID);
  }, [StoreID]);

  useEffect(() => {
    const data = productList.find((item) => item.productID === productID);
    if (data) {
      setVarientList(data.variants);
    }
  }, [productID]);
  useEffect(() => {
    const data = varientList.find((item) => item.varientID === varientID);
    if (data) {
      setVarientID(data.varientID);

      setAvaliableQty(String(data.qty));
    }
  }, [varientID]);

  const AddReturn = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("OnlineSellerToken");

      const formData = {
        bagNo: bagNo,
        description:
          ReturnMethod === "Coupon"
            ? `Use ${PromoCode} to discount on you next purchase`
            : "Your package is exchange with a new Order",
        status: ReturnMethod === "Coupon" ? "Reclaimed" : "Exchanged",
        promoCode: ReturnMethod === "Coupon" ? PromoCode : "",
        startDate: ReturnMethod === "Coupon" ? StartDate : "",
        expiryDate: ReturnMethod === "Coupon" ? ExpiryDate : "",
        amount: ReturnMethod === "Coupon" ? Number(Amount) : 0,
        orderType: ReturnMethod,
        customerID: SellerID,
        orderDetail: {
          varientID: varientID,
          qty: Number(Qty),
          rate: 0,
        },
      };
      //console.log(formData);
      const response = await AddOrderExchangeCouponAPi(formData, String(token));
      if (response.status === 200) {
        onShowMessage(response.data.message, "success");
        resetFunction();
        setReturnItem(false);
      } else {
        onShowMessage(response.data.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <div>
          <label className="mb-2 text-gray-800">Return Method</label>

          <div className="flex gap-5">
            <GenericRadio
              label="Coupon"
              name="Purchase"
              value="Coupon"
              checked={ReturnMethod === "Coupon"}
              onChange={setReturnMethod}
            />

            <GenericRadio
              label="Exchange"
              name="Purchase"
              value="Exchange"
              checked={ReturnMethod === "Exchange"}
              onChange={setReturnMethod}
            />
          </div>
        </div>
        {ReturnMethod === "Coupon" && (
          <div className="mt-2">
            <InputFieldGeneric
              label="Customer Name "
              type="text"
              required={false}
              readonly={true}
              placeholder="Enter Customer Name "
              SateChange={CustomerName}
              setSateChange={setCustomerName}
              disabled={false}
            />
            <InputFieldGeneric
              label="Promo Code "
              type="text"
              required={false}
              readonly={true}
              placeholder="Enter Promo Code "
              SateChange={PromoCode}
              setSateChange={setPromoCode}
              disabled={false}
            />
            <InputFieldGeneric
              label="Start Date "
              type="date"
              required={true}
              placeholder="Enter Start Date "
              SateChange={StartDate}
              setSateChange={setStartDate}
              disabled={false}
            />
            <InputFieldGeneric
              label="Expiry Date "
              type="date"
              required={true}
              min={StartDate}
              placeholder="Enter Expiry Date "
              SateChange={ExpiryDate}
              setSateChange={setExpiryDate}
              disabled={false}
            />
            <InputFieldGeneric
              label="Amount "
              type="text"
              required={false}
              readonly={true}
              placeholder="Enter Amount "
              SateChange={Amount}
              setSateChange={setAmount}
              disabled={false}
            />
          </div>
        )}
        {ReturnMethod === "Exchange" && (
          <div>
            <DropDownList
              label="Store"
              placeholder="Select Store"
              required={false}
              filedID={setStoreID}
              value={StoreName}
              readonly={true}
              onChange={setStoreName}
              options={storeList.map((item) => ({
                label: item.storeName,
                value: item.storeName,
                id: item.storeID,
              }))}
            />
            <DropDownList
              label="Product "
              placeholder="Enter Product"
              required={true}
              readonly={true}
              filedID={setProductID}
              value={productName}
              onChange={setProductName}
              options={productList.map((item) => ({
                label: item.productName,
                value: item.productName,
                id: item.productID,
              }))}
            />
            <DropDownList
              label="Variant"
              placeholder="Select Variant"
              required={true}
              readonly={true}
              filedID={setVarientID}
              value={varientName}
              onChange={setVarientName}
              options={varientList.map((item) => ({
                label: item.values.map((v) => v.varientValue).join(" - "),
                value: item.values.map((v) => v.varientValue).join(" - "),
                id: item.varientID,
              }))}
            />
            <InputFieldGeneric
              label={`Qty - ${AvaliableQty}`}
              type="text"
              readonly={true}
              required={true}
              placeholder="Enter Qty"
              SateChange={Qty}
              setSateChange={setQty}
              disabled={false}
            />
          </div>
        )}
        <div className="flex justify-end mt-2">
          <ActionButton
            text="Confirmn Order"
            update={false}
            loading={loading}
            loadingtext="Processing..."
            size={true}
            onClick={() => AddReturn()}
            disabled={false}
          />
        </div>
      </div>
    </>
  );
}
