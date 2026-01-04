import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Motorbike, UserCircle, LogOut, Menu, X } from "lucide-react";
import Button from "@/components/commons/Button";
import { backendApi } from "@/libs/apiInterface";
import LoadingScreen from "@/components/commons/LoadingScreen";

export default function ClientLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await backendApi.get("/auth/logout");

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Logout Failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  const menus = [
    {
      label: "Katalog Motor",
      path: "/app/dashboard",
      icon: <Motorbike size={20} />,
    },
    {
      label: "Profile Saya",
      path: "/app/profile",
      icon: <UserCircle size={20} />,
    },
  ];

  if (isLoggingOut) {
    return <LoadingScreen text="Logging out..." />;
  }

  return (
    <div className="flex h-screen bg-orange-50/30 font-poppins overflow-hidden">
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-orange-100 shadow-xl shadow-orange-500/5 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Brand */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-orange-50">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-orange-500 p-1.5 rounded-lg text-white group-hover:rotate-12 transition-transform">
              <Motorbike size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tighter">
              GASS<span className="text-orange-500">POLL</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          <div className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Main Menu
          </div>
          {menus.map((menu) => {
            const isActive = location.pathname === menu.path;
            return (
              <Link
                key={menu.path}
                to={menu.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                            ${
                              isActive
                                ? "bg-orange-50 text-orange-600 font-bold border border-orange-200"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                            }
                        `}
              >
                {menu.icon}
                <span>{menu.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-6">
          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full justify-start text-slate-500 hover:text-red-500 hover:bg-red-50 gap-3 cursor-pointer"
          >
            <LogOut size={18} /> Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        {/* Navbar Mobile (User) */}
        <header className="h-16 md:hidden bg-white/80 backdrop-blur border-b border-orange-100 flex items-center justify-between px-6 sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-600"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-slate-700">Dashboard</span>
          <div className="w-8"></div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/20 z-40 md:hidden backdrop-blur-sm"
        ></div>
      )}
    </div>
  );
}
