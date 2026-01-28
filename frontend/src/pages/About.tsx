import {
  Github,
  Linkedin,
  Code2,
  Database,
  BookOpen,
  User,
  Star,
} from "lucide-react";
import Button from "@/components/commons/Button";
import { Link } from "react-router-dom";

export default function About() {
  const team = [
    {
      name: "M.Faridh Maulana",
      role: "Full-Stack Developer",
      desc: "The Architect. Mengubah kopi menjadi kode React & Python yang clean dan scalable.",
      icon: <Code2 size={20} className="text-blue-500" />,
      color: "from-blue-500 to-cyan-400",
    },
    {
      name: "Naufal Razzaq Muafa",
      role: "Backend Developer",
      desc: "The Engine. Memastikan server tetap 'Gass Poll' tanpa ada kata mogok atau crash.",
      icon: <Database size={20} className="text-emerald-500" />,
      color: "from-emerald-500 to-green-400",
    },
    {
      name: "Muhammad Dafi Al Haq",
      role: "Documentator",
      desc: "The Scribe. Karena codingan tanpa dokumentasi itu mitos, dan dia membuatnya nyata.",
      icon: <BookOpen size={20} className="text-purple-500" />,
      color: "from-purple-500 to-pink-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {" "}
      {/* pt-20 biar gak ketutupan Navbar fixed */}
      {/* Hero Section Khusus About */}
      <section className="bg-white border-b border-slate-200 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 animate-pulse">
          <Star size={200} className="text-orange-500" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="text-orange-600 font-bold tracking-widest uppercase text-sm mb-4 block">
            Know Us Better
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            We Build <span className="text-orange-500">Solutions</span>, <br />
            Not Just Applications.
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            GASS-POLL lahir dari keresahan mahasiswa yang capek jalan kaki. Kami
            menggabungkan teknologi modern dengan kebutuhan mobilitas harian
            untuk menciptakan ekosistem sewa motor yang efisien.
          </p>
        </div>
      </section>
      {/* Team Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-2"
              >
                {/* Profile Image Placeholder */}
                <div className="mb-8 relative mx-auto w-40 h-40">
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${member.color} rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity`}
                  ></div>
                  <div className="relative w-full h-full bg-slate-50 rounded-full flex items-center justify-center border-4 border-white shadow-inner overflow-hidden">
                    <User size={64} className="text-slate-300" />
                    {/* Nanti ganti <img> disini: <img src="..." className="w-full h-full object-cover"/> */}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white p-3 rounded-full shadow-lg border border-slate-100">
                    {member.icon}
                  </div>
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm font-mono text-slate-400 font-medium mb-4 uppercase tracking-wide bg-slate-50 py-1 px-3 rounded-full inline-block">
                    {member.role}
                  </p>
                  <p className="text-slate-500 leading-relaxed mb-8">
                    "{member.desc}"
                  </p>

                  {/* Social Links */}
                  <div className="flex justify-center gap-4">
                    <a
                      href="#"
                      className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all shadow-sm hover:shadow-md"
                    >
                      <Github size={20} />
                    </a>
                    <a
                      href="#"
                      className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all shadow-sm hover:shadow-md"
                    >
                      <Linkedin size={20} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Bottom */}
      <section className="bg-slate-900 text-white py-20 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">Tertarik gabung tim kita?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Sayangnya kita gak lagi open recruitment, tapi kalau mau sewa motor,
            kita selalu open 24 jam!
          </p>
          <Link to="/app/dashboard">
            <Button variant="primary" size="lg" className="animate-bounce">
              Gass Sewa Motor! 🛵
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
