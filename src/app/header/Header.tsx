import Link from "next/link";
import type { NextPage } from "next";
import { FaCartShopping } from "react-icons/fa6";

// Define the type for props
interface HeaderProps {
  cartItems: number;
}

const Header: NextPage<HeaderProps> = ({ cartItems }) => {
  return (
    <div className="w-full h-16 sticky top-0 flex gap-x-4 bg-slate-400 justify-between sm:justify-center sm:gap-x-10 sm:px-4 px-2 items-center mb-4 sm:mb-3">
      <h1 className="font-serif font-semibold text-xl sm:text-3xl">Products</h1>

      <div className="flex items-center gap-x-4 sm:gap-x-6">
        <button className="px-3 sm:px-4 bg-black text-white rounded-lg text-sm sm:text-base">
          Login
        </button>

        <Link className="text-xl sm:text-2xl flex items-center" href="./cart">
          <FaCartShopping />
          {cartItems > 0 && (
            <span className="ml-1 sm:ml-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs sm:text-sm">
              {cartItems}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Header;
