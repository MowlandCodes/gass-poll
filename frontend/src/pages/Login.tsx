import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Bike } from "lucide-react";
import Button from "@/components/commons/Button";
import Input from "@/components/commons/InputField";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      console.log("Login Payload:", formData);

      // TODO: Login Logic

      setIsLoading(false);
      navigate("/app/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-20 relative">
        <Link
          to="/"
          className="absolute top-8 left-8 text-slate-500 hover:text-orange-600 transition-colors flex items-center gap-2 font-bold text-sm"
        >
          <ArrowLeft size={18} /> Balik ke Kandang
        </Link>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-orange-600">
              <Bike size={24} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
              Welcome Back! 👋
            </h1>
            <p className="text-slate-500">
              Silahkan Masuk menggunakan email dan password kamu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Anda"
              name="email"
              type="email"
              placeholder="Email"
              icon={<Mail size={20} />}
              onChange={handleChange}
              required
            />

            <div>
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Password"
                icon={<Lock size={20} />}
                onChange={handleChange}
                required
              />
              <div className="flex justify-end mt-2">
                <a
                  href="#"
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
                >
                  Lupa Password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="w-full py-4 text-lg shadow-orange-500/20"
            >
              {isLoading ? "Sedang Menunggu...." : "Login"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="font-bold text-orange-600 hover:text-orange-700 hover:underline transition-all"
            >
              Daftar Disini
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 bg-orange-50 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-orange-600 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ea580c 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        ></div>

        <div className="absolute inset-0 flex items-center justify-center p-20">
          <div className="relative w-full max-w-lg aspect-square">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            <img
              src="https://images.unsplash.com/photo-1636428818733-acdee12591e4?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Login Illustration"
              className="w-full h-80 object-cover object-center relative rounded-3xl shadow-2xl shadow-orange-500/20 border-4 border-white rotate-3 hover:rotate-0 transition-transform duration-700"
            />

            <div className="absolute bottom-20 -left-10 bg-white p-6 rounded-2xl shadow-xl max-w-xs animate-bounce z-10">
              <p className="text-slate-700 font-medium italic">
                "Coding itu gampang, yang susah itu ngertiin kode orang lain."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                <span className="text-xs font-bold text-slate-400">
                  Unknown
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
