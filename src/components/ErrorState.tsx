import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  compact?: boolean;
}

export default function ErrorState({ message, onRetry, compact = false }: ErrorStateProps) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 ${compact ? "p-3 text-sm" : "mx-auto max-w-xl flex-col p-8 text-center"}`} role="alert">
      <AlertTriangle size={compact ? 18 : 28} className="shrink-0" aria-hidden="true" />
      <div className={compact ? "min-w-0 flex-1" : ""}>
        <p className="font-semibold">Data belum dapat dimuat</p>
        <p className="mt-1 text-sm">{message}</p>
      </div>
      {onRetry && (
        <button type="button" onClick={onRetry} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-rose-700 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-800">
          <RefreshCw size={15} aria-hidden="true" /> Coba lagi
        </button>
      )}
    </div>
  );
}
