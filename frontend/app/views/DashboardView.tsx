"use client";
import { useDashboard } from "../hooks/useDashboard";
import { useRiskAnalysis } from "../hooks/useRiskAnalysis";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassButton } from "../components/ui/GlassButton";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { GlassCard } from "../components/ui/GlassCard";
import { Badge } from "../components/ui/Badge";
import { StatCard } from "../components/StatCard";
import { ForecastChart } from "../components/ForecastChart";
import { AgentPanel } from "../components/AgentPanel";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconPackage    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>;
const IconShield     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IconZap        = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IconTrend      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const IconDollar     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
const IconRefresh    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>;

function RiskScoreBar({ score }: { score: number }) {
  const color = score >= 75 ? "#ef4444" : score >= 50 ? "#f59e0b" : score >= 25 ? "#eab308" : "#34d399";
  return (
    <div style={{ width: "100%", height: 4, background: "#e2e8f0", borderRadius: 2, marginTop: 8 }}>
      <div style={{ width: `${score}%`, height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 8px ${color}66`, transition: "width 0.6s ease" }} />
    </div>
  );
}

export function DashboardView() {
  const { summary, loading: summaryLoading, refresh: refreshSummary } = useDashboard();
  const { risks, loading: risksLoading, selectedId, analysisResult, analysisLoading, analyzeProduct } = useRiskAnalysis();

  const handleRefresh = () => { refreshSummary(); };

  return (
    <div>
      <PageHeader
        title="Supply Chain Intelligence"
        subtitle={new Date().toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        action={
          <GlassButton onClick={handleRefresh} variant="primary">
            <IconRefresh /> Yenile
          </GlassButton>
        }
      />

      {/* Stats Row */}
      {summaryLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 16, marginBottom: 28 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: 100, borderRadius: 16, background: "#f8fafc" }} />
          ))}
        </div>
      ) : summary && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
          <StatCard label="Toplam Ürün"       value={summary.total_products}                                         sub="takip edilen"  color="indigo"  icon={<IconPackage />} />
          <StatCard label="Riskli Ürün"       value={summary.at_risk_products}                                       sub="dikkat gerekli" color="amber"   icon={<IconShield />} />
          <StatCard label="Kritik"            value={summary.critical_products}                                      sub="acil aksiyon"   color="red"     icon={<IconZap />} />
          <StatCard label="Ort. Risk Skoru"   value={summary.avg_risk_score}                                         sub="/ 100"          color="blue"    icon={<IconTrend />} />
          <StatCard label="Stok Değeri"       value={`$${(summary.total_inventory_value / 1000).toFixed(0)}K`}       sub="toplam"         color="emerald" icon={<IconDollar />} />
          <StatCard label="Tahmin Doğruluğu" value={`${summary.forecast_accuracy}%`}                                 sub="AI güven"       color="indigo"  icon={<IconTrend />} />
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24, alignItems: "start" }}>
        {/* Risk Cards */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Ürün Risk Kartları</span>
            <span style={{ fontSize: 11, fontFamily: "Fira Code", color: "#94a3b8" }}>{risks.length} ürün</span>
          </div>
          {risksLoading ? <LoadingSpinner label="Riskler yükleniyor..." /> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "calc(100vh - 280px)", overflowY: "auto", paddingRight: 4 }}>
              {risks.map((r) => (
                <GlassCard key={r.product_id} onClick={() => analyzeProduct(r.product_id)} selected={r.product_id === selectedId} padding={16}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.product_name}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{r.category} · {r.product_id}</div>
                    </div>
                    <Badge level={r.risk_level} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>Risk Skoru</span>
                    <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "Fira Code", color: r.risk_score >= 75 ? "#f87171" : r.risk_score >= 50 ? "#fbbf24" : "#34d399" }}>{r.risk_score}</span>
                  </div>
                  <RiskScoreBar score={r.risk_score} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid #e2e8f0", fontSize: 11 }}>
                    <div>
                      <div style={{ color: "#94a3b8", fontFamily: "Fira Code" }}>STOK</div>
                      <div style={{ fontWeight: 600, fontFamily: "Fira Code", color: r.current_stock < r.reorder_point ? "#f87171" : "#e2e8f0" }}>{r.current_stock} / {r.reorder_point}</div>
                    </div>
                    <div style={{ textAlign: "right", maxWidth: 120 }}>
                      <div style={{ color: "#94a3b8", fontFamily: "Fira Code" }}>TEDARİKÇİ</div>
                      <div style={{ color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.supplier_name}</div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

        {/* Analysis Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {!selectedId ? (
            <EmptyAnalysis />
          ) : (
            <>
              {analysisResult && !analysisLoading && (
                <ForecastChart points={analysisResult.demand_forecast.points} trend={analysisResult.demand_forecast.trend} productName={analysisResult.product_name} />
              )}
              <AgentPanel result={analysisResult} loading={analysisLoading} onReAnalyze={() => analyzeProduct(selectedId)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyAnalysis() {
  return (
    <GlassCard padding={60}>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a5b4fc" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div style={{ color: "#0f172a", fontSize: 15, fontWeight: 600 }}>Analiz için ürün seçin</div>
        <div style={{ color: "#94a3b8", fontSize: 12, maxWidth: 300, lineHeight: 1.7 }}>
          Sol taraftan bir ürüne tıklayarak 7 ajanın tamamı çalıştırılır: risk skoru, talep tahmini, tedarikçi alternatifleri ve aksiyon planı.
        </div>
      </div>
    </GlassCard>
  );
}
