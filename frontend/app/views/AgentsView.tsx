"use client";
import { useEffect } from "react";
import { useAgents, AgentRun } from "../hooks/useAgents";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassButton } from "../components/ui/GlassButton";
import { GlassCard } from "../components/ui/GlassCard";
import { Badge } from "../components/ui/Badge";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconPlay    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const IconClear   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>;
const IconBot     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>;

// ─── Agent Pipeline Definition (OCP — yeni agent = yeni obje) ─────────────────
const AGENT_PIPELINE = [
  { name: "InventoryAnalystAgent", desc: "Stok seviyesi ve risk skoru hesaplama", color: "#6366f1" },
  { name: "DemandForecastAgent",   desc: "30 günlük talep tahmini ve trend analizi", color: "#8b5cf6" },
  { name: "SupplyShieldAgent",     desc: "Jeopolitik ve tedarik riski değerlendirmesi", color: "#f59e0b" },
  { name: "MeshFinderAgent",       desc: "Alternatif tedarikçi ağı tarama", color: "#06b6d4" },
  { name: "SupplierScoutAgent",    desc: "Yeni tedarikçi adayları keşfi", color: "#10b981" },
  { name: "LogisticsPlannerAgent", desc: "EOQ tabanlı sipariş ve sevkiyat planı", color: "#f97316" },
  { name: "ActionComposerAgent",   desc: "Öncelikli aksiyon planı oluşturma", color: "#ec4899" },
] as const;

