import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Check, ChevronDown, ChevronUp, X, Loader2, Search } from 'lucide-react';

export interface Option {
  id: string;
  label: string;
  description?: string;
}

interface MultiSelectDropdownProps {
  label: string;
  placeholder: string;
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  loadingMore?: boolean;
  error?: Error | null | string;
  onRetry?: () => void;
}

export default function MultiSelectDropdown({
  label,
  placeholder,
  options,
  selected,
  onChange,
  onLoadMore,
  hasMore,
  loading,
  loadingMore,
  error,
  onRetry
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredOptions = useMemo(() => {
    if (!debouncedSearch.trim()) return options;
    const lower = debouncedSearch.toLowerCase();
    return options.filter(
      (o) => o.label.toLowerCase().includes(lower) || o.description?.toLowerCase().includes(lower)
    );
  }, [debouncedSearch, options]);

  const toggleOption = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(item => item !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const removeFirstOption = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selected.length > 0) {
      onChange(selected.filter(item => item !== selected[0]));
    }
  };

  const toggleAll = () => {
    if (selected.length === filteredOptions.length && filteredOptions.length > 0) {
      onChange([]); 
    } else {
      onChange(filteredOptions.map(o => o.id)); 
    }
  };

  const firstSelectedOption = options.find(o => o.id === selected[0]);
  const isAllSelected = selected.length === filteredOptions.length && filteredOptions.length > 0;

  return (
    <div className="relative flex flex-col gap-1.5" ref={containerRef}>
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      
      <div
        className={`flex min-h-[46px] w-full cursor-pointer items-center justify-between rounded-xl border bg-white px-3 py-2 shadow-sm transition-colors ${
          isOpen ? 'border-blue-600' : 'border-slate-200 hover:border-slate-300'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-1 flex-wrap items-center gap-2 overflow-hidden">
          {selected.length === 0 ? (
            <span className="text-sm text-slate-400">{placeholder}</span>
          ) : (
            <>
              {firstSelectedOption && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-700">
                  <span className="max-w-[120px] truncate">{firstSelectedOption.label}</span>
                  <button
                    type="button"
                    onClick={removeFirstOption}
                    className="rounded-full text-slate-400 p-0.5 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              {selected.length > 1 && (
                <span className="text-sm font-semibold text-blue-600">
                  +{selected.length - 1} lainnya
                </span>
              )}
            </>
          )}
        </div>
        <div className="ml-2 flex items-center border-l border-slate-200 pl-2 text-slate-400">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg">
          <div className="p-2 pb-0">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <Search size={16} />
              <input
                type="text"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Cari..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto p-2">
            <div
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50"
              onClick={toggleAll}
            >
              <div className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                isAllSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
              }`}>
                {isAllSelected && <Check size={14} className="text-white" strokeWidth={3} />}
              </div>
              <span className="text-sm font-medium text-slate-700">Semua</span>
            </div>
            
            <div className="my-1 mx-2 h-px bg-slate-100" />

            {loading && filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500">Memuat data...</div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500">Tidak ada hasil ditemukan.</div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selected.includes(option.id);
                return (
                  <div
                    key={option.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50"
                    onClick={() => toggleOption(option.id)}
                  >
                    <div className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                      isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700">{option.label}</span>
                      {option.description && (
                        <span className="text-xs text-slate-400">{option.description}</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {hasMore && !debouncedSearch && (
              <div className="mt-2 flex justify-center pb-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onLoadMore?.(); }}
                  disabled={loadingMore}
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 disabled:text-slate-400"
                >
                  {loadingMore && <Loader2 size={12} className="animate-spin" />}
                  {loadingMore ? 'Memuat...' : 'Muat lebih banyak'}
                </button>
              </div>
            )}
            {error && (
              <div className="p-2 text-center text-xs text-rose-500">
                Gagal memuat data. <button onClick={(e) => { e.stopPropagation(); onRetry?.(); }} className="font-semibold underline">Coba lagi</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}