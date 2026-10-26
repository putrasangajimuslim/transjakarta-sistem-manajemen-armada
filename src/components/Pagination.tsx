import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

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
  // Menghitung start dan end agar akurat sesuai limit (misal: 1-5, atau 81-100)
  const start = count === 0 ? 0 : (page - 1) * limit + 1;
  const end = count === 0 ? 0 : (page - 1) * limit + count;
  
  // Menghapus logika "+ 1" yang membuat angka menjadi 101. 
  // Sekarang total akan murni mengikuti total asli (jika ada) atau batas jumlah data terakhir (misal: 100).
  const estimatedTotal = total ?? (hasNext ? page * limit : (page - 1) * limit + count);
  
  const actualTotalPages = total != null ? Math.max(1, Math.ceil(total / limit)) : null;
  const canGoBack = page > 1;
  const canGoNext = total != null ? page < actualTotalPages! : hasNext;

  // Console.log untuk memantau data di background
  useEffect(() => {
    console.log(`Menampilkan: ${count} data pada halaman ini | Total data: ${total ?? estimatedTotal}`);
  }, [count, total, estimatedTotal]);

  // Logika pembagian nomor halaman
  const getPageNumbers = () => {
    const startPage = Math.floor((page - 1) / 2) * 2 + 1;
    let pages = [startPage, startPage + 1, startPage + 2];

    if (total != null && actualTotalPages != null) {
      pages = pages.filter(p => p <= actualTotalPages);
    } else if (!hasNext) {
      pages = pages.filter(p => p <= page);
      if (pages.length === 1 && page > 1) {
        pages = [page - 1, page];
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
      {/* Bagian Kiri: Tampilkan, Dropdown Limit, dan Teks Informasi */}
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
          {/* Simbol "+" telah dihapus sepenuhnya dari sini */}
          Menampilkan <strong className="text-slate-800">{start} - {end}</strong> dari <strong className="text-slate-800">{estimatedTotal.toLocaleString("id-ID")}</strong> data
        </span>
      </div>

      {/* Bagian Kanan: Navigasi Panah dan Nomor Halaman */}
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