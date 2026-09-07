import { useCallback, useEffect, useState } from "react";

/**
 * Small data-loading hook: runs `loader` on mount (and when `deps` change),
 * exposing loading / error / data plus a `reload` for retry buttons.
 */
export default function useFetch(loader, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    Promise.resolve()
      .then(loader)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Something went wrong.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, ...deps]);

  return { data, setData, loading, error, reload };
}
