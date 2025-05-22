import React from "react";
import { FiSearch } from "react-icons/fi";

const Navbar = () => {
  return (
    <header className="w-full h-14 bg-[#0f2c5c] flex items-center justify-center px-4 shadow">
      <div className="relative w-full max-w-4xl">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 rounded bg-[#183b70] text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
    </header>
  );
};

export default Navbar;
