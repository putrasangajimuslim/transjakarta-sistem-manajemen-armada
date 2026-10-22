import { LoaderCircle } from "lucide-react";

interface LoadingStateProps {
  label?: string;
  compact?: boolean;
}

export default function LoadingState({
  label = "Memuat data...",
  compact = false,
}: LoadingStateProps) {
  return (
    <div className={`flex items-center justify-center gap-3 text-slate-500 ${compact ? "py-4 text-sm" : "min-h-56 flex-col py-12"}`} role="status" aria-live="polite">
      <LoaderCircle className="animate-spin text-blue-600" size={compact ? 19 : 30} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
