interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  variant?: "primary" | "danger" | "success" | "ghost";
  disabled?: boolean;
  fullWidth?: boolean;
}

const VARIANTS = {
  primary: { bg: "#6366f1", border: "#4f46e5", color: "#ffffff", hover: "#4f46e5" },
  danger:  { bg: "#ef4444", border: "#dc2626", color: "#ffffff", hover: "#dc2626" },
  success: { bg: "#10b981", border: "#059669", color: "#ffffff", hover: "#059669" },
  ghost:   { bg: "#f8fafc", border: "#e2e8f0", color: "#64748b", hover: "#f1f5f9" },
};

export function GlassButton({ children, onClick, variant = "primary", disabled, fullWidth }: GlassButtonProps) {
  const v = VARIANTS[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "10px 20px", borderRadius: 10,
        background: disabled ? "#f1f5f9" : v.bg,
        border: `1.5px solid ${disabled ? "#e2e8f0" : v.border}`,
        color: disabled ? "#94a3b8" : v.color,
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 14, fontFamily: "Inter", fontWeight: 600,
        transition: "all 0.15s ease",
        width: fullWidth ? "100%" : undefined,
        justifyContent: fullWidth ? "center" : undefined,
        boxShadow: disabled ? "none" : variant === "primary" ? "0 2px 8px rgba(99,102,241,0.3)" : "0 1px 3px rgba(0,0,0,0.08)",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLElement).style.background = v.hover; }}
      onMouseLeave={e => { if (!disabled) (e.currentTarget as HTMLElement).style.background = v.bg; }}
    >
      {children}
    </button>
  );
}
