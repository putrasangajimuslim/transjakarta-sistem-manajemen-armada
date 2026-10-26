import type { Vehicle } from "../types/mbta";
import VehicleCard from "./VehicleCard";

interface VehicleGridProps {
  vehicles: Vehicle[];
  routeNames: Map<string, string>;
  tripNames: Map<string, string>;
  onViewDetails: (vehicle: Vehicle) => void;
  limit?: number; // Menambahkan opsi limit untuk memotong jumlah array
}

export default function VehicleGrid({ 
  vehicles, 
  routeNames, 
  tripNames, 
  onViewDetails,
  limit 
}: VehicleGridProps) {
  
  // Memotong data yang ditampilkan agar tidak melebihi nilai limit (contoh: 5)
  const displayedVehicles = limit ? vehicles.slice(0, limit) : vehicles;

  if (displayedVehicles.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">—</div>
        <h3 className="mt-4 font-semibold text-slate-800">Tidak ada kendaraan ditemukan</h3>
        <p className="mt-1 text-sm text-slate-500">Ubah filter Route atau Trip, lalu coba lagi.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {displayedVehicles.map((vehicle) => {
        const routeId = vehicle.relationships?.route?.data?.id;
        const tripId = vehicle.relationships?.trip?.data?.id;
        return (
          <VehicleCard 
            key={vehicle.id} 
            vehicle={vehicle} 
            routeName={routeId ? routeNames.get(routeId) : undefined} 
            tripName={tripId ? tripNames.get(tripId) : undefined} 
            onViewDetails={onViewDetails} 
          />
        );
      })}
    </div>
  );
}