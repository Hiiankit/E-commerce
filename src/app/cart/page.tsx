"use client"; // This directive ensures the component runs on the client-side

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Define the interface for the cart item
interface CartItem {
  title: string;
  quantity: number;
  featuredImage?: {
    url: string;
  };
  variants: {
    edges: Array<{
      node: {
        price: {
          amount: number;
        };
      };
    }>;
  };
}

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<string>(""); // State to track coupon input
  const [discount, setDiscount] = useState<number>(0); // State to track discount percentage
  const [couponApplied, setCouponApplied] = useState<boolean>(false); // State to track if coupon is applied
  const [isCouponInvalid, setIsCouponInvalid] = useState<boolean>(false);

  useEffect(() => {
    // Load cart from localStorage and initialize state
    const storedCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    ) as CartItem[];
    const initializedCart = storedCart.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setCart(initializedCart);
  }, []);

  const updateCartInLocalStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (indexToRemove: number) => {
    const updatedCart = cart.filter((_, index) => index !== indexToRemove);
    updateCartInLocalStorage(updatedCart);
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    const updatedCart = cart.map((item, i) => {
      if (i === index) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    updateCartInLocalStorage(updatedCart);
  };

  const handleQuantityChange = (index: number, delta: number) => {
    const newQuantity = cart[index].quantity + delta;
    if (newQuantity > 0) {
      updateQuantity(index, newQuantity);
    }
  };

  const calculateTotalPrice = () => {
    const subtotal = cart
      .reduce((total, item) => {
        const itemPrice = item.variants.edges[0].node.price.amount;
        const itemQuantity = item.quantity || 1;
        return total + itemPrice * itemQuantity;
      }, 0)
      .toFixed(2);

    const total = (
      parseFloat(subtotal) -
      parseFloat(subtotal) * (discount / 100)
    ).toFixed(2);
    return total;
  };

  const applyCoupon = () => {
    if (couponApplied) {
      setDiscount(0);
      setCoupon("");
      setCouponApplied(false);
      localStorage.setItem("discount", JSON.stringify(0)); // Reset discount in localStorage
    } else if (coupon === "OFF20") {
      setDiscount(20);
      setCouponApplied(true);
      localStorage.setItem("discount", JSON.stringify(20)); // Store discount in localStorage
    } else {
      setIsCouponInvalid(true);
      setDiscount(0);
      setCouponApplied(false);
    }
  };
  const removeCoupon = () => {
    setDiscount(0);
    setCoupon("");
    setCouponApplied(false);
    setIsCouponInvalid(false);
    localStorage.setItem("discount", JSON.stringify(0));
  };

  return (
    <div className="w-[70%] mx-auto mt-10">
      <div className="text-2xl font-bold mb-6 flex">
        <h2 className="bg-black px-3 py-1 rounded-xl text-white">Your Cart</h2>
        <Link className="px-3 py-1" href="/">
          Home
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {cart.length === 0 ? (
          <div className="text-center mt-10">Your cart is empty</div>
        ) : (
          cart.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center">
                {item.featuredImage && (
                  <Image
                    height={200}
                    width={200}
                    src={item.featuredImage.url}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg mb-2 mr-4"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-500">
                    ${item.variants.edges[0].node.price.amount}
                  </p>
                </div>
              </div>
              <div className=" py-1 border border-gray-300 rounded-lg mb-2 bg-white flex items-center justify-center">
                <button
                  onClick={() => handleQuantityChange(index, -1)}
                  className="px-3 py-1 flex items-center justify-center"
                >
                  -
                </button>
                <span className="mx-2 text-lg font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(index, 1)}
                  className="px-3 py-1 flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(index)}
                className="bg-red-600 text-white px-3 py-2 rounded-lg ml-0 md:ml-4 w-full md:w-auto"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">Coupon Discount</h3>
        <div className="flex flex-col md:flex-row items-center">
          <input
            className="border-2 border-gray-500 rounded-lg p-1 w-full md:w-auto mb-4 md:mb-0"
            type="text"
            placeholder="Enter coupon code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            disabled={couponApplied} // Disable input when coupon is applied
          />
          <button
            onClick={
              couponApplied || isCouponInvalid ? removeCoupon : applyCoupon
            }
            className="bg-zinc-300 text-zinc-800 px-3 py-1 ml-0 md:ml-2 w-full md:w-auto rounded-lg"
          >
            {couponApplied || isCouponInvalid ? "Remove Coupon" : "Apply"}
          </button>
        </div>
        {isCouponInvalid && (
          <p className="text-red-600 mt-2">Invalid coupon code.</p>
        )}
        {couponApplied && !isCouponInvalid && (
          <p className="text-green-600 mt-2">
            {discount}% off on Subtotal - Coupon applied successfully!
          </p>
        )}
        {!couponApplied && !isCouponInvalid && (
          <p className="mt-2">20% off use OFF20</p>
        )}
      </div>

      <div className="mt-6 text-right">
        <h3 className="text-xl font-semibold mb-3">
          Total: ${calculateTotalPrice()}
        </h3>
        <Link
          className="bg-black text-white px-3 py-2 px-7 rounded-lg"
          href="./checkout"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cart;
