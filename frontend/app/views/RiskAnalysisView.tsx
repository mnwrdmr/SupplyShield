"use client";
import { useRiskAnalysis } from "../hooks/useRiskAnalysis";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassButton } from "../components/ui/GlassButton";
import { GlassCard } from "../components/ui/GlassCard";
import { Badge } from "../components/ui/Badge";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { AgentPanel } from "../components/AgentPanel";
import { ForecastChart } from "../components/ForecastChart";
import type { RiskFactor } from "../lib/types";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconRefresh  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>;
const IconActivity = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IconAlert    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;

const IMPACT_COLOR: Record<string, string> = { high: "#f87171", medium: "#fbbf24", low: "#34d399" };

function RiskFactorItem({ factor }: { factor: RiskFactor }) {
  const color = IMPACT_COLOR[factor.impact] ?? "#94a3b8";
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}`, marginTop: 5, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>{factor.factor}</span>
          <span style={{ fontSize: 10, color, fontFamily: "Fira Code", background: `${color}18`, padding: "1px 6px", borderRadius: 4 }}>{factor.impact.toUpperCase()}</span>
        </div>
        <p style={{ fontSize: 11, color: "#64748b", margin: 0, lineHeight: 1.6 }}>{factor.description}</p>
        {factor.value !== undefined && (
          <span style={{ fontSize: 10, color: "#64748b", fontFamily: "Fira Code" }}>Değer: {factor.value}</span>
        )}
      </div>
    </div>
  );
}

function RiskScoreGauge({ score }: { score: number }) {
  const color = score >= 75 ? "#ef4444" : score >= 50 ? "#f59e0b" : score >= 25 ? "#eab308" : "#34d399";
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx="50" cy="50" r="36" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 0.8s ease", filter: `drop-shadow(0 0 6px ${color})` }}
        />
        <text x="50" y="54" textAnchor="middle" fill={color} fontSize="18" fontWeight="700" fontFamily="Fira Code">{score}</text>
      </svg>
    </div>
  );
}

export function RiskAnalysisView() {
  const { risks, loading, refresh, selectedId, analysisResult, analysisLoading, analyzeProduct } = useRiskAnalysis();

  return (
    <div>
      <PageHeader
        title="Risk Analizi"
        subtitle="Agent tabanlı tedarik zinciri risk değerlendirmesi"
        action={<GlassButton onClick={refresh} variant="primary"><IconRefresh /> Yenile</GlassButton>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        {/* Sol — Risk Tablosu */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <GlassCard padding={20}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>
              Tüm Ürün Riskleri
              <span style={{ fontSize: 11, color: "#64748b", fontWeight: 400, marginLeft: 8, fontFamily: "Fira Code" }}>
                InventoryAnalystAgent + SupplyShieldAgent
              </span>
            </div>
            {loading ? <LoadingSpinner label="Risk skorları hesaplanıyor..." /> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {risks.map((r) => (
                  <div
                    key={r.product_id}
                    onClick={() => analyzeProduct(r.product_id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                      background: selectedId === r.product_id ? "#eef2ff" : "#f8fafc",
                      border: selectedId === r.product_id ? "1.5px solid #6366f1" : "1px solid #e2e8f0",
                      borderRadius: 10, cursor: "pointer", transition: "all 0.15s ease",
                    }}
                  >
                    {/* Score bar */}
                    <div style={{ width: 48, textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "Fira Code", color: r.risk_score >= 75 ? "#f87171" : r.risk_score >= 50 ? "#fbbf24" : "#34d399" }}>{r.risk_score}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.product_name}</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{r.category} · {r.supplier_name}</div>
                    </div>
                    <Badge level={r.risk_level} />
                    <GlassButton variant="ghost" onClick={(e) => { (e as any).stopPropagation?.(); analyzeProduct(r.product_id); }}>
                      <IconActivity />
                    </GlassButton>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Sağ — Detay Analizi */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {analysisLoading && (
            <GlassCard padding={40}>
              <LoadingSpinner label="Ajan analizi çalışıyor..." />
            </GlassCard>
          )}

          {!analysisLoading && analysisResult && (
            <>
              {/* Risk Özeti */}
              <GlassCard padding={20}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>Risk Özeti — {analysisResult.product_name}</div>
                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <RiskScoreGauge score={analysisResult.risk_analysis.risk_score} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <Badge level={analysisResult.risk_analysis.risk_level} />
                      <span style={{ fontSize: 11, color: "#64748b", fontFamily: "Fira Code" }}>
                        Güven: {(analysisResult.risk_analysis.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
                      {analysisResult.risk_analysis.explanation}
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Risk Faktörleri */}
              <GlassCard padding={20}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <IconAlert /> Risk Faktörleri
                  <span style={{ fontSize: 11, color: "#64748b", fontWeight: 400, marginLeft: 4 }}>
                    ({analysisResult.risk_analysis.risk_factors.length} faktör)
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {analysisResult.risk_analysis.risk_factors.map((f, i) => (
                    <RiskFactorItem key={i} factor={f} />
                  ))}
                  {analysisResult.risk_analysis.risk_factors.length === 0 && (
                    <div style={{ color: "#34d399", fontSize: 13, textAlign: "center", padding: 20 }}>Risk faktörü tespit edilmedi</div>
                  )}
                </div>
              </GlassCard>

              {/* Forecast */}
              <ForecastChart points={analysisResult.demand_forecast.points} trend={analysisResult.demand_forecast.trend} productName={analysisResult.product_name} />
            </>
          )}

          {!analysisLoading && !analysisResult && (
            <GlassCard padding={40}>
              <div style={{ textAlign: "center", color: "#64748b", fontSize: 13, lineHeight: 1.7 }}>
                Sol taraftan bir ürün seçin.<br />
                <span style={{ color: "#6366f1", fontFamily: "Fira Code", fontSize: 11 }}>InventoryAnalystAgent + SupplyShieldAgent + DemandForecastAgent</span><br />
                otomatik devreye girer.
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
