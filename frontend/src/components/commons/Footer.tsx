import { Motorbike } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-orange-50 text-white py-8 border-t-4 border-orange-500">
      <div className="container mx-auto px-6 text-center">
        <div className="flex items-center justify-center mb-8 space-x-2">
          <div className="bg-orange-500 p-2 rounded-lg text-white transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-orange-500/20">
            <Motorbike size={24} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl text-slate-900 font-black tracking-tighter">
            GASS<span className="text-orange-500">POLL</span>
          </h2>
        </div>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Solusi sewa motor anti ribet untuk mahasiswa santuy. Motor nyaman,
          harga teman.
        </p>

        <div className="text-sm text-slate-600 flex items-center justify-center gap-1 font-mono">
          © {new Date().getFullYear()} Created by
          <strong> DiBuffDoaOrtu</strong> Team
        </div>
      </div>
    </footer>
  );
}
