import type { RiskLevel, InventoryStatus } from "../../lib/types";

interface BadgeProps {
  level: RiskLevel | InventoryStatus | string;
  children?: React.ReactNode;
}

const STYLES: Record<string, { bg: string; color: string; border: string }> = {
  critical: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  high:     { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  medium:   { bg: "#fefce8", color: "#ca8a04", border: "#fef08a" },
  low:      { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  ok:       { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  warning:  { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  stockout: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
};

const LABELS: Record<string, string> = {
  critical: "KRİTİK", high: "YÜKSEK", medium: "ORTA",
  low: "DÜŞÜK", ok: "NORMAL", warning: "UYARI", stockout: "STOK YOK",
};

export function Badge({ level, children }: BadgeProps) {
  const s = STYLES[level] ?? STYLES.low;
  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      padding: "3px 10px", borderRadius: 9999,
      fontSize: 11, fontFamily: "Fira Code", fontWeight: 700,
      whiteSpace: "nowrap",
    }}>
      {children ?? (LABELS[level] ?? level.toUpperCase())}
    </span>
  );
}