function AgentPipelineCard() {
  return (
    <GlassCard padding={20}>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>
        Orchestrator Pipeline — 7 Ajan
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {AGENT_PIPELINE.map((agent, i) => (
          <div key={agent.name} style={{ display: "flex", gap: 12, position: "relative" }}>
            {/* Connector line */}
            {i < AGENT_PIPELINE.length - 1 && (
              <div style={{ position: "absolute", left: 15, top: 32, width: 2, height: 20, background: `${agent.color}40` }} />
            )}
            <div style={{ width: 30, height: 30, borderRadius: 8, background: `${agent.color}20`, border: `1px solid ${agent.color}40`, display: "flex", alignItems: "center", justifyContent: "center", color: agent.color, flexShrink: 0, marginTop: 4 }}>
              <span style={{ fontSize: 11, fontFamily: "Fira Code", fontWeight: 700 }}>{i + 1}</span>
            </div>
            <div style={{ paddingBottom: i < AGENT_PIPELINE.length - 1 ? 14 : 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: agent.color, fontFamily: "Fira Code", fontWeight: 600 }}>{agent.name}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{agent.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function RunCard({ run }: { run: AgentRun }) {
  const statusColor = run.status === "done" ? "#34d399" : run.status === "error" ? "#f87171" : run.status === "running" ? "#6366f1" : "#64748b";
  const statusLabel = run.status === "done" ? "TAMAMLANDI" : run.status === "error" ? "HATA" : run.status === "running" ? "ÇALIŞIYOR" : "BEKLEMEDE";
  const duration = run.completedAt && run.startedAt
    ? `${((new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime()) / 1000).toFixed(1)}s`
    : null;

  return (
    <div style={{
      background: "#f8fafc", border: `1px solid ${statusColor}25`,
      borderRadius: 12, padding: "16px 18px",
      borderLeft: `3px solid ${statusColor}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{run.productName}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2, fontFamily: "Fira Code" }}>
            {run.productId} · {new Date(run.startedAt).toLocaleTimeString("tr-TR")}
            {duration && ` · ${duration}`}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {run.status === "running" && (
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", animation: "pulse 1.5s ease-in-out infinite" }} />
          )}
          <span style={{ fontSize: 10, color: statusColor, fontFamily: "Fira Code", background: `${statusColor}15`, padding: "2px 8px", borderRadius: 5 }}>
            {statusLabel}
          </span>
        </div>
      </div>

      {run.status === "running" && (
        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: "60%", background: "linear-gradient(90deg, transparent, #6366f1, transparent)", animation: "shimmer 1.5s ease-in-out infinite" }} />
        </div>
      )}

      {run.result && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 12 }}>
          <MetricCell label="RİSK SKORU" value={`${run.result.risk_analysis.risk_score}`} color={run.result.risk_analysis.risk_score >= 50 ? "#f59e0b" : "#34d399"} />
          <MetricCell label="AKSİYON" value={`${run.result.action_plan.length} adım`} color="#6366f1" />
          <MetricCell label="ALT. TEDARİKÇİ" value={`${run.result.supplier_alternatives.length} opsiyon`} color="#06b6d4" />
        </div>
      )}

      {run.result && (
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {run.result.agents_used.map((a) => (
              <span key={a} style={{ fontSize: 9, fontFamily: "Fira Code", color: "#6366f1", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", padding: "1px 6px", borderRadius: 3 }}>
                {a.replace("Agent", "")}
              </span>
            ))}
          </div>
        </div>
      )}

      {run.error && (
        <div style={{ marginTop: 8, fontSize: 11, color: "#f87171", background: "rgba(239,68,68,0.08)", padding: "6px 10px", borderRadius: 6 }}>
          {run.error}
        </div>
      )}
    </div>
  );
}

function MetricCell({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: "#f8fafc", borderRadius: 7, padding: "8px 10px" }}>
      <div style={{ fontSize: 9, color: "#64748b", fontFamily: "Fira Code", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "Fira Code", color }}>{value}</div>
    </div>
  );
}

export function AgentsView() {
  const { products, productsLoading, loadProducts, runs, pipelineRunning, runSingleAgent, runFullPipeline, clearRuns } = useAgents();

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const doneCount = runs.filter((r) => r.status === "done").length;
  const runningRun = runs.find((r) => r.status === "running");

  return (
    <div>
      <PageHeader
        title="AI Agents"
        subtitle="OrchestratorAgent — 7 uzman ajan pipeline yönetimi"
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <GlassButton variant="ghost" onClick={clearRuns} disabled={runs.length === 0}><IconClear /> Temizle</GlassButton>
            <GlassButton variant="primary" onClick={() => runFullPipeline(products)} disabled={pipelineRunning || productsLoading}>
              <IconPlay /> {pipelineRunning ? "Pipeline Çalışıyor..." : "Tüm Ürünleri Analiz Et"}
            </GlassButton>
          </div>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }}>
        {/* Sol — Pipeline Görseli */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <AgentPipelineCard />

          {/* Ürün Listesi */}
          <GlassCard padding={20}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 14 }}>Ürünler</div>
            {productsLoading ? <LoadingSpinner size={24} label="Yükleniyor..." /> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {products.map((p) => {
                  const run = runs.find((r) => r.productId === p.product_id);
                  return (
                    <div key={p.product_id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "#f8fafc", borderRadius: 8 }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>{p.product_name}</div>
                        <Badge level={p.risk_level} />
                      </div>
                      <GlassButton
                        variant={run?.status === "done" ? "success" : "primary"}
                        disabled={run?.status === "running" || pipelineRunning}
                        onClick={() => runSingleAgent(p)}
                      >
                        {run?.status === "running" ? "..." : run?.status === "done" ? "✓" : <IconPlay />}
                      </GlassButton>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Sağ — Run Logları */}
        <div>
          {/* Özet Bar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
            {[
              { label: "TAMAMLANAN", value: doneCount, color: "#34d399" },
              { label: "ÇALIŞIYOR",  value: pipelineRunning ? 1 : 0, color: "#6366f1" },
              { label: "TOPLAM ÇALIŞMA", value: runs.length, color: "#64748b" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: `${color}10`, border: `1px solid ${color}25`, borderRadius: 12, padding: "14px 18px" }}>
                <div style={{ fontSize: 10, color: "#64748b", fontFamily: "Fira Code", marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "Fira Code", color }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Aktif Çalışma Banner */}
          {runningRun && (
            <div style={{ marginBottom: 14, padding: "12px 16px", background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", animation: "pulse 1.5s ease-in-out infinite" }} />
              <span style={{ fontSize: 12, color: "#4338ca", fontFamily: "Fira Code" }}>
                {runningRun.productName} analiz ediliyor — 7 ajan pipeline aktif
              </span>
            </div>
          )}

          {runs.length === 0 ? (
            <GlassCard padding={40}>
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a5b4fc" }}>
                  <IconBot />
                </div>
                <div style={{ color: "#0f172a", fontSize: 15, fontWeight: 600 }}>Agent çalıştırılmadı</div>
                <div style={{ color: "#64748b", fontSize: 12, maxWidth: 280, lineHeight: 1.7 }}>
                  Sol taraftaki ürünlerden birini seçin veya "Tüm Ürünleri Analiz Et" ile tam pipeline çalıştırın.
                </div>
              </div>
            </GlassCard>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {runs.map((run) => <RunCard key={run.productId} run={run} />)}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
      `}</style>
    </div>
  );
}
