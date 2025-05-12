import { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Layout Body */}
      <div className="flex h-screen overflow-hidden bg-gray-100">
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Main Content Area */}
       <main
          className={`transition-all duration-300 ease-in-out p-4 ${
            isCollapsed ? "w-[calc(100%-5rem)]" : "w-[calc(100%-16rem)]"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
