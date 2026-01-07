import { useState, useEffect } from "react";
import { Search, Filter, RefreshCcw, AlertTriangle } from "lucide-react";
import { backendApi } from "@/libs/apiInterface";
import MotorCard from "@/components/modules/MotorCard";
import Button from "@/components/commons/Button";

type MotorStatus = "available" | "not_available";

interface Motor {
  _id: string;
  name: string;
  brand: string;
  image: string;
  license_plate: string;
  rent_price: number;
  status: MotorStatus;
}

export default function ClientDashboard() {
  const [motors, setMotors] = useState<Motor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "available" | "not_available"
  >("all");

  const fetchMotors = async () => {
    setLoading(true);
    setError("");

    try {
      await new Promise((r) => setTimeout(r, 1000));

      const response = await backendApi.get<Motor[]>("/motor");
      setMotors(response.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Gagal connect ke Database Server. Coba refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotors();
  }, []);

  const filteredMotors = motors.filter((motor) => {
    const matchSearch = motor.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchType = filterType === "all" || filterType === motor.status;
    return matchSearch && matchType;
  });

  // Handler Sewa
  const handleRent = (id: string) => {
    console.log("Booking ID:", id);
    alert(`Request booking motor ID ${id} dikirim ke server!`);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-white border-b border-orange-100 px-6 py-8 md:px-12 md:py-10 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                Katalog <span className="text-orange-500">Motor</span> 🛵
              </h1>
              <p className="text-slate-500 mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Server Status: Online & Ready to Gass
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96 group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Cari motor idaman..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter size={18} className="text-slate-400 mr-2 shrink-0" />
            {["all", "Tersedia", "Tidak Tersedia"].map((type) => (
              <button
                key={type}
                onClick={() =>
                  setFilterType(
                    type === "all"
                      ? "all"
                      : type === "Tersedia"
                        ? "available"
                        : "not_available",
                  )
                }
                className={`
                  px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border
                  ${
                    filterType ===
                    (type === "Tersedia"
                      ? "available"
                      : type === "Tidak Tersedia"
                        ? "not_available"
                        : "all")
                      ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30"
                      : "bg-white text-slate-600 border-slate-200 hover:border-orange-200 hover:bg-orange-50"
                  }
                `}
              >
                {type === "all" ? "Semua Tipe" : type}
              </button>
            ))}
            <RefreshCcw
              size={18}
              className="text-slate-400 ml-2 shrink-0 hover:text-orange-500 transition-colors cursor-pointer"
              onClick={fetchMotors}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {error && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl flex flex-col items-center text-center gap-3">
            <AlertTriangle className="text-red-500" size={32} />
            <h3 className="font-bold text-red-700">Connection Timed Out</h3>
            <p className="text-red-600/80 text-sm">{error}</p>
            <Button
              size="sm"
              variant="secondary"
              onClick={fetchMotors}
              className="mt-2"
            >
              <RefreshCcw size={16} className="mr-2" /> Try Again
            </Button>
          </div>
        )}

        {loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse"
              >
                <div className="bg-slate-200 h-48 rounded-xl mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between items-center mt-4">
                  <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-8 bg-slate-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredMotors.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-orange-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">404 Not Found</h3>
            <p className="text-slate-500 mt-2">
              Motor yang lu cari gak ada, Bre. Coba cari yang lain.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterType("all");
              }}
              className="mt-6 text-orange-600 font-bold hover:underline"
            >
              Reset Filter
            </button>
          </div>
        )}

        {!loading && !error && filteredMotors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMotors.map((motor, index) => (
              <MotorCard
                key={index}
                name={motor.name}
                image_url={motor.image}
                license_plate={motor.license_plate}
                rent_price={motor.rent_price}
                status={motor.status}
                onRent={() => handleRent(motor._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
