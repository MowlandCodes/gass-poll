import { HelpCircle } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      q: "Perlu jaminan KTP asli gak min?",
      a: "Gak perlu guys, foto KTM aja udh cukup kok. Kita percaya sama mahasiswa (dikit).",
    },
    {
      q: "Motor mogok di jalan gimana?",
      a: "Telpon kita, nanti kita kirim mekanik atau doa dari jauh. Tenang, motor kita servis rutin kok.",
    },
    {
      q: "Bisa sewa buat pacaran?",
      a: "Apakah anda menantang maut? Kalo sudah bosan hidup silahkan saja...",
    },
    {
      q: "Kalo telat balikin kena denda?",
      a: "Jelas dong. Denda berjalan sesuai ketentuan yang telah berlaku.",
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <HelpCircle size={32} className="text-orange-500" />
          <h2 className="text-3xl font-black text-slate-800">
            Yang Sering Ditanyain (FAQ)
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-200 transition-colors"
            >
              <h3 className="font-bold text-lg text-slate-800 mb-2 flex gap-2">
                <span className="text-orange-500">Q.</span> {item.q}
              </h3>
              <p className="text-slate-500 leading-relaxed pl-6 border-l-2 border-orange-200">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
