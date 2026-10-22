import { useEffect } from "react";
import { X, BusFront, Clock3, MapPin, Navigation, Route as RouteIcon, Gauge } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { Vehicle } from "../types/mbta";
import { formatCoordinate, formatDate, formatStatus } from "../utils/formatDate";

const vehicleIcon = L.divIcon({
  className: "vehicle-map-marker",
  html: '<div style="background:#155eef;color:white;border:3px solid white;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px #0003">●</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

function MapResize() {
  const map = useMap();
  useEffect(() => { const timer = window.setTimeout(() => map.invalidateSize(), 120); return () => window.clearTimeout(timer); }, [map]);
  return null;
}

interface VehicleDetailModalProps {
  vehicle: Vehicle;
  routeName?: string;
  tripName?: string;
  onClose: () => void;
}

export default function VehicleDetailModal({ vehicle, routeName, tripName, onClose }: VehicleDetailModalProps) {
  const { attributes } = vehicle;
  const hasCoordinates = attributes.latitude != null && attributes.longitude != null && Number.isFinite(attributes.latitude) && Number.isFinite(attributes.longitude);
  const position: [number, number] = hasCoordinates ? [attributes.latitude!, attributes.longitude!] : [42.3601, -71.0589];

  useEffect(() => {
    function handleKey(event: KeyboardEvent) { if (event.key === "Escape") onClose(); }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const fields = [
    { label: "Label kendaraan", value: attributes.label || vehicle.id, icon: BusFront },
    { label: "Status", value: formatStatus(attributes.current_status), icon: Navigation },
    { label: "Route", value: routeName || vehicle.relationships?.route?.data?.id || "Tidak tersedia", icon: RouteIcon },
    { label: "Trip", value: tripName || vehicle.relationships?.trip?.data?.id || "Tidak tersedia", icon: Navigation },
    { label: "Latitude", value: formatCoordinate(attributes.latitude), icon: MapPin },
    { label: "Longitude", value: formatCoordinate(attributes.longitude), icon: MapPin },
    { label: "Kecepatan", value: attributes.speed == null ? "Tidak tersedia" : `${(attributes.speed * 3.6).toFixed(1)} km/jam`, icon: Gauge },
    { label: "Pembaruan terakhir", value: formatDate(attributes.updated_at), icon: Clock3 },
    { label: "Arah (bearing)", value: attributes.bearing == null ? "Tidak tersedia" : `${attributes.bearing}°`, icon: Navigation },
    { label: "Occupancy", value: attributes.occupancy_status || "Tidak tersedia", icon: BusFront },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="vehicle-modal-title" className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><BusFront size={23} /></div><div><p className="text-xs font-medium uppercase tracking-wider text-slate-400">Detail armada</p><h2 id="vehicle-modal-title" className="text-lg font-bold text-slate-900">{attributes.label || vehicle.id}</h2></div></div>
          <button type="button" onClick={onClose} aria-label="Tutup detail kendaraan" className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X size={21} /></button>
        </header>
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h3 className="mb-4 text-sm font-bold text-slate-800">Informasi kendaraan</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {fields.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-3"><div className="flex items-center gap-2 text-slate-400"><Icon size={14} /><span className="text-xs">{label}</span></div><p className="mt-2 break-words text-sm font-semibold text-slate-800">{value}</p></div>)}
            </div>
          </div>
          <div>
            <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-bold text-slate-800">Posisi kendaraan</h3>{!hasCoordinates && <span className="text-xs text-amber-700">Koordinat tidak tersedia</span>}</div>
            <div className="h-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <MapContainer center={position} zoom={hasCoordinates ? 15 : 11} scrollWheelZoom className="h-full w-full">
                <MapResize />
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {hasCoordinates && <Marker position={position} icon={vehicleIcon}><Popup>{attributes.label || vehicle.id}</Popup></Marker>}
              </MapContainer>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">Peta menggunakan OpenStreetMap. Lokasi ditampilkan hanya jika API menyediakan koordinat yang valid.</p>
          </div>
        </div>
        <footer className="flex justify-end border-t border-slate-100 px-5 py-4 sm:px-7"><button type="button" onClick={onClose} className="rounded-xl bg-[#12385a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">Tutup detail</button></footer>
      </section>
    </div>
  );
}
