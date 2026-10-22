import { useCallback, useEffect, useState } from "react";
import { fetchVehicles, getApiErrorMessage, type VehicleQuery } from "../services/mbtaApi";
import type { Vehicle } from "../types/mbta";

interface State {
  vehicles: Vehicle[];
  total: number | null;
  hasNext: boolean;
  loading: boolean;
  error: string | null;
}

export function useVehicles(query: VehicleQuery) {
  const [state, setState] = useState<State>({
    vehicles: [],
    total: null,
    hasNext: false,
    loading: true,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);

  const retry = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setState((previous) => ({ ...previous, loading: true, error: null }));

    fetchVehicles(query, controller.signal)
      .then((result) => {
        setState({
          vehicles: result.data,
          total: result.total,
          hasNext: result.hasNext,
          loading: false,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState((previous) => ({
          ...previous,
          loading: false,
          error: getApiErrorMessage(error),
        }));
      });

    return () => controller.abort();
  }, [query.page, query.limit, query.routes.join(","), query.trips.join(","), reloadKey]);

  return { ...state, retry };
}
