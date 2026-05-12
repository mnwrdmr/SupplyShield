"use client";
import { GlassCard } from "./ui/GlassCard";
import { GlassButton } from "./ui/GlassButton";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { Badge } from "./ui/Badge";
import type { AgentAnalysisResult, ActionType } from "../lib/types";

interface AgentPanelProps {
  result: AgentAnalysisResult | null;
  loading: boolean;
  onReAnalyze: () => void;
}

const ACTION_COLORS: Record<ActionType, { bg: string; border: string; dot: string }> = {
  order:           { bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.25)", dot: "#818cf8" },
  switch_supplier: { bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)", dot: "#fbbf24" },
  expedite:        { bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.25)", dot: "#60a5fa" },
  monitor:         { bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.25)", dot: "#34d399" },
};

function AgentBadge({ name }: { name: string }) {
  return (
    <span style={{ fontSize: 10, fontFamily: "Fira Code", padding: "2px 8px", borderRadius: 4, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", color: "#a5b4fc" }}>
      {name.replace("Agent", "")}
    </span>
  );
}

export function AgentPanel({ result, loading, onReAnalyze }: AgentPanelProps) {
  if (loading) {
    return (
      <GlassCard padding={40}>
        <LoadingSpinner label="7 ajan pipeline çalışıyor..." />
      </GlassCard>
    );
  }

  if (!result) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Orchestrator Summary */}
      <GlassCard padding={20}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Orchestrator Özeti</div>
          <GlassButton variant="ghost" onClick={onReAnalyze}>Yeniden Analiz Et</GlassButton>
        </div>
        <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, marginBottom: 12 }}>{result.orchestrator_summary}</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {result.agents_used.map((a) => <AgentBadge key={a} name={a} />)}
        </div>
      </GlassCard>

      {/* Action Plan */}
      <GlassCard padding={20}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 14 }}>
          Aksiyon Planı
          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 400, marginLeft: 8 }}>({result.action_plan.length} adım)</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {result.action_plan.map((action) => {
            const c = ACTION_COLORS[action.action_type] ?? ACTION_COLORS.monitor;
            return (
              <div key={action.priority} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, boxShadow: `0 0 6px ${c.dot}` }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>#{action.priority} {action.title}</span>
                </div>
                <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, margin: "0 0 8px" }}>{action.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b" }}>
                  <span style={{ color: "#34d399" }}>Etki: {action.estimated_impact}</span>
                  {action.deadline && <span>Son Tarih: {action.deadline}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Supplier Alternatives */}
      {result.supplier_alternatives.length > 0 && (
        <GlassCard padding={20}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 14 }}>Tedarikçi Alternatifleri</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {result.supplier_alternatives.slice(0, 3).map((s, i) => (
              <div key={i} style={{ background: "#f8fafc", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{s.supplier_name}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{s.country} · {s.lead_time_days} gün lead time</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{s.notes}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "Fira Code", color: "#34d399" }}>{Math.round(s.match_score * 100)}%</div>
                  <div style={{ fontSize: 10, color: "#64748b" }}>uyum</div>
                  <div style={{ fontSize: 11, color: s.estimated_cost_change_pct > 0 ? "#f59e0b" : "#34d399", marginTop: 4 }}>
                    {s.estimated_cost_change_pct > 0 ? "+" : ""}{s.estimated_cost_change_pct}% maliyet
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Logistics Plan */}
      <GlassCard padding={20}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 14 }}>Lojistik Planı</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "Sipariş Miktarı",  value: `${result.logistics_plan.recommended_order_qty} adet` },
            { label: "Sevkiyat",          value: result.logistics_plan.shipping_method.replace("_", " ") },
            { label: "Sipariş Tarihi",    value: result.logistics_plan.recommended_order_date },
            { label: "Tahmini Varış",     value: result.logistics_plan.estimated_arrival_date },
            { label: "Tahmini Maliyet",   value: `$${result.logistics_plan.estimated_cost.toLocaleString()}` },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: "#64748b", fontFamily: "Fira Code", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", fontFamily: "Fira Code" }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>{result.logistics_plan.notes}</div>
      </GlassCard>
    </div>
  );
}
