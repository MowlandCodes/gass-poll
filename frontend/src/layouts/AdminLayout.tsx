import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bike,
  Users,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  Bell,
} from "lucide-react";

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  const menus = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { label: "Manage Motor", path: "/admin/motors", icon: <Bike size={20} /> },
    { label: "Manage Users", path: "/admin/users", icon: <Users size={20} /> },
  ];

  if (isLoggingOut) {
    return (
      <div className="fixed inset-0 z-9999 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center text-white">
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-12 h-12 border-4 border-red-900 border-t-red-500 rounded-full animate-spin mb-4"></div>
          <p className="font-bold text-lg">Terminating Session...</p>
          <p className="text-xs text-slate-400 font-mono">
            sudo kill -9 user_session
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 font-poppins overflow-hidden">
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out border-r border-slate-800
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Header Sidebar */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2 font-black text-xl tracking-tighter text-white">
            <ShieldAlert className="text-orange-500" />
            <span>
              ADMIN<span className="text-orange-500">PANEL</span>
            </span>
          </div>
          {/* Close Button Mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-1 mt-2">
          <div className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 font-mono">
            Main Modules
          </div>

          {menus.map((menu) => {
            const isActive = location.pathname === menu.path;
            return (
              <Link
                key={menu.path}
                to={menu.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                            flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden
                            ${
                              isActive
                                ? "bg-orange-600 text-white shadow-lg shadow-orange-900/50"
                                : "hover:bg-slate-800 hover:text-white"
                            }
                        `}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-white/20"></div>
                )}

                <span className={isActive ? "animate-pulse" : ""}>
                  {menu.icon}
                </span>
                <span className="font-medium text-sm">{menu.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar (Logout) */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-800 bg-slate-950">
          {/* Admin Profile Mini */}
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded bg-linear-to-tr from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-xs">
              SU
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                Super Admin
              </p>
              <p className="text-[10px] text-green-500 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>{" "}
                Online
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center justify-center gap-2 px-4 py-2 w-full text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/50 rounded-lg transition-all text-sm font-bold group"
          >
            <LogOut
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Kill Session
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h2 className="font-bold text-slate-700 hidden sm:block font-mono">
              Admin Dashboard
            </h2>
          </div>

          {/* Right: Notifications (Gimmick) */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-orange-500 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              v1.0.0-stable
            </span>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <Outlet />
        </main>
      </div>

      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/80 z-40 md:hidden backdrop-blur-sm transition-opacity"
        ></div>
      )}
    </div>
  );
}
