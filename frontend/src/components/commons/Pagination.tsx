import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        disabled={currentPage === 1 || isLoading}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
      >
        <ChevronLeft size={20} />
      </button>

      <span className="text-sm font-medium text-slate-600">
        Page <span className="text-orange-600 font-bold">{currentPage}</span> of{" "}
        <span className="text-slate-800 font-bold">{totalPages}</span>
      </span>

      <button
        disabled={currentPage === totalPages || isLoading}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
