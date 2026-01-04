import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Phone,
} from "lucide-react";
import Button from "@/components/commons/Button";
import Input from "@/components/commons/InputField";
import { backendApi } from "@/libs/apiInterface";
import { isAxiosError } from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // State Form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    // Client-Side Validation: Password Match
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Password gak sinkron, Bre. Cek lagi!");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone,
      };

      await backendApi.post("/auth/register", payload);

      alert("Akun berhasil dibuat! Silakan login.");
      navigate("/login");
    } catch (error) {
      console.error("Register Failed:", error);
      if (isAxiosError(error)) {
        setErrorMsg(
          error.response?.data?.message ||
            "An error occured on Register. Please try again later.",
        );
      } else {
        setErrorMsg("An error occured on Register. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-row-reverse">
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-20 relative bg-white">
        <Link
          to="/"
          className="absolute top-8 right-8 lg:left-8 text-slate-500 hover:text-orange-600 transition-colors flex items-center gap-2 font-bold text-sm"
        >
          <ArrowLeft size={18} /> Batal Daftar
        </Link>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
              Register 🚀
            </h1>
            <p className="text-slate-500">
              Buat akun baru untuk lanjut menggunakan GassPoll.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 animate-pulse">
              <AlertCircle size={20} />
              <span className="text-sm font-bold">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nama Lengkap"
              name="name"
              placeholder="Nama Lengkap"
              icon={<User size={20} />}
              onChange={handleChange}
              required
            />

            <Input
              label="Email Kampus"
              name="email"
              type="email"
              placeholder="Email anda"
              icon={<Mail size={20} />}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Password Anda"
              icon={<Lock size={20} />}
              onChange={handleChange}
              required
            />

            <Input
              label="Ulangi Password"
              name="confirmPassword"
              type="password"
              placeholder="Ketik ulang password..."
              icon={<ShieldCheck size={20} />}
              onChange={handleChange}
              required
              className={
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                  : ""
              }
            />

            <Input
              label="Nomor Handphone"
              name="phone"
              type="tel"
              placeholder="+628xxxxxxxxx"
              onChange={handleChange}
              icon={<Phone size={20} />}
              required
            />

            <div className="flex items-start gap-3 mt-2">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  required
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 checked:bg-orange-500 checked:border-orange-500 transition-all"
                />
                <CheckCircle2
                  size={14}
                  className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100"
                />
              </div>
              <label className="text-sm text-slate-500 leading-tight">
                Saya setuju dengan{" "}
                <span className="font-bold text-orange-600">
                  Syarat & Ketentuan
                </span>{" "}
                Gass Poll.
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-lg shadow-xl shadow-orange-500/20 mt-4 cursor-pointer"
            >
              {isLoading ? "Lagi Mendaftarkan..." : "Daftar Sekarang ✨"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Udah punya akun?{" "}
            <Link
              to="/login"
              className="font-bold text-orange-600 hover:text-orange-700 hover:underline"
            >
              Login Aja
            </Link>
          </div>
        </div>
      </div>

      {/* --- GAMBAR SECTION (KIRI) --- */}
      <div className="hidden lg:block lg:w-1/2 bg-slate-900 relative overflow-hidden">
        {/* Background pattern beda dikit biar variatif */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

        <div className="absolute inset-0 flex items-center justify-center p-20">
          <div className="relative w-full max-w-lg aspect-square">
            <div className="absolute top-10 -right-10 w-64 h-64 bg-orange-500 rounded-full blur-[80px] opacity-40 animate-pulse"></div>
            <div className="absolute bottom-10 -left-10 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-40"></div>

            <img
              src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1000&auto=format&fit=crop"
              alt="Register Illustration"
              className="relative rounded-3xl shadow-2xl shadow-black/50 border-4 border-slate-800 -rotate-2 hover:rotate-0 transition-transform duration-700 object-cover h-full w-full"
            />

            <div className="absolute top-10 -right-5 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-xl z-10">
              <p className="text-white font-bold text-lg">
                ⚡ Instant Approval
              </p>
              <p className="text-slate-300 text-xs">Verifikasi secepat kilat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
