import { useCallback, useEffect, useRef, useState } from "react";
import { fetchTrips, getApiErrorMessage } from "../services/mbtaApi";
import type { Trip } from "../types/mbta";

const PAGE_SIZE = 50;

export function useTrips(routeIds: string[]) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const offset = useRef(0);
  const requestLock = useRef(false);
  const routeKey = routeIds.join(",");

  const loadMore = useCallback(async (reset = false) => {
    if (requestLock.current || (!reset && !hasMore)) return;
    requestLock.current = true;
    reset ? setLoading(true) : setLoadingMore(true);
    setError(null);
    try {
      const nextOffset = reset ? 0 : offset.current;
      const result = await fetchTrips({
        offset: nextOffset,
        limit: PAGE_SIZE,
        routeIds: routeIds.length ? routeIds : undefined,
      });
      setTrips((previous) => reset ? result.data : [...previous, ...result.data]);
      offset.current = nextOffset + result.data.length;
      setHasMore(result.hasNext || (result.total !== null && offset.current < result.total));
      if (result.total === null && !result.hasNext) {
        setHasMore(result.data.length === PAGE_SIZE);
      }
    } catch (error: unknown) {
      setError(getApiErrorMessage(error));
    } finally {
      requestLock.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, [hasMore, routeKey]);

  useEffect(() => {
    setTrips([]);
    offset.current = 0;
    setHasMore(true);
    void loadMore(true);
  }, [routeKey]); // Refresh trips when selected routes change.

  return { trips, loading, loadingMore, error, hasMore, loadMore };
}
