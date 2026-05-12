"use client";
import { useEffect, useCallback } from "react";
import { useAsync } from "./useAsync";
import { dashboardApi } from "../lib/api";
import type { DashboardSummary } from "../lib/types";

export function useDashboard() {
  const { data, loading, error, execute } = useAsync<DashboardSummary>();

  const load = useCallback(() => execute(dashboardApi.getSummary()), [execute]);

  useEffect(() => { load(); }, [load]);

  return { summary: data, loading, error, refresh: load };
}
