import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Button from "@/components/commons/Button";

export default function HeroSection() {
  const userImages: string[] = [
    "https://i.pravatar.cc/100?img=1",
    "https://i.pravatar.cc/100?img=3",
    "https://i.pravatar.cc/100?img=7",
  ];

  return (
    <section className="relative py-20 lg:py-40 bg-orange-50/50 overflow-hidden">
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-125 h-125 bg-orange-200 rounded-full blur-3xl opacity-40 mix-blend-multiply animate-pulse"></div>
      <div className="absolute bottom-0 left-10 w-75 h-75 bg-amber-200 rounded-full blur-3xl opacity-40 mix-blend-multiply"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <span className="inline-flex items-center gap-1 py-1 px-3 rounded-full bg-orange-100 text-orange-600 text-xs font-bold tracking-widest mb-6 border border-orange-200 uppercase">
              <CheckCircle2 size={14} /> Resmi Anak Kampus
            </span>

            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              Jelajahi Kota Tanpa Batas.
              <br />
              Tinggal{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-amber-500">
                Gass Poll!
              </span>{" "}
              🛵
            </h1>

            <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Platform sewa motor paling sat-set buat mahasiswa. Gak perlu
              jaminan ribet, harga bersahabat, motor terawat. Pokoknya amanah.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/app/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full text-lg px-8 shadow-xl shadow-orange-500/30 group cursor-pointer"
                >
                  Cari Motor{" "}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full text-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer"
                >
                  Gimana Caranya?
                </Button>
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-orange-100 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500 font-medium">
              <div className="flex -space-x-3">
                {userImages.map((image, index) => {
                  return (
                    <img
                      src={image}
                      alt="User"
                      key={index}
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                  );
                })}
              </div>
              <p>
                <span className="text-orange-600 font-bold">500+</span>{" "}
                Mahasiswa udah Gass Poll.
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-lg transform hover:scale-105 transition-transform duration-500 ease-in-out">
              <div className="absolute inset-0 bg-linear-to-tr from-orange-400 to-amber-300 blur-2xl opacity-30 rounded-[3rem] -rotate-6 translate-y-4 scale-105"></div>

              <div className="relative rounded-[3rem] rounded-br-[5rem] border-4 border-white shadow-2xl shadow-orange-500/20 overflow-hidden -rotate-3 bg-white">
                <img
                  src={
                    "https://images.unsplash.com/photo-1636428818733-acdee12591e4?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  alt="Mahasiswa Naik Motor"
                  className="w-full h-80 object-cover object-center scale-110 hover:scale-100 transition-transform duration-700"
                />
              </div>

              <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-2xl shadow-[0_10px_40px_-15px_rgba(249,115,22,0.3)] border border-orange-100 flex items-center gap-3 animate-bounce z-20">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">
                    Ready to Gass! 🚀
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
