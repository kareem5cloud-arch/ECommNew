// components/CartSidebar.tsx
"use client";
import { useState, useEffect } from "react";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Heart,
  Tag,
  Truck,
  Shield,
  CreditCard,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { CartData } from "@/app/api/Types/Customer/Cookies/Cart";
import { useAppContext } from "@/app/useContext";
import { removeItemFromServerCart } from "@/app/api/Controller/Customer/CookiesController/Cart/DeleteCart";
import { modifyCartServer } from "@/app/api/Controller/Customer/CookiesController/Cart/ModifyCart";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant: string;
  size: string;
  color?: string;
  inStock: boolean;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartData: CartData[];
  onClickCall: () => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartData,
  onClickCall,
}: CartSidebarProps) {
  const { ProductData } = useAppContext();
  const [productValue, setProductValue] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (cartData.length === 0) return;

    const productValues = ProductData.flatMap((product) => {
      return product.variants.flatMap((variant) => {
        return variant.variantValues
          .filter((value) =>
            cartData.some((cart) => cart.attributeID === value.attributeID),
          )
          .map((value) => {
            const cartItem = cartData.find(
              (cart) => cart.attributeID === value.attributeID,
            );

            return {
              id: value.attributeID,
              name: product.productName,
              price: value.salePrice ?? 0,
              quantity: cartItem?.qty ?? 0,
              image: product.images[0]?.url ?? "",
              variant: variant.variantName,
              size: value.varientValue,
              color: "",
              inStock: product.isStock,
            };
          });
      });
    });

    setProductValue(productValues);
  }, [cartData, ProductData]);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    modifyCartServer(id, newQuantity);
    setProductValue((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const removeItem = async (id: string) => {
    const data = await removeItemFromServerCart(id);
    onClickCall();
    setProductValue((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = productValue.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 500 ? 0 : 9.99;
  const tax = 0; // 10% tax
  const total = subtotal + shipping + tax - discount;

  const handleApplyPromo = () => {
    if (promoCode === "SAVE20") {
      setDiscount(subtotal * 0.2);
    } else if (promoCode === "SAVE10") {
      setDiscount(subtotal * 0.1);
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      onClose();
    }, 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-100 transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-100 transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-2">
            <div className="relative">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {productValue.length}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        {subtotal < 500 && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <Truck className="w-4 h-4 text-purple-600" />
              <span>
                Add ${(500 - subtotal).toFixed(2)} more to get free shipping
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {productValue.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Looks like you haven't added any items yet
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            productValue.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:shadow-md transition-all group"
              >
                {/* Product Image */}
                <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={
                      item.image ||
                      "https://t4.ftcdn.net/jpg/06/57/37/01/360_F_657370150_pdNeG5pjI976ZasVbKN9VqH1rfoykdYU.jpg"
                    }
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        Out of stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                        {item.name}
                      </h4>
                      {(item.variant || item.size) && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.size && <span>Size: {item.size}</span>}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-red-100 rounded-full"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>

                  <div className="flex justify-between items-end mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-purple-600 hover:border-purple-600 hover:text-white transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-purple-600 hover:border-purple-600 hover:text-white transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-400">
                          ${item.price.toLocaleString()} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo Code */}
        {productValue.length > 0 && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
              />
              <button
                onClick={handleApplyPromo}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-purple-600 transition text-sm font-semibold"
              >
                Apply
              </button>
            </div>
            {discount > 0 && (
              <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Discount applied: -${discount.toFixed(2)}
              </p>
            )}
          </div>
        )}

        {/* Cart Summary */}
        {productValue.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{subtotal.toFixed(2)}</span>
              </div>
              {/* <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? "Free" : `${shipping.toFixed(2)}`}
                </span>
              </div> */}
              {/* <div className="flex justify-between text-sm">
                <span className="text-gray-600">Estimated Tax</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div> */}
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-purple-600">{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Buttons */}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCheckingOut ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Trust Badges */}
            <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                <span>100% Payment Protection</span>
              </div>
            </div>

            {/* Continue Shopping */}
            <button
              onClick={onClose}
              className="w-full mt-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
