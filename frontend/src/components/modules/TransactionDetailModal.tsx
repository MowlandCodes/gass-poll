import { X, Calendar, Receipt, CheckCircle, Clock } from "lucide-react";
import Button from "@/components/commons/Button";

interface Motor {
  _id: string;
  name: string;
  image: string;
  license_plate: string;
}

interface Transaction {
  _id: string;
  rent_start: string;
  rent_end: string;
  total_price: number;
  payment_status: "unpaid" | "paid";
  status: "ongoing" | "completed";
  motor?: Motor;
}

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export default function TransactionDetailModal({
  isOpen,
  onClose,
  transaction,
}: TransactionDetailModalProps) {
  if (!isOpen || !transaction) return null;

  // Helper format tanggal
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMotorImage = (path: string | undefined) => {
    if (!path) return "https://placehold.co/600x400/EEE/31343C?text=N/A";
    return `${import.meta.env.VITE_BASE_API_URL}/${path}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-pop-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-800 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Receipt size={100} />
          </div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-mono mb-1">
                INVOICE ID
              </p>
              <h3 className="font-mono text-xl font-bold tracking-wider">
                #{transaction._id.substring(0, 8).toUpperCase()}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div
              className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 border ${
                transaction.payment_status === "paid"
                  ? "bg-green-500/20 border-green-400 text-green-300"
                  : "bg-orange-500/20 border-orange-400 text-orange-300"
              }`}
            >
              {transaction.payment_status === "paid" ? (
                <>
                  <CheckCircle size={16} /> LUNAS
                </>
              ) : (
                <>
                  <Clock size={16} /> BELUM BAYAR
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 bg-slate-50/50">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
            <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0">
              <img
                src={getMotorImage(transaction.motor?.image)}
                alt={transaction.motor?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-lg">
                {transaction.motor?.name}
              </h4>
              <p className="text-sm text-slate-500 mb-2">
                {transaction.motor?.license_plate}
              </p>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                {transaction.status === "ongoing"
                  ? "Sedang Dipinjam"
                  : "Selesai"}
              </span>
            </div>
          </div>

          <div className="relative pl-4 border-l-2 border-dashed border-slate-200 space-y-6">
            <div className="relative">
              <div className="absolute -left-5.25 top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-100"></div>
              <p className="text-xs text-slate-400 mb-1">Waktu Mulai</p>
              <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                {formatDate(transaction.rent_start)}
              </p>
            </div>
            <div className="relative">
              <div className="absolute -left-5.25 top-1 w-3 h-3 rounded-full bg-red-500 ring-4 ring-red-100"></div>
              <p className="text-xs text-slate-400 mb-1">Waktu Selesai</p>
              <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                {formatDate(transaction.rent_end)}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 flex justify-between items-end">
            <div className="text-slate-500 text-sm">Total Tagihan</div>
            <div className="text-2xl font-black text-slate-800">
              Rp {transaction.total_price.toLocaleString("id-ID")}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
          <Button
            variant="primary"
            className="w-full justify-center"
            onClick={onClose}
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
