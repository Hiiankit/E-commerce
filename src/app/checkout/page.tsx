"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

// Define types for cart items
interface CartItem {
  title: string;
  quantity: number;
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

// Define types for form data
interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
}

const Checkout: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [formValid, setFormValid] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
  });

  useEffect(() => {
    // Fetch the stored cart and discount
    const storedCartString = localStorage.getItem("cart");
    const storedDiscountString = localStorage.getItem("discount");

    // Check if storedCartString and storedDiscountString are not null
    const storedCart = storedCartString ? JSON.parse(storedCartString) : [];
    const storedDiscount = storedDiscountString
      ? JSON.parse(storedDiscountString)
      : 0;

    // Calculate subtotal
    const calculatedSubtotal = storedCart.reduce(
      (acc: number, item: CartItem) => {
        const price = item.variants.edges[0]?.node?.price?.amount ?? 0; // Default to 0 if undefined
        const quantity = item.quantity ?? 1; // Default to 1 if undefined
        return acc + price * quantity;
      },
      0
    );

    // Calculate grand total
    const discountAmount = calculatedSubtotal * (storedDiscount / 100);
    const calculatedGrandTotal = calculatedSubtotal - discountAmount;

    setCart(storedCart);
    setSubtotal(calculatedSubtotal);
    setDiscount(storedDiscount);
    setGrandTotal(calculatedGrandTotal);
  }, []);

  useEffect(() => {
    const isValid = Boolean(
      formData.fullName &&
        formData.email &&
        formData.phone &&
        formData.address &&
        formData.postalCode
    );
    setFormValid(isValid);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className="w-[90%] md:w-[70%] mx-auto mt-10">
      <div className="flex gap-3">
        <h2 className="text-xl md:text-2xl bg-black text-white px-4 py-1 rounded-xl font-bold mb-6">
          Checkout
        </h2>
        <Link
          className="text-xl md:text-2xl font-bold mb-6 px-4 py-1"
          href="/cart"
        >
          Cart
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-2 mb-2 p-5 rounded-lg">
        {/* Shipping Address Form */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
          <form>
            <div className="mb-4">
              <label className="block">Full name *</label>
              <input
                className="w-full mb-2 border-2 p-2 rounded-lg"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                required
                value={formData.fullName}
                onChange={handleInputChange}
              />
              <label className="block">Email *</label>
              <input
                className="w-full border-2 mb-2 p-2 rounded-lg"
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
              <label className="block">Phone Number *</label>
              <input
                className="w-full border-2 mb-2 p-2 rounded-lg"
                type="tel"
                name="phone"
                placeholder="Number only"
                required
                value={formData.phone}
                onChange={handleInputChange}
              />
              <label className="block">Address *</label>
              <input
                className="w-full border-2 p-2 mb-2 rounded-lg"
                type="text"
                name="address"
                placeholder="Address"
                required
                value={formData.address}
                onChange={handleInputChange}
              />
              <label className="block">Postal Code *</label>
              <input
                className="w-full border-2 mb-2 p-2 rounded-lg"
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                required
                value={formData.postalCode}
                onChange={handleInputChange}
              />
            </div>
          </form>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Your Order</h3>
          <div className="p-4 border rounded-lg">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between mb-4">
                <div>
                  <h4>{item.title}</h4>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <p>
                  $
                  {(
                    (item.variants.edges[0]?.node.price.amount ?? 0) *
                    (item.quantity ?? 1)
                  ).toFixed(2)}
                </p>
              </div>
            ))}
            <hr />
            <div className="flex justify-between mt-4">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>Discount</p>
              <p>- ${(subtotal * (discount / 100)).toFixed(2)}</p>
            </div>
            <div className="flex justify-between mt-4">
              <p>Grand total</p>
              <p>${grandTotal.toFixed(2)}</p>
            </div>
          </div>
          {formValid ? (
            <Link href="./payment">
              <button className="bg-black text-white px-6 py-3 mt-6 rounded-lg w-full">
                Continue to payment
              </button>
            </Link>
          ) : (
            <button
              className="bg-gray-400 text-white px-6 py-3 mt-6 rounded-lg w-full"
              disabled
            >
              Fill out form to continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
