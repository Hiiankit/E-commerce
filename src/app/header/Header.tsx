import Link from "next/link";
import type { NextPage } from "next";
import { FaCartShopping } from "react-icons/fa6";

// Define the type for props
interface HeaderProps {
  cartItems: number; // Use the any type
}

const Header: NextPage<HeaderProps> = ({ cartItems }) => {
  return (
    <div className="w-full h-16 sticky top-0 flex gap-x-10 bg-slate-400 justify-center mb-4 sm:mb-3 items-center">
      <h1 className="font-serif font-semibold text-3xl">Products</h1>

      <button className="px-4 bg-black text-white rounded-lg">Login</button>

      <Link className="text-2xl flex items-center" href="./cart">
        <FaCartShopping />
        {cartItems > 0 && (
          <span className="ml-2 bg-red-600 text-white px-2 py-1 rounded-full text-sm">
            {cartItems}
          </span>
        )}
      </Link>
    </div>
  );
};

export default Header;
