import { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarWidth = isCollapsed ? "w-16" : "w-64";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarWidth} bg-[#0f2c5c] text-white transition-all duration-300`}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 dark:bg-gray-900">
        {/* Navbar */}
        <div className="sticky top-0 z-10 bg-[#0f2c5c] text-white shadow-md px-4 py-3">
          <Navbar />
        </div>

        {/* Main Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white dark:bg-gray-800 p-6 min-h-full ">
            <Outlet />
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#0f2c5c] text-white text-sm py-2 px-6 flex justify-between items-center">
          <div>© 2025 SHARP Insights</div>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Contact Us</a>
            <a href="#" className="hover:underline">User Guide</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
