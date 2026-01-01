import { Star } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Udin Petot",
      role: "Maba Tersesat",
      text: "Motornya kenceng banget, kemaren gua pake buat ngejar deadline skripsi, eh malah nyampe Madiun.",
      avatar: "https://i.pravatar.cc/150?img=15",
    },
    {
      name: "Hadi Sontoloyo",
      role: "Anak Tengil",
      text: "Adminnya ramah, fast respon kayak server lokal. Motor bersih, wangi, gak bau matahari.",
      avatar: "https://i.pravatar.cc/150?img=13",
    },
    {
      name: "Yanto Laju Prima",
      role: "Anak TI",
      text: "Security sistemnya bagus, gua coba SQL Injection di form booking gak tembus. Approved!",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
  ];

  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Kata Mereka Yang Udah{" "}
            <span className="text-orange-500">Gass Poll</span>
          </h2>
          <p className="text-slate-300 mt-4">
            Review "jujur" dari pengguna setia.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-orange-500/5 border border-orange-100 flex flex-col"
            >
              <div className="flex gap-1 text-amber-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-slate-600 mb-8 italic grow">"{review.text}"</p>
              <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full border-2 border-orange-200"
                />
                <div>
                  <h4 className="font-bold text-slate-900">{review.name}</h4>
                  <p className="text-xs text-orange-500 font-bold uppercase tracking-wider">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
