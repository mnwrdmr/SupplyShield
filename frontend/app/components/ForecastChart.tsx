"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { GlassCard } from "./ui/GlassCard";
import type { ForecastPoint, TrendDirection } from "../lib/types";

interface ForecastChartProps {
  points: ForecastPoint[];
  trend: TrendDirection;
  productName: string;
}

const TREND_CONFIG: Record<TrendDirection, { color: string; label: string }> = {
  increasing: { color: "#f59e0b", label: "↑ Artıyor" },
  decreasing: { color: "#ef4444", label: "↓ Azalıyor" },
  stable:     { color: "#34d399", label: "→ Stabil" },
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", fontSize: 12, fontFamily: "Fira Code" }}>
      <div style={{ color: "#64748b", marginBottom: 6 }}>{label}</div>
      <div style={{ color: "#60a5fa" }}>Tahmin: <strong>{payload[0]?.value?.toFixed(1)}</strong></div>
    </div>
  );
}

export function ForecastChart({ points, trend, productName }: ForecastChartProps) {
  const chartData = points.slice(0, 14).map((p) => ({
    date: p.date.slice(5),
    demand: p.predicted_demand,
    upper: p.upper_bound,
  }));

  const { color: trendColor, label: trendLabel } = TREND_CONFIG[trend];

  return (
    <GlassCard padding={20}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>14 Günlük Talep Tahmini</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{productName}</div>
        </div>
        <span style={{ fontSize: 12, fontFamily: "Fira Code", color: trendColor, background: `${trendColor}18`, border: `1px solid ${trendColor}33`, padding: "4px 10px", borderRadius: 6 }}>
          {trendLabel}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "Fira Code" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#64748b", fontSize: 10, fontFamily: "Fira Code" }} axisLine={false} tickLine={false} width={35} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="upper"  stroke="#34d39933" strokeWidth={1} fill="rgba(52,211,153,0.05)" />
          <Area type="monotone" dataKey="demand" stroke="#6366f1" strokeWidth={2} fill="url(#demandGrad)" dot={false} activeDot={{ r: 4, fill: "#6366f1" }} />
        </AreaChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}
