import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { backendApi } from "@/libs/apiInterface";
import Button from "@/components/commons/Button";

interface Motor {
  _id: string;
  name: string;
  license_plate: string;
  status: "available" | "not_available";
  rent_price: number;
}

export default function ManageMotors() {
  const [motors, setMotors] = useState<Motor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchMotors = async () => {
    setLoading(true);
    try {
      const res = await backendApi.get("/motor");
      setMotors(res.data);
    } catch (err) {
      alert("Failed to fetch inventory assets!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotors();
  }, []);

  const filteredMotors = motors.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.license_plate.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            Motor Inventory
          </h1>
          <p className="text-slate-500 text-sm">Manage your physical assets.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search query..."
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 w-64"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button size="sm" onClick={() => alert("Implement Modal Add Here!")}>
            <Plus size={18} className="mr-2" /> Add Unit
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Unit Name</th>
              <th className="px-6 py-4">License Plate</th>
              <th className="px-6 py-4">Rate / Hour</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-slate-400"
                >
                  Loading modules...
                </td>
              </tr>
            ) : (
              filteredMotors.map((motor) => (
                <tr
                  key={motor._id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {motor.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-500 bg-slate-50 w-fit rounded">
                    {motor.license_plate}
                  </td>
                  <td className="px-6 py-4 text-orange-600 font-bold">
                    Rp {motor.rent_price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        motor.status === "available"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}
                    >
                      {motor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
