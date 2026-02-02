import { useEffect, useState } from "react";
import { Users, Bike, AlertCircle, DollarSign, Activity } from "lucide-react";
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

interface TransactionMeta {
  data: Transaction[];
  meta: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
    total_unpaid: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    motors: 0,
    revenue: 0,
    active_rentals: 0,
  });

  const calculateRevenue = async (trx: TransactionMeta): Promise<number> => {
    // check whether the default limit didn't get all the data
    if (trx.meta.limit < trx.meta.total_items) {
      try {
        const res = await backendApi.get<TransactionMeta>(
          `/rental?limit=${trx.meta.total_items}`,
        );

        // Recursively calculate the revenue
        return await calculateRevenue(res.data);
      } catch (err) {
        console.error("Error calculating revenue:", err);
        return 0;
      }
    }

    // ALl the paid and completed transactions
    const paidTransactions = trx.data.filter(
      (trx) => trx.payment_status === "paid" && trx.status === "completed",
    );

    const totalRevenue = paidTransactions.reduce((accumulated, trx) => {
      return accumulated + trx.total_price;
    }, 0);

    return totalRevenue + trx.meta.total_unpaid;
  };

  const calculateActiveRentals = async (
    trx: TransactionMeta,
  ): Promise<number> => {
    // check whether the default limit didn't get all the data
    if (trx.meta.limit < trx.meta.total_items) {
      try {
        const res = await backendApi.get<TransactionMeta>(
          `/rental?limit=${trx.meta.total_items}`,
        );

        return await calculateActiveRentals(res.data);
      } catch (err) {}
    }

    const activeTransactions = trx.data.filter(
      (trx) => trx.status === "ongoing" && trx.payment_status === "unpaid",
    );

    return activeTransactions.length;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, motorsRes, trxRes] = await Promise.all([
          backendApi.get("/users"),
          backendApi.get("/motor"),
          backendApi.get<TransactionMeta>("/rental"),
        ]);

        const revenue = await calculateRevenue(trxRes.data);
        const activeRentals = await calculateActiveRentals(trxRes.data);

        setStats((prev) => ({
          ...prev,
          users: usersRes.data.length,
          motors: motorsRes.data.length,
          revenue,
          active_rentals: activeRentals,
        }));
      } catch (err) {
        console.error("Dashboard Glitch:", err);
      }
    };
    fetchData();
  }, []);

  const cards = [
    {
      label: "Total User",
      value: stats.users,
      icon: <Users size={24} />,
      color: "bg-blue-500",
    },
    {
      label: "Total Armada",
      value: stats.motors,
      icon: <Bike size={24} />,
      color: "bg-orange-500",
    },
    {
      label: "Est. Revenue",
      value: `Rp ${stats.revenue.toLocaleString("id-ID")}`,
      icon: <DollarSign size={24} />,
      color: "bg-green-500",
    },
    {
      label: "Active Rentals",
      value: stats.active_rentals,
      icon: <Activity size={24} />,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight font-mono">
            Main Dashboard
          </h1>
          <p className="text-slate-500 text-sm">System Overview & Monitoring</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group"
          >
            <div className="flex flex-row justify-between items-center">
              <div
                className={`p-3 rounded-xl text-white shadow-lg shadow-gray-200 ${card.color} group-hover:scale-110 transition-transform`}
              >
                {card.icon}
              </div>
              <div className="flex flex-col text-right">
                <h3 className="text-slate-500 text-sm font-medium mb-1">
                  {card.label}
                </h3>
                <p className="text-2xl font-black text-slate-800">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 text-slate-300 font-mono text-xs shadow-2xl">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
          <AlertCircle size={14} className="text-orange-500" />
          <span className="font-bold text-white">
            System Logs (tail -f /var/log/syslog)
          </span>
        </div>
        <div className="space-y-2 opacity-80">
          <p>[INFO] Kernel initialized... Ready to Gass Poll.</p>
          <p>[WARN] User 'mowlandcodes' is reaching API rate limit.</p>
          <p>[INFO] New deployment successful on /dev/production.</p>
          <p className="text-green-400">
            [SUCCESS] Database connection established (Latency: 2ms).
          </p>
        </div>
      </div>
    </div>
  );
}
