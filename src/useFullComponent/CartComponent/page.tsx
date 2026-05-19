import {
  clearServerCart,
  getServerCart,
  modifyCartServer,
  ModifyFromCart,
  RemoveFromCart,
  removeItemFromServerCart,
} from "@/api/lib/Cart/AddCart";
import { CartData, cartList } from "@/api/types/Cart/CartData";
import { CreditCard, Minus, Plus, ShoppingCart, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface CartComponentProps {
  cartList: CartData[];
  onClear: () => void;
  setCartList: React.Dispatch<React.SetStateAction<CartData[]>>;
}
export default function CartComponent({
  cartList,
  setCartList,
  onClear,
}: CartComponentProps) {
  const [cartCheckOut, setCartCheckOut] = useState<CartData[]>([]);
  const [NumberofProduct, setNumberofProduct] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    {},
  );

  const checkOut = () => {
    localStorage.setItem("checkoutItems", JSON.stringify(cartCheckOut));

    window.location.href = "/checkOut";
  };

  const updateQuantity = async (productID: any, newQuantity: any) => {
    const token = localStorage.getItem("token1");
    if (newQuantity < 1) return;
    setCartList((prev) =>
      prev.map((item, i) =>
        item.productID === productID
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
    await modifyCartServer(String(productID), Number(newQuantity));
    await ModifyFromCart(String(productID), Number(newQuantity), String(token));
  };

  const cartData = async () => {
    const cart = await getServerCart();
    console.log(cart);
    setCartList(cart);
  };

  const clearCart = () => {
    onClear();
  };
  const deleteProduct = async (productID: string) => {
    const token = localStorage.getItem("token1");
    const updatedCart = await removeItemFromServerCart(productID);
    await RemoveFromCart(productID, String(token));
    setCartList(updatedCart);
  };
  const handleCheckboxChange = (productID: string) => {
    const selectedProduct = cartList.find(
      (item) => item.productID === productID,
    );
    if (!selectedProduct) return;

    setSelectedItems((prev) => {
      const isChecked = !prev[productID];

      setCartCheckOut((prevCheckout) => {
        if (isChecked) {
          const exists = prevCheckout.some(
            (item) => item.productID === productID,
          );

          if (exists) return prevCheckout;

          return [...prevCheckout, selectedProduct];
        }
        return prevCheckout.filter((item) => item.productID !== productID);
      });

      return {
        ...prev,
        [productID]: isChecked,
      };
    });
  };

  useEffect(() => {
    cartData();
  }, []);

  const total = cartList.reduce((sum, item) => {
    if (!selectedItems[item.productID]) return sum;

    const price = item.salePrice - (item.salePrice * item.discount) / 100;

    return sum + price * (item.quantity || 1);
  }, 0);

  const targetAmount = 2000;
  const remainingAmount = Math.max(Number(targetAmount) - total, 0);
  const progressPercent = Math.min((total / Number(targetAmount)) * 100, 100);

  return (
    <div className="w-full h-[100vh] bg-white p-4 flex flex-col">
      <h1 className="text-xl font-bold">My Cart {cartList.length}</h1>
      {/* <hr className="mt-2 mb-1 text-gray-300" /> */}
      <div className="flex flex-col justify-between flex-grow">
        <div className="flex flex-col">
          {/* {remainingAmount > 0 ? (
            <h3 className="text-md text-gray-600 mt-4 mb-1">
              Spend Rs:{remainingAmount} more and enjoy Free Shipping!
            </h3>
          ) : (
            <h3 className="text-md text-gray-600 mt-4 mb-1">
              Congrats! You qualify for Free Shipping.
            </h3>
          )}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1 mb-2">
            <div
              className="bg-orange-400 h-2 rounded-full"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{
                width: `${progressPercent}%`,
                transition: "width 0.5s ease-in-out",
              }}
            ></div>
          </div> */}
          <hr className="mt-3 mb-3 text-gray-300" />
          <h1
            onClick={clearCart}
            className="text-lg flex justify-end text-end text-gray-900 "
            style={{ cursor: "pointer" }}
          >
            Clear Cart
          </h1>

          <div className="mt-5 h-[65vh] overflow-y-auto">
            {cartList.map((item, index) => (
              <>
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={!!selectedItems[item.productID]}
                    onChange={() => handleCheckboxChange(item.productID)}
                    className="w-6 h-6 border border-default-medium rounded-xs bg-neutral-secondary-medium"
                  />

                  <div
                    key={item.productID}
                    className="w-full flex justify-between p-2 rounded"
                  >
                    <div className="flex">
                      <div>
                        <img src={item.image} width={80} height={50} />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-gray-600 mx-3 text-sm">
                          {item.varinetName}
                        </p>
                        <div className="ml-4 flex flex-col">
                          <h3 className="text-lg mt-2">{item.productName}</h3>
                          {/* <p className="text-gray-500">{item.description}</p> */}
                          <p className="text-gray-500">
                            {item.salePrice -
                              (item.salePrice * item.discount) / 100}
                            -/
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <div>
                        <button
                          onClick={() => deleteProduct(item.productID)}
                          className="bg-gray-100 p-1 text-lg font-bold rounded"
                        >
                          <Trash className="w-4 h-4 text-gray-800 hover:text-gray-900" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between w-25 border border-gray-300 rounded-md shadow-sm bg-gray-200 px-2 py-1">
                        {NumberofProduct !== 1 ? (
                          <button
                            onClick={() => setNumberofProduct(NumberofProduct)}
                            className="p-1  bg-white  shadow-sm rounded"
                          >
                            <Minus size={16} color="gray" />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productID,
                                (item.quantity || 1) - 1,
                              )
                            }
                            disabled={(item.quantity || 1) === 1}
                            className={`p-1 bg-white shadow-sm rounded ${
                              (item.quantity || 1) === 1
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-gray-200"
                            }`}
                          >
                            <Minus
                              size={16}
                              color={
                                (item.quantity || 1) === 1 ? "gray" : "black"
                              }
                            />
                          </button>
                        )}
                        <p className="text-lg font-medium">
                          {item.quantity || 1}
                        </p>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productID,
                              (item.quantity || 1) + 1,
                            )
                          }
                          className="p-1 bg-white hover:bg-gray-100 shadow-sm rounded"
                        >
                          <Plus size={16} color="black" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <hr className="mt-2 mb-2 text-gray-300" />
                </div>
              </>
            ))}
          </div>

          {/* <div className="mt-5">
            <div className="flex justify-between p-2 rounded">
              <div className="flex">
                <div>
                  <img src={"/fashion_83.webp"} width={80} height={50} />
                </div>
                <div className="ml-4 flex flex-col">
                  <h3 className="text-lg mt-2">Chic Damn</h3>
                  <p className="text-gray-500">1500-/</p>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end">
                <div>
                  <button className="bg-gray-100 p-1 text-lg font-bold rounded">
                    <Trash className="w-4 h-4 text-gray-800 hover:text-gray-900" />
                  </button>
                </div>
                <div className="flex gap-2 item-center bg-gray-100 p-2 gap-3">
                  <button className="bg-gray-200 hover:bg-gray-300 rounded-full w-6 h-6 text-center">
                    -
                  </button>
                  <span className="text-center">1</span>
                  <button className="bg-gray-200 hover:bg-gray-300 rounded-full w-6 h-6 text-center">
                    +
                  </button>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        <div className="flex flex-col ">
          <hr className="mt-1 text-gray-300" />
          <div className="flex justify-between mt-2">
            <span className="text-lg text-gray-800">Sub Total: </span>
            <span className="text-lg text-gray-900 font-extrabold">
              {total}-/
            </span>
          </div>
          <hr className="mt-1 mb-2 text-gray-300" />

          <div className="flex justify-between mt-4 mb-4 gap-2">
            <button className="w-3/5 bg-black border border-black-400 text-white py-3 rounded hover:bg-white hover:text-black transition-all duration-300">
              <div className="flex justify-center items-center gap-2">
                <ShoppingCart />
                <span>View Cart</span>
              </div>
            </button>
            <button
              onClick={checkOut}
              className="w-3/5 bg-black border border-black-400 text-white py-3 rounded hover:bg-white hover:text-black transition-all duration-300"
            >
              <div className="flex justify-center items-center gap-2">
                <CreditCard />
                <span>CheckOut</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
