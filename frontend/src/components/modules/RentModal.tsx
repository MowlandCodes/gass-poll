import { useState, useEffect } from "react";
import { X, Clock, Calculator } from "lucide-react";

interface Motor {
  _id: string;
  name: string;
  rent_price: number;
  image: string;
  license_plate: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  motor: Motor | null;
  onConfirm: (motorId: string, duration: number) => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  motor,
  onConfirm,
}: BookingModalProps) {
  const [duration, setDuration] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  // Reset state pas modal kebuka
  useEffect(() => {
    if (isOpen && motor) {
      setDuration(1);
      setTotalPrice(motor.rent_price);
    }
  }, [isOpen, motor]);

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val > 0) {
      setDuration(val);
      if (motor) setTotalPrice(val * motor.rent_price);
    }
  };

  const getImageUrl = (path: string | undefined) => {
    if (!path) return "https://placehold.co/600x400/EEE/31343C?text=N/A";
    return path.startsWith("http")
      ? path
      : `${import.meta.env.VITE_BASE_API_URL}/${path}`;
  };

  if (!isOpen || !motor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-pop-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-orange-50 p-4 border-b border-orange-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Clock className="text-orange-500" size={20} /> {/* Icon Jam */}
            Sewa Motor (Hourly)
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Motor Info */}
          <div className="flex gap-4 items-center">
            <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
              <img
                src={getImageUrl(motor.image)}
                alt={motor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-lg line-clamp-1">
                {motor.name}
              </h4>
              <p className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded w-fit mt-1">
                {motor.license_plate}
              </p>
              {/* Ganti label harga jadi per jam */}
              <p className="text-sm text-brand-600 font-semibold mt-1">
                Rp {motor.rent_price.toLocaleString("id-ID")}/jam
              </p>
            </div>
          </div>

          {/* Input Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 block">
                Mau sewa berapa jam? {/* Label ganti */}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="24" // Masa sewa motor sampe 100 jam? Capek mesinnya bre.
                  value={duration}
                  onChange={handleDurationChange}
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 font-bold text-slate-800 text-lg transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                  Jam {/* Satuan ganti */}
                </span>
              </div>
            </div>

            {/* Total Price Section */}
            <div className="bg-orange-50 rounded-xl p-4 border border-dashed border-orange-200 flex justify-between items-center">
              <div className="flex items-center gap-2 text-orange-700">
                <Calculator size={18} />
                <span className="text-sm font-medium">Total Tagihan</span>
              </div>
              <span className="text-xl font-black text-orange-600">
                Rp {totalPrice.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex gap-3 bg-slate-50/50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all text-sm border border-transparent hover:border-slate-200"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(motor._id, duration)}
            className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 active:scale-95 transition-all text-sm"
          >
            Gass Sewa! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
