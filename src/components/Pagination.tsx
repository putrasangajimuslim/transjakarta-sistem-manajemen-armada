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
  // Jika total tidak diberikan oleh API, estimasikan agar teks "Menampilkan X-Y" tetap berjalan
  const estimatedTotal = total ?? (hasNext ? page * limit + 1 : (page - 1) * limit + count);
  
  const start = count === 0 ? 0 : (page - 1) * limit + 1;
  const end = count === 0 ? 0 : (page - 1) * limit + count;
  
  // Memisahkan kalkulasi batas navigasi berdasarkan ketersediaan total data
  const actualTotalPages = total != null ? Math.max(1, Math.ceil(total / limit)) : null;
  const canGoBack = page > 1;
  const canGoNext = total != null ? page < actualTotalPages! : hasNext;

  // Console.log untuk melihat ada berapa data (ditampilkan dan total)
  useEffect(() => {
    console.log(`Menampilkan: ${count} data pada halaman ini | Total data: ${total ?? 'Tidak diketahui (berbasis hasNext)'}`);
  }, [count, total]);

  // Logika nomor halaman sesuai pola yang diminta: 
  // Halaman 1 & 2 -> [1, 2, 3]
  // Halaman 3 & 4 -> [3, 4, 5]
  const getPageNumbers = () => {
    // Menentukan angka awal halaman berdasarkan pembagian blok per 2 halaman
    const startPage = Math.floor((page - 1) / 2) * 2 + 1;
    
    let pages = [startPage, startPage + 1, startPage + 2];

    if (total != null && actualTotalPages != null) {
      // Jika API menyediakan total data, pastikan halaman tidak melewati batas maksimum
      pages = pages.filter(p => p <= actualTotalPages);
    } else if (!hasNext) {
      // Jika API tidak mengirimkan total dan sudah tidak ada data selanjutnya (hasNext = false)
      // potong array agar tidak menampilkan halaman kosong di depan
      pages = pages.filter(p => p <= page);
      
      // Jika setelah dipotong hanya tersisa 1 halaman (misal di halaman terakhir 3), 
      // tampilkan angka sebelumnya agar desain tombol tidak sendirian
      if (pages.length === 1 && page > 1) {
        pages = [page - 1, page];
      }
    }

    return pages;
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
          Menampilkan <strong className="text-slate-800">{start} - {end}</strong> dari <strong className="text-slate-800">{estimatedTotal.toLocaleString("id-ID")}{total == null && "+"}</strong> data
        </span>
      </div>

      {/* Bagian Kanan: Navigasi Panah dan Nomor Halaman Dinamis */}
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
          // (Opsional) Jika di kemudian hari Anda menambahkan fitur '...' lagi
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