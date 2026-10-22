import { useCallback, useEffect, useRef, useState } from "react";
import { fetchRoutes, getApiErrorMessage } from "../services/mbtaApi";
import type { Route } from "../types/mbta";

const PAGE_SIZE = 50;

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const offset = useRef(0);
  const requestLock = useRef(false);

  const loadMore = useCallback(async (reset = false) => {
    if (requestLock.current || (!reset && !hasMore)) return;
    requestLock.current = true;
    reset ? setLoading(true) : setLoadingMore(true);
    setError(null);
    try {
      const nextOffset = reset ? 0 : offset.current;
      const result = await fetchRoutes({ offset: nextOffset, limit: PAGE_SIZE });
      setRoutes((previous) => reset ? result.data : [...previous, ...result.data]);
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
  }, [hasMore]);

  useEffect(() => {
    void loadMore(true);
  }, []); // Initial route list only.

  return { routes, loading, loadingMore, error, hasMore, loadMore };
}
