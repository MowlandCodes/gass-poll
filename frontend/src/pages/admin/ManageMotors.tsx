import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, AlertTriangle } from "lucide-react";
import { backendApi } from "@/libs/apiInterface";
import Button from "@/components/commons/Button";
import MotorFormModal from "@/components/modules/MotorFormModal";

interface Motor {
  _id: string;
  name: string;
  brand: string;
  license_plate: string;
  status: "available" | "not_available";
  rent_price: number;
  image: string;
}

export default function ManageMotors() {
  const [motors, setMotors] = useState<Motor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // State buat Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMotor, setSelectedMotor] = useState<Motor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMotors = async () => {
    setLoading(true);
    try {
      const res = await backendApi.get("/motor");
      setMotors(res.data);
    } catch (err) {
      console.error("Connection Refused:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotors();
  }, []);

  const handleAdd = () => {
    setSelectedMotor(null); // Null berarti mode ADD
    setIsModalOpen(true);
  };

  const handleEdit = (motor: Motor) => {
    setSelectedMotor(motor); // Isi data berarti mode EDIT
    setIsModalOpen(true);
  };

  const handleSubmitData = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        brand: formData.brand,
        license_plate: formData.license_plate,
        rent_price: formData.rent_price,
        image_url: formData.image,
        status: formData.status,
      };

      if (selectedMotor && selectedMotor._id) {
        await backendApi.put(`/motor/${selectedMotor._id}`, payload);
      } else {
        await backendApi.post("/motor", payload);
      }

      await fetchMotors();
      setIsModalOpen(false);
    } catch (err) {
      alert("Operation Failed: Permission Denied or Server Error.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "WARNING: You are about to DELETE this asset permanently. Continue? (y/n)",
      )
    )
      return;

    try {
      await backendApi.delete(`/motor/${id}`);
      setMotors((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert("Failed to delete asset.");
    }
  };

  const filteredMotors = motors.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.license_plate.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            Motor Inventory
          </h1>
          <p className="text-slate-500 text-sm">
            Physical Asset Management Console
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Grep motor..."
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 w-full md:w-64"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button size="sm" onClick={handleAdd}>
            <Plus size={18} className="mr-2" /> Deploy Unit
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Unit Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Plate & Brand</th>
              <th className="px-6 py-4">Rate / Hour</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-slate-400 animate-pulse"
                >
                  Scanning database...
                </td>
              </tr>
            ) : filteredMotors.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-slate-400"
                >
                  <AlertTriangle className="inline mr-2" />
                  No assets found in repository.
                </td>
              </tr>
            ) : (
              filteredMotors.map((motor) => (
                <tr
                  key={motor._id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{motor.name}</div>
                    {/* preview Image kecil kalo ada */}
                    {motor.image && (
                      <div className="text-[10px] text-slate-400 truncate max-w-25">
                        {motor.image}
                      </div>
                    )}
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
                  <td className="px-6 py-4">
                    <div className="font-mono text-slate-600">
                      {motor.license_plate}
                    </div>
                    <div className="text-xs text-slate-400">{motor.brand}</div>
                  </td>
                  <td className="px-6 py-4 text-orange-600 font-bold">
                    Rp {motor.rent_price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(motor)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                        title="Edit Config"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(motor._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                        title="Nuke Asset"
                      >
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

      <MotorFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitData}
        initialData={selectedMotor}
        isLoading={isSubmitting}
      />
    </div>
  );
}
