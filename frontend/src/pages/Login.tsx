import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Motorbike, AlertCircle } from "lucide-react";
import Button from "@/components/commons/Button";
import Input from "@/components/commons/InputField";
import { backendApi } from "@/libs/apiInterface";
import { isAxiosError } from "axios";
import NaikMotorImage from "@/assets/img/naik-motor.webp";

interface IFormData {
  email: string;
  password: string;
}

interface ILoggedInUser {
  role: string;
  name: string;
  email: string;
}

interface IResponseLogin {
  token: string;
  message: string;
  user: ILoggedInUser;
}

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/app/dashboard";
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await backendApi.post<IResponseLogin>(
        "/auth/login",
        formData,
      );

      console.log("Login Successful...");
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate(from, { replace: true });
    } catch (err) {
      console.error("An error occured on Login...");

      if (isAxiosError(err)) {
        setError(err.response?.data?.message);
      } else {
        console.error("API Interface Error: ", err);
        setError("Something went wrong...");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-20 relative">
        <Link
          to="/"
          className="absolute top-8 left-8 text-slate-500 hover:text-orange-600 transition-colors flex items-center gap-2 font-bold text-sm"
        >
          <ArrowLeft size={18} /> Kembali ke Beranda
        </Link>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-orange-600">
              <Motorbike size={24} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
              Welcome Back! 👋
            </h1>
            <p className="text-slate-500">
              Silahkan Masuk menggunakan email dan password kamu.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 animate-pulse">
              <AlertCircle size={20} />
              <span className="text-sm font-bold">{error}</span>
            </div>
          )}

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
              {isLoading ? (
                <span className="flex items-center gap-2">
                  {/* Spinner CSS sederhana */}
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </span>
              ) : (
                "Login"
              )}
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
              src={NaikMotorImage}
              alt="Naik motor"
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
