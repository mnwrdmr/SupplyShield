"use client";
import { useInventory } from "../hooks/useInventory";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassButton } from "../components/ui/GlassButton";
import { GlassCard } from "../components/ui/GlassCard";
import { Badge } from "../components/ui/Badge";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import type { InventoryItem } from "../lib/types";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconRefresh = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>;
const IconBox     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>;

function StockProgressBar({ current, reorder }: { current: number; reorder: number }) {
  const pct = Math.min((current / reorder) * 100, 200);
  const color = pct < 50 ? "#ef4444" : pct < 100 ? "#f59e0b" : "#34d399";
  return (
    <div style={{ width: "100%", height: 6, background: "#e2e8f0", borderRadius: 3 }}>
      <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", borderRadius: 3, background: color, boxShadow: `0 0 6px ${color}66`, transition: "width 0.5s ease" }} />
    </div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ background: `${color}10`, border: `1.5px solid ${color}40`, borderRadius: 12, padding: "16px 20px" }}>
      <div style={{ fontSize: 11, color: "#64748b", fontFamily: "Fira Code", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "Fira Code", color }}>{value}</div>
    </div>
  );
}

export function InventoryView() {
  const { items, loading, refresh, criticalCount, warningCount } = useInventory();

  const okCount = items.filter((i) => i.status === "ok").length;
  const totalDaysAvg = items.length > 0
    ? (items.reduce((s, i) => s + i.days_of_supply, 0) / items.length).toFixed(1)
    : "0";

  return (
    <div>
      <PageHeader
        title="Envanter Yönetimi"
        subtitle="Anlık stok durumu — InventoryAnalystAgent tarafından izleniyor"
        action={<GlassButton onClick={refresh} variant="primary"><IconRefresh /> Yenile</GlassButton>}
      />

      {/* Özet Kartlar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        <SummaryCard label="KRİTİK STOK"   value={criticalCount}   color="#ef4444" />
        <SummaryCard label="UYARI"          value={warningCount}    color="#f59e0b" />
        <SummaryCard label="NORMAL"         value={okCount}         color="#34d399" />
        <SummaryCard label="ORT. GÜN STOĞU" value={Number(totalDaysAvg)} color="#6366f1" />
      </div>

      <GlassCard padding={0}>
        {/* Table Header */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 100px", gap: 16, padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {["ÜRÜN", "SKU", "STOK / YENİDEN SİP.", "GÜN STOĞU", "DURUM", ""].map((h) => (
            <div key={h} style={{ fontSize: 10, color: "#64748b", fontFamily: "Fira Code", letterSpacing: "0.08em" }}>{h}</div>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner label="Stok verileri yükleniyor..." />
        ) : (
          <div>
            {items.map((item, idx) => (
              <InventoryRow key={item.product_id} item={item} isLast={idx === items.length - 1} />
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

function InventoryRow({ item, isLast }: { item: InventoryItem; isLast: boolean }) {
  const daysColor = item.days_of_supply < 7 ? "#f87171" : item.days_of_supply < 14 ? "#fbbf24" : "#34d399";

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 100px", gap: 16,
      padding: "14px 20px",
      borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
      transition: "background 0.15s ease",
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{item.product_name}</div>
        <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Güncelleme: {new Date(item.last_updated).toLocaleTimeString("tr-TR")}</div>
      </div>
      <div style={{ fontSize: 12, fontFamily: "Fira Code", color: "#64748b", alignSelf: "center" }}>{item.sku}</div>
      <div style={{ alignSelf: "center" }}>
        <div style={{ fontSize: 13, fontFamily: "Fira Code", color: "#0f172a", marginBottom: 6 }}>
          <span style={{ color: item.current_stock < item.reorder_point ? "#f87171" : "#34d399" }}>{item.current_stock}</span>
          <span style={{ color: "#64748b" }}> / {item.reorder_point}</span>
        </div>
        <StockProgressBar current={item.current_stock} reorder={item.reorder_point} />
      </div>
      <div style={{ alignSelf: "center" }}>
        <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "Fira Code", color: daysColor }}>{item.days_of_supply}</span>
        <span style={{ fontSize: 11, color: "#64748b", marginLeft: 4 }}>gün</span>
      </div>
      <div style={{ alignSelf: "center" }}>
        <Badge level={item.status} />
      </div>
      <div style={{ alignSelf: "center" }}>
        {(item.status === "critical" || item.status === "stockout") && (
          <span style={{ fontSize: 10, color: "#f87171", fontFamily: "Fira Code", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", padding: "3px 8px", borderRadius: 6 }}>
            ACİL SİPARİŞ
          </span>
        )}
        {item.status === "warning" && (
          <span style={{ fontSize: 10, color: "#fbbf24", fontFamily: "Fira Code", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", padding: "3px 8px", borderRadius: 6 }}>
            SİPARİŞ VER
          </span>
        )}
      </div>
    </div>
  );
}
