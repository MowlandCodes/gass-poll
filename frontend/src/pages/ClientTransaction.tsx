import { useState, useEffect } from "react";
import { Calendar, CreditCard, Clock, AlertCircle, Bike } from "lucide-react";
import Button from "@/components/commons/Button";

// Mock Data Transaksi (Schema Database Imajiner)
interface Transaction {
  id: string;
  motorName: string;
  motorImage: string;
  platNomor: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "pending_payment" | "active" | "completed" | "cancelled";
  paymentMethod?: string;
}

export default function ClientTransactions() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setTransactions([
        {
          id: "TRX-998811",
          motorName: "NMAX Aerox Ngabers",
          motorImage:
            "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=200",
          platNomor: "B 666 R",
          startDate: "2025-01-05",
          endDate: "2025-01-07",
          totalPrice: 240000,
          status: "pending_payment", // <--- Ini yang bikin "Harga yang harus dibayar"
        },
        {
          id: "TRX-772211",
          motorName: "Honda Beat Mberr",
          motorImage:
            "https://images.unsplash.com/photo-1591638258359-001c23803855?auto=format&fit=crop&q=80&w=200",
          platNomor: "AE 1922 XX",
          startDate: "2025-01-01",
          endDate: "2025-01-03",
          totalPrice: 100000,
          status: "completed",
          paymentMethod: "QRIS",
        },
        {
          id: "TRX-554433",
          motorName: "Vespa Matic Hedon",
          motorImage:
            "https://images.unsplash.com/photo-1623049591467-6238b1968a35?auto=format&fit=crop&q=80&w=200",
          platNomor: "AB 1234 UGM",
          startDate: "2024-12-28",
          endDate: "2024-12-29",
          totalPrice: 150000,
          status: "cancelled",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const totalUnpaid = transactions
    .filter((t) => t.status === "pending_payment")
    .reduce((sum, t) => sum + t.totalPrice, 0);

  // Helper Warna Status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_payment":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "active":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-slate-100 text-slate-500 border-slate-200";
      default:
        return "bg-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending_payment":
        return "Belum Bayar";
      case "active":
        return "Sedang Dipinjam";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* --- HEADER --- */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800">
          Transaksi Saya 💸
        </h1>
        <p className="text-slate-500">
          Pantau transaksi sewa motor anda disini.
        </p>
      </div>

      {totalUnpaid > 0 && (
        <div className="bg-linear-to-r from-orange-500 to-red-500 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-orange-500/20 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CreditCard size={120} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-orange-100 font-medium mb-1 flex items-center gap-2">
                <AlertCircle size={18} /> Tagihan Belum Dibayar
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Rp {totalUnpaid.toLocaleString("id-ID")}
              </h2>
              <p className="text-sm text-orange-100 mt-2 opacity-80">
                *Segera bayar tagihan anda.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <h3 className="font-bold text-slate-700 text-lg flex items-center gap-2">
          <Clock size={20} /> Riwayat Sewa
        </h3>

        {loading
          ? [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-slate-100 rounded-2xl animate-pulse"
              ></div>
            ))
          : transactions.map((trx) => (
              <div
                key={trx.id}
                className="bg-white border border-slate-100 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-center"
              >
                {/* Gambar Motor */}
                <div className="w-full md:w-32 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 relative">
                  <img
                    src={trx.motorImage}
                    alt={trx.motorName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-[10px] p-1 text-center font-mono backdrop-blur-sm">
                    {trx.platNomor}
                  </div>
                </div>

                {/* Info Utama */}
                <div className="flex-1 w-full text-center md:text-left">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                    <h4 className="font-bold text-lg text-slate-800">
                      {trx.motorName}
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(trx.status)}`}
                    >
                      {getStatusLabel(trx.status)}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 text-sm text-slate-500 mt-2 justify-center md:justify-start">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <Calendar size={14} className="text-orange-500" />
                      {trx.startDate}{" "}
                      <span className="text-slate-300">s/d</span> {trx.endDate}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs opacity-50">
                        #{trx.id}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center justify-between w-full md:w-auto gap-4 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Total Harga</p>
                    <p className="text-xl font-black text-slate-800">
                      Rp {trx.totalPrice.toLocaleString("id-ID")}
                    </p>
                  </div>

                  {trx.status === "pending_payment" ? (
                    <Button size="sm" className="w-full md:w-auto">
                      Bayar
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full md:w-auto text-slate-400"
                    >
                      Detail
                    </Button>
                  )}
                </div>
              </div>
            ))}

        {/* Empty State */}
        {!loading && transactions.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bike className="text-orange-400" size={32} />
            </div>
            <h3 className="font-bold text-slate-600">Belum ada transaksi</h3>
            <p className="text-sm text-slate-400">Lu jalan kaki terus ya?</p>
          </div>
        )}
      </div>
    </div>
  );
}
