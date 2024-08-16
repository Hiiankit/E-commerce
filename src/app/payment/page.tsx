"use client";
import React, { useState } from "react";
import { GiPartyPopper } from "react-icons/gi";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [subtotal] = useState(2500); // Assume a subtotal for now
  const [shippingCost] = useState(22.5);
  const [grandTotal] = useState(subtotal + shippingCost);

  const handlePaymentMethodChange = (method: React.SetStateAction<string>) => {
    setPaymentMethod(method);
  };

  const clearCart = () => {
    localStorage.removeItem("cart"); // Remove the cart from localStorage
    localStorage.removeItem("discount"); // Optionally remove the discount
  };

  return (
    <div className="w-[70%] mx-auto mt-10">
      <div className="grid grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="col-span-2">
          <h2 className="text-2xl font-bold mb-6">Select payment methods</h2>
          <div className="border p-4 rounded-lg mb-6">
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Credit Card</label>
              <input
                type="radio"
                name="paymentMethod"
                value="creditCard"
                checked={paymentMethod === "creditCard"}
                onChange={() => handlePaymentMethodChange("creditCard")}
                className="mr-2"
              />
              <span className="text-lg">Visa, MasterCard</span>
              {paymentMethod === "creditCard" && (
                <div className="mt-4 space-y-4">
                  <input
                    type="text"
                    placeholder="Card number"
                    className="w-full border-2 p-2 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Name on card"
                    className="w-full border-2 p-2 rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Expiration date (MM/YY)"
                      className="w-full border-2 p-2 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="w-full border-2 p-2 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold">GPay</label>
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={() => handlePaymentMethodChange("paypal")}
                className="mr-2"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold">
                Cash On Delivery
              </label>
              <input
                type="radio"
                name="paymentMethod"
                value="neteller"
                checked={paymentMethod === "neteller"}
                onChange={() => handlePaymentMethodChange("neteller")}
                className="mr-2"
              />
              <button className="bg-black text-white px-6 py-3 mt-6 rounded-lg w-full">
                <Dialog>
                  <DialogTrigger>Continue to payment</DialogTrigger>
                  <DialogContent className="flex items-center flex-col">
                    <DialogHeader className="flex items-center">
                      <GiPartyPopper className="text-5xl" />
                      <DialogTitle className="text-2xl">
                        Thanks for your order!
                      </DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                      <button
                        className="bg-black text-white px-6 py-3 mt-6 rounded-lg "
                        onClick={clearCart} // Clear the cart when the Home button is clicked
                      >
                        <Link href="/">Home</Link>
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
