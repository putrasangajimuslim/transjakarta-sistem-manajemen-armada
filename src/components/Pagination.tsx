import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  limit: number;
  total: number | null;
  hasNext: boolean;
  count: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export default function Pagination({
  page,
  limit,
  total,
  hasNext,
  count,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  // Jika total tidak diberikan oleh API, estimasikan berdasarkan halaman aktif dan hasNext
  const estimatedTotal = total ?? (hasNext ? page * limit + 1 : (page - 1) * limit + count);
  
  const start = count === 0 ? 0 : (page - 1) * limit + 1;
  const end = count === 0 ? 0 : (page - 1) * limit + count;
  
  const totalPages = Math.max(1, Math.ceil(estimatedTotal / limit));
  const canGoBack = page > 1;
  const canGoNext = totalPages != null ? page < totalPages : hasNext;

  // Logika nomor halaman: Menampilkan rentang halaman secara dinamis (misal: 1, 2, 3, 4 tergantung total data)
  const getPageNumbers = () => {
    const totalP = totalPages || 1;
    if (totalP <= 5) {
      return Array.from({ length: totalP }, (_, i) => i + 1);
    }
    
    if (page <= 3) {
      return [1, 2, 3, 4, '...', totalP];
    } else if (page >= totalP - 2) {
      return [1, '...', totalP - 3, totalP - 2, totalP - 1, totalP];
    } else {
      return [1, '...', page - 1, page, page + 1, '...', totalP];
    }
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
      {/* Bagian Kiri: Tampilkan, Dropdown Limit, dan Format Teks "Menampilkan X - Y dari Z data" */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <span className="font-medium text-slate-700">Tampilkan</span>
        <select
          value={limit}
          onChange={(event) => onLimitChange(Number(event.target.value))}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        >
          {[5, 10, 20].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span className="text-slate-500">
          Menampilkan <strong className="text-slate-800">{start} - {end}</strong> dari <strong className="text-slate-800">{estimatedTotal.toLocaleString("id-ID")}</strong> data
        </span>
      </div>

      {/* Bagian Kanan: Navigasi Panah dan Nomor Halaman Konsisten */}
      <div className="flex items-center justify-end gap-1.5">
        <button
          type="button"
          disabled={!canGoBack}
          onClick={() => onPageChange(page - 1)}
          aria-label="Halaman sebelumnya"
          className="flex size-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronLeft size={18} className={canGoBack ? "text-blue-600" : "text-slate-300"} />
        </button>

        {pages.map((p, index) => {
          if (p === '...') {
            return (
              <span key={`ellipsis-${index}`} className="flex size-9 items-center justify-center text-sm font-semibold text-slate-400">
                ...
              </span>
            );
          }

          const pageNum = p as number;
          const isActive = pageNum === page;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`flex size-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => onPageChange(page + 1)}
          aria-label="Halaman berikutnya"
          className="flex size-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronRight size={18} className={canGoNext ? "text-blue-600" : "text-slate-300"} />
        </button>
      </div>
    </div>
  );
}