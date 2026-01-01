import {
  useRouteError,
  isRouteErrorResponse,
  Link,
  useNavigate,
} from "react-router-dom";

import { Motorbike, Home, RotateCcw } from "lucide-react";
import Button from "@/components/commons/Button";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = "Terjadi kesalahan tak terduga.";
  let errorStatus = "500";
  let errorTitle = "Internal Server Error";

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status.toString();
    errorTitle =
      error.status === 404 ? "Halaman Tidak Ditemukan" : "Terjadi Kesalahan";
    errorMessage =
      error.status === 404
        ? "Halaman yang anda cari tidak dapat ditemukan"
        : "Ada yang salah dengan permintaan anda";
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-orange-50 relative overflow-hidden font-poppins">
      <div className="absolute top-10 left-10 w-32 h-32 bg-orange-200 rounded-full blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-60 mix-blend-multiply"></div>

      <div className="max-w-lg w-full bg-white/80 backdrop-blur-xl border border-orange-100 rounded-3xl shadow-2xl shadow-orange-500/10 p-8 md:p-12 text-center relative z-10">
        <div className="flex justify-center mb-8">
          <div className="bg-orange-100 p-4 rounded-full ring-8 ring-orange-50">
            <Motorbike size={48} className="text-orange-600" strokeWidth={2} />
          </div>
        </div>

        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-linear-to-br from-orange-500 to-amber-600 mb-2 tracking-tighter">
          {errorStatus}
        </h1>

        <h2 className="text-2xl font-bold text-slate-800 mb-4">{errorTitle}</h2>

        <p className="text-slate-500 mb-8 leading-relaxed">
          {errorMessage}
          <br />
          <span className="text-xs text-orange-400 mt-2 block font-mono bg-orange-50 py-1 px-2 rounded-lg mx-auto w-fit border border-orange-100">
            (Error Code: ID-10-T)
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw size={18} /> Kembali
          </Button>

          <Link to="/">
            <Button
              variant="primary"
              className="flex items-center gap-2 w-full sm:w-auto shadow-orange-500/30 cursor-pointer"
            >
              <Home size={18} /> Ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
