import { useState, useEffect } from "react";
import {
  Calendar,
  CreditCard,
  Clock,
  AlertCircle,
  Motorbike,
} from "lucide-react";
import Button from "@/components/commons/Button";
import Pagination from "@/components/commons/Pagination";
import TransactionDetailModal from "@/components/modules/TransactionDetailModal";
import { backendApi } from "@/libs/apiInterface";

interface Transaction {
  _id: string;
  user_id: string;
  motor_id: string;
  rent_start: string;
  rent_end: string;
  created_at: string;
  total_price: number;
  payment_status: "unpaid" | "paid";
  status: "ongoing" | "completed";
}

interface Motor {
  _id: string;
  brand: string;
  image: string;
  license_plate: string;
  name: string;
  rent_price: number;
  status: "available" | "not_available";
}

interface EnrichedTransaction extends Transaction {
  motor: Motor | undefined;
}

interface PayAllStatus {
  status: "no_unpaid" | "paid";
  message: string;
}

interface TransactionResponse {
  data: Transaction[];
  meta: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
    total_unpaid: number;
  };
}

export default function ClientTransactions() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<EnrichedTransaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<EnrichedTransaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    total_pages: 1,
    total_unpaid: 0,
  });

  const [paymentStatus, setPaymentStatus] = useState<"unpaid" | "paid">(
    "unpaid",
  );

  const fetchAndProcessData = async (currentPage = page, limit = 5) => {
    setLoading(true);
    setError(null);
    try {
      const [transactionsResponse, motorsResponse] = await Promise.all([
        backendApi.get<TransactionResponse>(
          `/rental?page=${currentPage}&limit=${limit}`,
        ),
        backendApi.get<Motor[]>("/motor"),
      ]);

      const { data: transactionsData, meta } = transactionsResponse.data;
      const motorsData = motorsResponse.data;

      setPaginationMeta({
        total_pages: meta.total_pages,
        total_unpaid: meta.total_unpaid,
      });

      const motorsMap = new Map(motorsData.map((m) => [m._id, m]));

      const enrichedTransactions: EnrichedTransaction[] = transactionsData.map(
        (trx) => ({
          ...trx,
          motor: motorsMap.get(trx.motor_id),
        }),
      );

      setTransactions(enrichedTransactions);
    } catch (err) {
      console.error("Failed to fetch transaction data:", err);
      setError("Gagal memuat data transaksi. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndProcessData(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleShowDetail = (trx: EnrichedTransaction) => {
    setSelectedTransaction(trx);
  };

  const totalUnpaid = paginationMeta.total_unpaid;

  // --- HELPERS ---
  const getStatusColor = (paymentStatus: "unpaid" | "paid") => {
    switch (paymentStatus) {
      case "unpaid":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100";
    }
  };

  const getStatusLabel = (paymentStatus: "unpaid" | "paid") => {
    switch (paymentStatus) {
      case "unpaid":
        return "Belum Bayar";
      case "paid":
        return "Lunas";
      default:
        return paymentStatus;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getMotorImageUrl = (path: string | undefined) => {
    if (!path) return "https://placehold.co/600x400/EEE/31343C?text=N/A";
    return `${import.meta.env.VITE_BASE_API_URL}/${path}`;
  };

  const handleBayarAll = async () => {
    setLoading(true);
    try {
      const response = await backendApi.post<PayAllStatus>("/rental/pay_all");

      if (response.status === 200 && response.data.status === "paid") {
        setPaymentStatus("paid");
        alert(response.data.message);
      } else if (
        response.status === 200 &&
        response.data.status === "no_unpaid"
      ) {
        setPaymentStatus("unpaid");
        alert(response.data.message);
      }
    } catch (err) {
      console.error("Failed to pay all transactions:", err);

      alert("Gagal melakukan pembayaran. Coba lagi nanti.");
      throw new Error("Gagal melakukan pembayaran. Coba lagi nanti.");
    } finally {
      // Balik lagi ke page 1
      fetchAndProcessData(1);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800">
          Transaksi Saya 💸
        </h1>
        <p className="text-slate-500">
          Pantau transaksi sewa motor anda disini.
        </p>
      </div>

      {!loading && (
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
                * Segera bayar tagihan anda jika anda memiliki tagihan.
              </p>
            </div>
            {totalUnpaid > 0 && paymentStatus === "unpaid" && (
              <div>
                <Button
                  size="lg"
                  variant="primary"
                  className="bg-orange-400 hover:bg-orange-400 hover:drop-shadow-lg/10 drop-shadow-black transition-all duration-300 cursor-pointer"
                  onClick={handleBayarAll}
                >
                  Bayar Sekarang
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <h3 className="font-bold text-slate-700 text-lg flex items-center gap-2">
          <Clock size={20} /> Riwayat Sewa
        </h3>

        {loading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-slate-100 rounded-2xl animate-pulse"
            ></div>
          ))
        ) : error ? (
          <div className="text-center py-20 bg-red-50 rounded-3xl border border-dashed border-red-200">
            <AlertCircle className="text-red-400 mx-auto" size={32} />
            <h3 className="font-bold text-red-600 mt-4">Gagal memuat data</h3>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Motorbike className="text-orange-400" size={32} />
            </div>
            <h3 className="font-bold text-slate-600">Belum ada transaksi</h3>
            <p className="text-sm text-slate-400">
              Anda memiliki gaya hidup sehat... 👍🏻
            </p>
          </div>
        ) : (
          <div className="flex flex-col justify-between space-y-4">
            <div>
              {transactions.map((trx) => (
                <div
                  key={trx._id}
                  className="bg-white border border-slate-100 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-center"
                >
                  <div className="w-full md:w-32 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 relative">
                    <img
                      src={getMotorImageUrl(trx.motor?.image)}
                      alt={trx.motor?.name || "Motor Image"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-[10px] p-1 text-center font-mono backdrop-blur-sm">
                      {trx.motor?.license_plate || "N/A"}
                    </div>
                  </div>

                  <div className="flex-1 w-full text-center md:text-left">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                      <h4 className="font-bold text-lg text-slate-800">
                        {trx.motor?.name || "Motor Tidak Dikenal"}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(trx.payment_status)}`}
                      >
                        {getStatusLabel(trx.payment_status)}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 text-sm text-slate-500 mt-2 justify-center md:justify-start">
                      <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <Calendar size={14} className="text-orange-500" />
                        {formatDate(trx.rent_start)}{" "}
                        <span className="text-slate-300">s/d</span>{" "}
                        {formatDate(trx.rent_end)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs opacity-50">
                          #{trx._id.substring(0, 7)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center justify-between w-full md:w-auto gap-4 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Total Harga</p>
                      <p className="text-xl font-black text-slate-800">
                        Rp {trx.total_price.toLocaleString("id-ID")}
                      </p>
                    </div>

                    {trx.payment_status === "unpaid" ? (
                      <Button size="md" className="w-full md:w-auto">
                        Bayar
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="md"
                        className="w-full md:w-auto text-slate-400 hover:text-slate-600"
                        onClick={() => handleShowDetail(trx)}
                      >
                        Detail
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={paginationMeta.total_pages}
              onPageChange={handlePageChange}
              isLoading={loading}
            />
          </div>
        )}
      </div>

      <TransactionDetailModal
        isOpen={!!selectedTransaction}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
