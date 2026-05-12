interface LoadingSpinnerProps {
  size?: number;
  label?: string;
}

export function LoadingSpinner({ size = 32, label }: LoadingSpinnerProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "32px 0" }}>
      <div style={{
        width: size, height: size,
        border: "3px solid #e2e8f0",
        borderTop: "3px solid #6366f1",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      {label && <span style={{ fontSize: 13, color: "#94a3b8", fontFamily: "Inter" }}>{label}</span>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
