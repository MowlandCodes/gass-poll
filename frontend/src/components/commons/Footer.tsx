import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 border-t-4 border-orange-500">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-2xl font-black mb-4 tracking-tighter">
          GASS<span className="text-orange-500">POLL</span>
        </h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Solusi sewa motor anti ribet untuk mahasiswa santuy. Motor nyaman,
          harga teman.
        </p>

        <div className="text-sm text-slate-500 flex items-center justify-center gap-1 font-mono">
          © {new Date().getFullYear()} Coded with{" "}
          <Heart size={14} className="text-red-500 fill-red-500" /> by
          <strong>DiBuffDoaOrtu</strong> Team
        </div>
      </div>
    </footer>
  );
}
