"use client";
import { useState, useCallback } from "react";
import type { AsyncState } from "../lib/types";

export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (promise: Promise<T>) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await promise;
      setState({ data, loading: false, error: null });
      return data;
    } catch (err) {
      const error = err instanceof Error ? err.message : "Unknown error";
      setState({ data: null, loading: false, error });
      return null;
    }
  }, []);

  return { ...state, execute };
}
