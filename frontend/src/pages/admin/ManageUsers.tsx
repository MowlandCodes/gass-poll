import { useState, useEffect } from "react";
import { User, Shield, Mail } from "lucide-react";
import { backendApi } from "@/libs/apiInterface";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  created_at?: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    backendApi
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-800">User Management</h1>
        <p className="text-slate-500 text-sm">
          List of registered entities in the system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-orange-300 transition-all"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                user.role === "admin"
                  ? "bg-orange-100 text-orange-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {user.role === "admin" ? (
                <Shield size={24} />
              ) : (
                <User size={24} />
              )}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-slate-800 truncate">{user.name}</h4>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <Mail size={12} />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                    user.role === "admin"
                      ? "bg-orange-50 text-orange-600 border-orange-200"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  {user.role}
                </span>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1 rounded">
                  ID: {user._id.substring(0, 6)}...
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
