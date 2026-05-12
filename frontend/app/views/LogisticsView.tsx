"use client";
import { useEffect } from "react";
import { useLogistics } from "../hooks/useLogistics";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassButton } from "../components/ui/GlassButton";
import { GlassCard } from "../components/ui/GlassCard";
import { Badge } from "../components/ui/Badge";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import type { AgentAnalysisResult, RiskSummary } from "../lib/types";

const IconRefresh = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>;
const IconTruck   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IconZap     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;

const SHIPPING_LABELS: Record<string, string> = {
  air: "Hava Yolu",
  sea: "Deniz Yolu",
  rail: "Tren/Kara",
  express_courier: "Ekspres Kurye",
};

function PlanCard({ product, plan, loading, onLoad }: { product: RiskSummary; plan?: AgentAnalysisResult; loading: boolean; onLoad: () => void }) {
  const lp = plan?.logistics_plan;
  const urgencyColor = plan
    ? plan.risk_analysis.risk_score >= 75 ? "#ef4444"
    : plan.risk_analysis.risk_score >= 50 ? "#f59e0b"
    : "#34d399"
    : "#6366f1";

  return (
    <GlassCard padding={20}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{product.product_name}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{product.category} · {product.product_id}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Badge level={product.risk_level} />
          {!lp && !loading && (
            <GlassButton variant="primary" onClick={onLoad}>
              <IconZap /> Plan Yükle
            </GlassButton>
          )}
        </div>
      </div>

      {loading && <LoadingSpinner size={28} label="LogisticsPlannerAgent çalışıyor..." />}

      {lp && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
          {[
            { label: "Sipariş Miktarı", value: `${lp.recommended_order_qty} adet` },
            { label: "Sevkiyat Yöntemi", value: SHIPPING_LABELS[lp.shipping_method] ?? lp.shipping_method },
            { label: "Sipariş Tarihi", value: lp.recommended_order_date },
            { label: "Tahmini Varış", value: lp.estimated_arrival_date },
            { label: "Tahmini Maliyet", value: `$${lp.estimated_cost.toLocaleString()}` },
            { label: "Risk Skoru", value: `${plan!.risk_analysis.risk_score} / 100` },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: "#64748b", fontFamily: "Fira Code", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: urgencyColor, fontFamily: "Fira Code" }}>{value}</div>
            </div>
          ))}
          <div style={{ gridColumn: "1/-1", background: "#f8fafc", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, color: "#64748b", fontFamily: "Fira Code", marginBottom: 4 }}>NOTLAR</div>
            <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>{lp.notes}</div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

export function LogisticsView() {
  const { products, loading, plans, loadingId, loadPlan, loadAllPlans, refresh } = useLogistics();

  useEffect(() => {
    if (products.length > 0) loadAllPlans();
  }, [products.length]); // eslint-disable-line

  const totalOrderCost = Object.values(plans).reduce((s, p) => s + (p.logistics_plan?.estimated_cost ?? 0), 0);
  const urgentCount = Object.values(plans).filter((p) => p.risk_analysis.risk_score >= 50).length;

  return (
    <div>
      <PageHeader
        title="Lojistik Planlama"
        subtitle="LogisticsPlannerAgent — EOQ tabanlı sipariş optimizasyonu"
        action={<GlassButton onClick={refresh} variant="primary"><IconRefresh /> Yenile</GlassButton>}
      />

      {/* Özet */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "TOPLAM TAHMİNİ MALİYET", value: `$${totalOrderCost.toLocaleString()}`, color: "#6366f1" },
          { label: "ACİL SİPARİŞ GEREKTİREN", value: urgentCount, color: "#f59e0b" },
          { label: "PLANLANAN ÜRÜN", value: Object.keys(plans).length, color: "#34d399" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: `${color}10`, border: `1.5px solid ${color}30`, borderRadius: 14, padding: "18px 22px" }}>
            <div style={{ fontSize: 10, color: "#64748b", fontFamily: "Fira Code", marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "Fira Code", color }}>{value}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner label="Ürünler yükleniyor..." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(380px,1fr))", gap: 16 }}>
          {products.map((p) => (
            <PlanCard
              key={p.product_id}
              product={p}
              plan={plans[p.product_id]}
              loading={loadingId === p.product_id}
              onLoad={() => loadPlan(p.product_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
