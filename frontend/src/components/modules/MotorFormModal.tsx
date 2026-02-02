import { useState, useEffect } from "react";
import { X, Save, Bike } from "lucide-react";
import InputField from "@/components/commons/InputField";
import Button from "@/components/commons/Button";

interface Motor {
  _id?: string;
  name: string;
  brand: string;
  license_plate: string;
  rent_price: number;
  image: string;
  status: "available" | "not_available";
}

interface MotorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Motor) => void;
  initialData?: Motor | null;
  isLoading?: boolean;
}

export default function MotorFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: MotorFormModalProps) {
  const defaultState: Motor = {
    name: "",
    brand: "",
    license_plate: "",
    rent_price: 0,
    image: "",
    status: "available",
  };

  const [formData, setFormData] = useState<Motor>(defaultState);

  // Effect: Kalo ada initialData (Mode Edit), isi form-nya. Kalo gak (Mode Add), reset.
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || defaultState);
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-pop-up">
        {/* Header */}
        <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
          <h3 className="font-bold flex items-center gap-2">
            <Bike className="text-orange-500" />
            {initialData ? "Edit Motor Config" : "Deploy New Unit"}
          </h3>
          <button
            onClick={onClose}
            className="hover:text-red-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Motor Name"
              placeholder="Ex: Honda Beat Mberr"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <InputField
              label="Brand"
              placeholder="Ex: Honda"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="License Plate"
              placeholder="AE 1234 XX"
              value={formData.license_plate}
              onChange={(e) =>
                setFormData({ ...formData, license_plate: e.target.value })
              }
              required
            />
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">
                Rent Price / Hour
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                value={formData.rent_price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rent_price: parseInt(e.target.value),
                  })
                }
                min={0}
                required
              />
            </div>
          </div>

          {/* Image URL Input (Sementara Text dulu sesuai backend lu yg parser string) */}
          <InputField
            label="Image Path / URL"
            placeholder="public/honda-vario.webp"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
          />

          {/* Status Dropdown */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">
              Status Unit
            </label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as any })
              }
            >
              <option value="available">Available (Ready to Deploy)</option>
              <option value="not_available">
                Not Available (Maintenance/Rented)
              </option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-4">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading
                ? "Writing to Disk..."
                : initialData
                  ? "Overwrite Changes"
                  : "Deploy Unit"}
              {!isLoading && <Save size={18} className="ml-2" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
