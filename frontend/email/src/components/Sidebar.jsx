import { useLocation, Link } from "react-router-dom";
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

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();

  return (
    <aside
      className={`h-screen  bg-[#0f2c5c] transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-16" : "w-64"
      } text-white shadow-lg`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between p-4  border-blue-800">
        {!isCollapsed && (
          <div className="text-lg font-bold tracking-wide">NOC Tracker</div>
        )}
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="p-2 rounded-md transition-transform duration-300 hover:scale-110 hover:bg-white hover:text-[#0f2c5c]"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-auto mt-5 space-y-2 px-1">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;

          return (
            <Link
              key={path}
              to={path}
              title={isCollapsed ? label : undefined}
              className={`group flex items-center px-3 py-2 text-md font-medium transition-all duration-200 
                rounded-md border-y-2 border-transparent
                ${
                  isActive
                    ? "bg-white text-[#15255F] font-semibold"
                    : "hover:text-white hover:bg-[#0f2c5c] hover:border-y-white hover:scale-105"
                }
                ${isCollapsed ? "justify-center" : "gap-2"}
              `}
            >
              <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              {!isCollapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 mt-auto text-sm text-blue-200  border-blue-800">
          <p>© 2025 Company</p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
