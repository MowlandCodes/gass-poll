import { Link } from "react-router-dom";
import { Motorbike } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 transition-all shadow-lg shadow-orange-700/15">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-orange-500 p-2 rounded-lg text-white transform group-hover:rotate-12 transition-transform duration-300">
            <Motorbike size={24} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tighter">
            GASS<span className="text-orange-500">POLL</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8 font-medium text-slate-600">
          <Link to="/" className="hover:text-orange-500 transition-all">
            Beranda
          </Link>
          <Link to="/about" className="hover:text-orange-500 transition-all">
            Tentang Kami
          </Link>
          <Link
            to="/app/dashboard"
            className="hover:text-orange-500 transition-all"
          >
            Katalog
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/*
      <Link to="/login">
      <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
        Masuk
      </Button>
      </Link>
      <Link to="/register">
      <Button variant="primary" size="sm" className="flex items-center gap-2">
        Daftar
        <LogIn size={16} />
      </Button>
      </Link>*/}
        </div>
      </div>
    </nav>
  );
}
