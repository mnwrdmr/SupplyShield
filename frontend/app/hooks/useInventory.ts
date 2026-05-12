"use client";
import { useEffect, useCallback } from "react";
import { useAsync } from "./useAsync";
import { inventoryApi } from "../lib/api";
import type { InventoryItem } from "../lib/types";

export function useInventory() {
  const { data, loading, error, execute } = useAsync<InventoryItem[]>();

  const load = useCallback(() => execute(inventoryApi.getAll()), [execute]);

  useEffect(() => { load(); }, [load]);

  const criticalCount = data?.filter((i) => i.status === "critical" || i.status === "stockout").length ?? 0;
  const warningCount = data?.filter((i) => i.status === "warning").length ?? 0;

  return {
    items: data ?? [],
    loading,
    error,
    refresh: load,
    criticalCount,
    warningCount,
  };
}
