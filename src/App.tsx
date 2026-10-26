import { useCallback, useMemo, useState } from "react";
import { BusFront, CircleHelp, RefreshCw, SlidersHorizontal, X } from "lucide-react";
import type { Vehicle } from "./types/mbta";
import { useVehicles } from "./hooks/useVehicles";
import { useRoutes } from "./hooks/useRoutes";
import { useTrips } from "./hooks/useTrips";
import VehicleGrid from "./components/VehicleGrid";
import VehicleDetailModal from "./components/VehicleDetailModal";
import MultiSelectDropdown from "./components/MultiSelectDropdown";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import Pagination from "./components/Pagination";

export default function App() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [selectedTrips, setSelectedTrips] = useState<string[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  const { routes, loading: routesLoading, loadingMore: routesLoadingMore, error: routesError, hasMore: routesHasMore, loadMore: loadMoreRoutes } = useRoutes();
  const { trips, loading: tripsLoading, loadingMore: tripsLoadingMore, error: tripsError, hasMore: tripsHasMore, loadMore: loadMoreTrips } = useTrips(selectedRoutes);
  const vehicleQuery = useMemo(() => ({ page, limit, routes: selectedRoutes, trips: selectedTrips }), [page, limit, selectedRoutes, selectedTrips]);
  const { vehicles, total, hasNext, loading, error, retry } = useVehicles(vehicleQuery);

  const routeNames = useMemo(() => new Map(routes.map((route) => [route.id, route.attributes.short_name || route.attributes.long_name || route.id])), [routes]);
  const tripNames = useMemo(() => new Map(trips.map((trip) => [trip.id, trip.attributes.headsign || trip.attributes.name || trip.id])), [trips]);

  const handleRoutesChange = useCallback((ids: string[]) => {
    setSelectedRoutes(ids);
    setSelectedTrips([]);
    setPage(1);
  }, []);
  const handleTripsChange = useCallback((ids: string[]) => {
    setSelectedTrips(ids);
    setPage(1);
  }, []);
  const handlePageChange = useCallback((nextPage: number) => {
    setPage(Math.max(1, nextPage));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const clearFilters = useCallback(() => {
    setSelectedRoutes([]);
    setSelectedTrips([]);
    setPage(1);
  }, []);

  const hasFilters = selectedRoutes.length > 0 || selectedTrips.length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-slate-900 via-[#102d49] to-slate-900 text-white shadow-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-7 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
              <BusFront size={25} className="text-white" />
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight">Fleet<span className="text-sky-400">Ops</span></p>
              <p className="text-xs text-blue-100/70">Sistem Manajemen Armada</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
        <section className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            {/* Badge MONITORING ARMADA telah dihilangkan */}
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Dashboard Kendaraan</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">Pantau status, lokasi, dan informasi operasional kendaraan secara langsung.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200/50">
              <p className="text-xs font-medium text-slate-400">Kendaraan di halaman</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{loading ? "—" : vehicles.length}</p>
            </div>
            <button type="button" onClick={retry} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-900 hover:shadow-lg active:scale-95">
              <RefreshCw size={16} className={loading ? "animate-spin text-blue-400" : "text-blue-400"} /> Refresh
            </button>
          </div>
        </section>

        {/* Menghapus 'overflow-hidden' agar dropdown tidak terpotong saat terbuka */}
        <section className="mb-8 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-md shadow-slate-200/40 sm:p-6 relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-2xl"></div>
          <div className="mb-5 flex items-center justify-between gap-3 pl-2">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                <SlidersHorizontal size={18} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">Filter kendaraan</h2>
                <p className="text-xs text-slate-500">Pilih satu atau lebih Route dan Trip</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {hasFilters && <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"><X size={16} /> Reset</button>}
              <button type="button" onClick={() => setShowFilters((value) => !value)} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors">
                {showFilters ? "Sembunyikan" : "Tampilkan"}
              </button>
            </div>
          </div>
          {showFilters && <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 pl-2">
            <MultiSelectDropdown label="Pilih Route" placeholder="Semua route" options={routes.map((route) => ({ id: route.id, label: route.attributes.short_name || route.id, description: route.attributes.long_name }))} selected={selectedRoutes} onChange={handleRoutesChange} onLoadMore={() => void loadMoreRoutes()} hasMore={routesHasMore} loading={routesLoading} loadingMore={routesLoadingMore} error={routesError} onRetry={() => void loadMoreRoutes(true)} />
            <MultiSelectDropdown label="Pilih Trip" placeholder={selectedRoutes.length ? "Pilih trip pada route terpilih" : "Semua trip"} options={trips.map((trip) => ({ id: trip.id, label: trip.attributes.headsign || trip.attributes.name || trip.id, description: `Trip ID: ${trip.id}` }))} selected={selectedTrips} onChange={handleTripsChange} onLoadMore={() => void loadMoreTrips()} hasMore={tripsHasMore} loading={tripsLoading} loadingMore={tripsLoadingMore} error={tripsError} onRetry={() => void loadMoreTrips(true)} />
          </div>}
        </section>

        <section>
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Daftar Kendaraan</h2>
              <p className="mt-1 text-sm text-slate-500">Menampilkan armada operasional sesuai filter.</p>
            </div>
          </div>
          {loading ? <div className="rounded-2xl border border-slate-200 bg-white shadow-sm"><LoadingState label="Mengambil data kendaraan..." /></div> : error ? <ErrorState message={error} onRetry={retry} /> : <>
            <VehicleGrid vehicles={vehicles} routeNames={routeNames} tripNames={tripNames} onViewDetails={setSelectedVehicle} />
            <div className="mt-6"><Pagination page={page} limit={limit} total={total} hasNext={hasNext} count={vehicles.length} onPageChange={handlePageChange} onLimitChange={(nextLimit) => { setLimit(nextLimit); setPage(1); }} /></div>
          </>}
        </section>

        <footer className="mt-12 flex flex-col gap-3 border-t border-slate-200 py-8 text-xs font-medium text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>FleetOps · Technical Assessment Frontend</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-slate-500"><CircleHelp size={13} /> Informasi dapat berubah sesuai data API.</span>
        </footer>
      </main>

      {selectedVehicle && <VehicleDetailModal vehicle={selectedVehicle} routeName={routeNames.get(selectedVehicle.relationships?.route?.data?.id ?? "")} tripName={tripNames.get(selectedVehicle.relationships?.trip?.data?.id ?? "")} onClose={() => setSelectedVehicle(null)} />}
    </div>
  );
}