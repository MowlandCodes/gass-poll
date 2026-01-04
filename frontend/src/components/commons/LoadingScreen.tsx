import { Motorbike } from "lucide-react";

interface LoadingScreenProps {
  text?: string;
}

export default function LoadingScreen({ text }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-white z-9999 flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>

        <div className="absolute inset-0 flex items-center justify-center text-orange-600">
          <Motorbike size={24} />
        </div>
      </div>
      <p className="mt-4 text-slate-500 font-medium animate-pulse">
        {text ?? "Loading..."}
      </p>
    </div>
  );
}
