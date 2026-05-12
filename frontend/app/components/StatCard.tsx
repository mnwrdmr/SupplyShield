interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: "indigo" | "amber" | "red" | "emerald" | "blue";
  icon: React.ReactNode;
}

const COLOR_MAP = {
  indigo:  { bg: "#eef2ff", iconBg: "#6366f1", text: "#4338ca", sub: "#6366f1" },
  amber:   { bg: "#fffbeb", iconBg: "#f59e0b", text: "#b45309", sub: "#d97706" },
  red:     { bg: "#fef2f2", iconBg: "#ef4444", text: "#b91c1c", sub: "#dc2626" },
  emerald: { bg: "#f0fdf4", iconBg: "#10b981", text: "#065f46", sub: "#059669" },
  blue:    { bg: "#eff6ff", iconBg: "#3b82f6", text: "#1d4ed8", sub: "#2563eb" },
};

export function StatCard({ label, value, sub, color = "indigo", icon }: StatCardProps) {
  const c = COLOR_MAP[color];
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: 16,
      padding: "20px 24px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      transition: "box-shadow 0.15s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "Inter", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, fontWeight: 600 }}>{label}</div>
          <div style={{ fontSize: 30, fontWeight: 700, fontFamily: "Fira Code", color: c.text, lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8, fontWeight: 500 }}>{sub}</div>}
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: c.bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: c.iconBg,
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}
