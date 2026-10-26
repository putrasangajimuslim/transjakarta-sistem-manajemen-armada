import { BusFront, Clock3, Gauge, MapPin, Navigation, Route as RouteIcon } from "lucide-react";
import type { Vehicle } from "../types/mbta";
import { formatCoordinate, formatDate, formatStatus } from "../utils/formatDate";

interface VehicleCardProps {
  vehicle: Vehicle;
  routeName?: string;
  tripName?: string;
  onViewDetails: (vehicle: Vehicle) => void;
}

function statusClass(status: string | null) {
  if (status === "IN_TRANSIT_TO") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "STOPPED_AT") return "bg-amber-50 text-amber-700 ring-amber-200";
  if (status === "INCOMING_AT") return "bg-sky-50 text-sky-700 ring-sky-200";
  return "bg-slate-100 text-slate-600 ring-slate-200";
}

export default function VehicleCard({ vehicle, routeName, tripName, onViewDetails }: VehicleCardProps) {
  const { attributes, relationships } = vehicle;
  const routeId = relationships?.route?.data?.id;
  const tripId = relationships?.trip?.data?.id;
  const label = attributes.label?.trim() || vehicle.id;

  return (
    <article className="flex h-full flex-col rounded-2xl border-0 ring-1 ring-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-blue-400">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
            <BusFront size={28} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Armada</p>
            <h2 className="truncate text-xl font-bold text-slate-900" title={label}>{label}</h2>
          </div>
        </div>
        <span className="max-w-28 truncate rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200" title={vehicle.id}>
          ID {vehicle.id}
        </span>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Status Operasional</p>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset shadow-sm ${statusClass(attributes.current_status)}`}>
          <span className="size-1.5 animate-pulse rounded-full bg-current" />
          {formatStatus(attributes.current_status)}
        </span>
      </div>

      <div className="mt-6 rounded-xl border border-blue-100/50 bg-blue-50/30 p-5">
        <div className="mb-3 flex items-center gap-2 text-blue-700">
          <MapPin size={18} />
          <h3 className="text-sm font-bold">Lokasi Saat Ini</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-xs font-medium text-slate-500">Latitude</p><p className="mt-1 break-all font-mono text-sm font-semibold text-slate-800">{formatCoordinate(attributes.latitude)}</p></div>
          <div><p className="text-xs font-medium text-slate-500">Longitude</p><p className="mt-1 break-all font-mono text-sm font-semibold text-slate-800">{formatCoordinate(attributes.longitude)}</p></div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="min-w-0 rounded-lg border border-slate-100 bg-slate-50 p-3">
          <div className="flex items-center gap-1.5 text-slate-400"><RouteIcon size={15} /><span className="text-xs font-medium">Route</span></div>
          <p className="mt-1 truncate text-sm font-bold text-slate-700" title={routeName ?? routeId ?? ""}>{routeName || routeId || "Tidak tersedia"}</p>
        </div>
        <div className="min-w-0 rounded-lg border border-slate-100 bg-slate-50 p-3">
          <div className="flex items-center gap-1.5 text-slate-400"><Navigation size={15} /><span className="text-xs font-medium">Trip</span></div>
          <p className="mt-1 truncate text-sm font-bold text-slate-700" title={tripName ?? tripId ?? ""}>{tripName || tripId || "Tidak tersedia"}</p>
        </div>
      </div>

      {attributes.speed != null && Number.isFinite(attributes.speed) && (
        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-600">
          <div className="flex size-7 items-center justify-center rounded-full bg-blue-100 text-blue-600"><Gauge size={14} /></div>
          <span>Kecepatan: <strong className="text-slate-800">{(attributes.speed * 3.6).toFixed(1)} km/jam</strong></span>
        </div>
      )}

      {/* mt-auto ditambahkan di sini untuk mendorong elemen ini dan tombol ke paling bawah */}
      <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-5 text-xs font-medium text-slate-400">
        <Clock3 size={15} /><span>Update {formatDate(attributes.updated_at)}</span>
      </div>
      
      <button type="button" onClick={() => onViewDetails(vehicle)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-4 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-lg active:scale-[0.98]">
        Detail Kendaraan <Navigation size={16} />
      </button>
    </article>
  );
}