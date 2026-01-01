import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Motorbike, LogIn, Menu, X } from "lucide-react";
import Button from "@/components/commons/Button";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled || isMobileMenuOpen
          ? "bg-white backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-20 flex justify-between items-center relative z-50">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          onClick={closeMenu}
        >
          <div className="bg-orange-500 p-2 rounded-lg text-white transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-orange-500/20">
            <Motorbike size={24} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tighter">
            GASS<span className="text-orange-500">POLL</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center space-x-8 font-medium text-slate-600">
          <Link to="/" className="hover:text-orange-500 transition-colors">
            Beranda
          </Link>
          <Link to="/about" className="hover:text-orange-500 transition-colors">
            Tentang Kami
          </Link>
          <Link
            to="/app/dashboard"
            className="hover:text-orange-500 transition-colors"
          >
            Katalog
          </Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" size="md">
              Masuk
            </Button>
          </Link>
          <Link to="/register">
            <Button
              variant="primary"
              size="md"
              className="flex items-center gap-2"
            >
              Daftar
              <LogIn size={16} />
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-slate-600 hover:text-orange-500 transition-colors rounded-lg hover:bg-orange-50 active:scale-95"
          onClick={toggleMenu}
        >
          <div className="transition-transform duration-300">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </div>
        </button>
      </div>

      <div
        className={`absolute top-full left-0 w-full bg-white border-b border-orange-100 shadow-xl flex flex-col p-6 gap-4
    md:hidden -z-10 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
      isMobileMenuOpen
        ? "translate-y-0 opacity-100"
        : "-translate-y-10 opacity-0 pointer-events-none"
    }`}
      >
        <Link
          to="/"
          onClick={closeMenu}
          className="p-3 font-bold text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all flex items-center gap-3"
        >
          Beranda
        </Link>
        <Link
          to="/app/dashboard"
          onClick={closeMenu}
          className="p-3 font-bold text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all flex items-center gap-3"
        >
          Katalog Motor
        </Link>
        <Link
          to="/about"
          onClick={closeMenu}
          className="p-3 font-bold text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all flex items-center gap-3"
        >
          Tentang Kami
        </Link>

        <div className="h-px bg-slate-100 my-2"></div>

        <div className="grid grid-cols-2 gap-3">
          <Link to="/login" onClick={closeMenu}>
            <Button
              variant="ghost"
              className="w-full justify-center border border-slate-200"
            >
              Masuk
            </Button>
          </Link>
          <Link to="/register" onClick={closeMenu}>
            <Button variant="primary" className="w-full justify-center">
              Daftar
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
