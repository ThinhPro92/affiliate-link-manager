import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Link as LinkIcon,
  LogOut,
  BarChart3,
  PieChart,
  FolderKanban,
} from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { to: "/campaigns", label: "Chiến dịch", icon: FolderKanban },
    { to: "/links", label: "Quản lý Link", icon: LinkIcon },
    { to: "/analytics", label: "Phân tích", icon: PieChart },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
      {/* Sidebar cho Desktop (Giữ nguyên logic của bạn) */}
      <aside className="w-64 bg-slate-900 dark:bg-slate-900 text-white hidden md:flex flex-col border-r dark:border-slate-800">
        <div className="p-8 font-black text-xl flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl">
            <BarChart3 size={24} className="text-white" />
          </div>
          <span className="tracking-tight">AffLink</span>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center space-x-3 p-3.5 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                <span className="font-bold text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
          <div className="flex flex-col mb-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Tài khoản
            </span>
            <p className="text-sm text-slate-300 font-medium truncate">
              {email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3.5 w-full rounded-2xl hover:bg-red-500/10 text-red-400 transition-colors font-bold text-sm"
          >
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        <header className="h-20 bg-white dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10 transition-colors">
          <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
            Hệ thống quản lý
          </h2>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {/* Nút đăng xuất nhanh trên mobile */}
            <button
              title="Logiut"
              onClick={handleLogout}
              className="md:hidden text-red-500 p-2"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation cho Mobile (Bổ sung mới) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex md:hidden justify-around items-center h-16 px-2 z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? "text-blue-600" : "text-slate-500"
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-bold mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
