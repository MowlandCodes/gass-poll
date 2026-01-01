import { Outlet } from "react-router-dom";
import Navbar from "@/components/commons/Navbar";
import Footer from "@/components/commons/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-orange-200 selection:text-orange-900 font-poppins">
      <Navbar />
      <main className="grow pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
