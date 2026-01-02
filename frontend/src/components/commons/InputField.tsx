import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

export default function Input({
  label,
  icon,
  error,
  type = "text",
  className,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm font-bold text-slate-700 ml-1 block">
          {label}
        </label>
      )}

      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none">
            {icon}
          </div>
        )}

        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={`
            w-full bg-slate-50 border rounded-xl px-4 py-3 font-medium text-slate-800 placeholder:text-slate-400
            transition-all duration-200 outline-none
            ${icon ? "pl-12" : ""} 
            ${isPassword ? "pr-12" : ""}
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                : "border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
            }
            ${className}
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 font-medium ml-1 animate-pulse">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
