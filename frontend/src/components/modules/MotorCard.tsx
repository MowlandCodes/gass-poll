interface MotorProps {
  name: string;
  image_url: string;
  license_plate: string;
  rent_price: number;
  status: "available" | "not_available";
  onRent: () => void;
}

export default function MotorCard({
  name,
  image_url,
  license_plate,
  rent_price,
  status,
  onRent,
}: MotorProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700 border-green-200";
      case "not_available":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getMotorImage = (path: string | undefined) => {
    if (!path) return "https://placehold.co/600x400/EEE/31343C?text=N/A";
    return `${import.meta.env.VITE_BASE_API_URL}/${path}`;
  };

  return (
    <div className="group bg-white rounded-2xl border border-orange-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
        <img
          src={
            getMotorImage(image_url) ||
            "https://placehold.co/600x400/EEE/31343C?text=N/A"
          }
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="p-5 flex flex-col grow">
        <div className="flex justify-between items-start mb-2">
          <h3
            className="text-lg font-bold text-slate-800 line-clamp-1"
            title={name}
          >
            {name}
          </h3>
          <span
            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border ${getStatusColor(status)}`}
          >
            {status === "available" ? "Tersedia" : "Tersewa"}
          </span>
        </div>

        <p className="text-slate-400 text-xs font-mono mb-4 flex items-center gap-1">
          <span className="tracking-widest">{license_plate}</span>
        </p>

        <div className="mt-auto pt-4 border-t border-dashed border-orange-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Harga Sewa</span>
            <span className="text-lg font-black text-brand-600">
              Rp {rent_price.toLocaleString("id-ID")}
              <span className="text-xs font-normal text-slate-400">/jam</span>
            </span>
          </div>

          <button
            disabled={status !== "available"}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-lg 
                ${
                  status === "available"
                    ? "bg-brand-500 hover:bg-brand-600 text-white shadow-orange-500/30 hover:shadow-orange-500/50 active:scale-95 cursor-pointer"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                }`}
            onClick={onRent}
          >
            {status === "available" ? "Sewa" : "Habis"}
          </button>
        </div>
      </div>
    </div>
  );
}
