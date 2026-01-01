import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const baseStyles = `
  inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 active:scale-95
  disabled: opacity - 50 disabled: cursor - not - allowed`;

  const variants = {
    primary:
      "bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
    danger:
      "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
