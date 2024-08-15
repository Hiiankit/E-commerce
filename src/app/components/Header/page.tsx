import React from "react";
import Link from "next/link";
import { FaCartShopping } from "react-icons/fa6";

function Header({ cartItems }) {
  return (
    <div className="w-full h-16 sticky gap-x-10 flex bg-slate-400 justify-center  mb-4 sm:mb-3 top-0 items-center">
      <h1 className="font-serif font-semibold text-3xl">Products</h1>

      <button className="px-4  bg-black text-white rounded-lg">Login</button>

      <Link className="text-2xl flex items-center" href="/components/cart">
        <FaCartShopping />
        {cartItems > 0 && (
          <span className="ml-2 bg-red-600 text-white px-2 py-1 rounded-full text-sm">
            {cartItems}
          </span>
        )}
      </Link>
    </div>
  );
}

export default Header;
