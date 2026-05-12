interface GlassCardProps {
  children: React.ReactNode;
  padding?: number;
  glow?: string;
  onClick?: () => void;
  selected?: boolean;
}

export function GlassCard({ children, padding = 20, glow, onClick, selected }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#ffffff",
        border: selected
          ? `1.5px solid ${glow ?? "#6366f1"}`
          : "1px solid #e2e8f0",
        borderRadius: 16,
        padding,
        boxShadow: selected
          ? `0 4px 16px rgba(99,102,241,0.12), 0 0 0 3px rgba(99,102,241,0.08)`
          : "0 1px 4px rgba(0,0,0,0.06)",
        cursor: onClick ? "pointer" : undefined,
        transition: "all 0.18s ease",
      }}
      onMouseEnter={onClick ? (e) => {
        if (!selected) (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      } : undefined}
      onMouseLeave={onClick ? (e) => {
        if (!selected) (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
      } : undefined}
    >
      {children}
    </div>
  );
}
