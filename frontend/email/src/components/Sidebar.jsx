import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  Mail,
  Bell,
  PackageSearch,
  FileBarChart,
  AlertTriangle,
  ListTodo,
  KeyRound,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Alert Dashboard", icon: Bell },
  { path: "/email", label: "Compose Email", icon: Mail },
  { path: "/rma", label: "RMA Tracker", icon: PackageSearch },
  { path: "/reports", label: "Reports", icon: FileBarChart },
  { path: "/p1p2", label: "P1P2_Tick", icon: AlertTriangle },
  { path: "/total", label: "TOTAL", icon: ListTodo },
  { path: "/license", label: "License", icon: KeyRound },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <aside
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } bg-white p-4 shadow-md transition-all duration-300 flex flex-col`}
    >
      {/* Toggle Button */}
      <button onClick={toggleCollapse} className="mb-6 text-left">
        <Menu className="w-6 h-6" />
      </button>

      {/* Navigation */}
      <nav className="flex flex-col space-y-6">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center transition-all duration-200 ${
                isCollapsed ? "justify-center" : "gap-3"
              } ${isActive ? "text-blue-600 font-semibold" : "text-gray-800 hover:text-blue-600"}`}
              title={isCollapsed ? label : undefined}
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
