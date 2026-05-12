interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      marginBottom: 32,
      paddingBottom: 24,
      borderBottom: "1px solid #e2e8f0",
    }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", fontFamily: "Inter", margin: 0, letterSpacing: "-0.3px" }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "6px 0 0", fontFamily: "Inter" }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
