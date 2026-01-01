import { Link } from "react-router-dom";
import Hero from "@/components/modules/LandingPage/Hero";
import Button from "@/components/commons/Button";
import HowItWorks from "@/components/modules/LandingPage/HowItWorks";
import Testimonials from "@/components/modules/LandingPage/Testimonials";
import FAQ from "@/components/modules/LandingPage/FAQ";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <HowItWorks />
      <Testimonials />
      <FAQ />

      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-6">
          <span className="text-4xl text-transparent font-black bg-clip-text bg-linear-to-r from-orange-600 to-amber-500">
            Tunggu Apa Lagi?
          </span>
          <p className="mb-8 mt-6 max-w-xl mx-auto">
            Motor terbatas, yang mau sewa banyak. Jangan sampe keduluan kating!
          </p>
          <Link to="/app/dashboard">
            <Button
              variant="primary"
              size="lg"
              className="animate-bounce cursor-pointer"
            >
              Booking Sekarang!
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
