import axios from "axios";
import type {
  JsonApiResponse,
  PageResult,
  Route,
  Trip,
  Vehicle,
} from "../types/mbta";

const api = axios.create({
  baseURL: import.meta.env.VITE_MBTA_API_BASE_URL || "https://api-v3.mbta.com",
  headers: { Accept: "application/vnd.api+json" },
  timeout: 15000,
});

function toPageResult<T>(response: JsonApiResponse<T[]>): PageResult<T> {
  const total = response.meta?.pagination?.total;
  return {
    data: response.data,
    total: typeof total === "number" ? total : null,
    hasNext: Boolean(response.links?.next),
  };
}

export interface VehicleQuery {
  page: number;
  limit: number;
  routes: string[];
  trips: string[];
}

export async function fetchVehicles(
  query: VehicleQuery,
  signal?: AbortSignal,
): Promise<PageResult<Vehicle>> {
  const params: Record<string, string | number> = {
    "page[limit]": query.limit,
    "page[offset]": (query.page - 1) * query.limit,
    include: "route,trip,stop",
    sort: "label",
  };
  if (query.routes.length) params["filter[route]"] = query.routes.join(",");
  if (query.trips.length) params["filter[trip]"] = query.trips.join(",");

  const response = await api.get<JsonApiResponse<Vehicle[]>>("/vehicles", {
    params,
    signal,
  });
  return toPageResult(response.data);
}

export async function fetchVehicleById(
  id: string,
  signal?: AbortSignal,
): Promise<Vehicle> {
  const response = await api.get<JsonApiResponse<Vehicle>>(
    `/vehicles/${encodeURIComponent(id)}`,
    { params: { include: "route,trip,stop" }, signal },
  );
  return response.data.data;
}

export interface OptionQuery {
  offset: number;
  limit: number;
  search?: string;
  routeIds?: string[];
}

export async function fetchRoutes(
  query: OptionQuery,
  signal?: AbortSignal,
): Promise<PageResult<Route>> {
  const params: Record<string, string | number> = {
    "page[limit]": query.limit,
    "page[offset]": query.offset,
    sort: "short_name",
  };
  if (query.search?.trim()) params["filter[search]"] = query.search.trim();

  const response = await api.get<JsonApiResponse<Route[]>>("/routes", {
    params,
    signal,
  });
  return toPageResult(response.data);
}

export async function fetchTrips(
  query: OptionQuery,
  signal?: AbortSignal,
): Promise<PageResult<Trip>> {
  const params: Record<string, string | number> = {
    "page[limit]": query.limit,
    "page[offset]": query.offset,
    sort: "name",
  };
  if (query.search?.trim()) params["filter[name]"] = query.search.trim();
  if (query.routeIds?.length) {
    params["filter[route]"] = query.routeIds.join(",");
  }

  const response = await api.get<JsonApiResponse<Trip[]>>("/trips", {
    params,
    signal,
  });
  return toPageResult(response.data);
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return "Permintaan terlalu lama. Periksa koneksi lalu coba lagi.";
    }
    if (error.response?.status === 429) {
      return "Terlalu banyak permintaan ke API. Tunggu sebentar lalu coba lagi.";
    }
    if (error.response?.status === 404) {
      return "Data yang diminta tidak ditemukan.";
    }
    if (error.response) {
      return `API mengembalikan kesalahan (${error.response.status}). Coba lagi beberapa saat.`;
    }
    return "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
  }
  return "Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.";
}
