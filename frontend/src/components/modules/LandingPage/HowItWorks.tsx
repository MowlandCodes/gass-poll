import { Search, UserCheck, CreditCard, Key } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-8 h-8 text-orange-600" />,
      title: "1. Pilih Unit",
      desc: "Cari motor yang sesuai ama kamu.",
    },
    {
      icon: <UserCheck className="w-8 h-8 text-orange-600" />,
      title: "2. Verifikasi KTM",
      desc: "Upload foto KTM kamu. Kita bakal verifikasi kamu.",
    },
    {
      icon: <CreditCard className="w-8 h-8 text-orange-600" />,
      title: "3. Bayar Murah",
      desc: "Transfer sesuai harga. Tanpa hidden fees.",
    },
    {
      icon: <Key className="w-8 h-8 text-orange-600" />,
      title: "4. Gass Poll",
      desc: "Ambil kunci, pake helm, langsung Gass Poll.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-orange-500 font-bold tracking-widest uppercase text-sm">
            Alur Peminjaman
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mt-2">
            Gampang Banget, <br />{" "}
            <span className="text-orange-500">Tutup mata pun bisa</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-orange-100 -z-10 transform -translate-y-1/2"></div>

          {steps.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-orange-500/5 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-16 h-16 mx-auto bg-orange-50 rounded-2xl flex items-center justify-center mb-6 border border-orange-100 relative z-10">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                {item.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
