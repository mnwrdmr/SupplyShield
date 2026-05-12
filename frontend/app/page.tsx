"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./components/Sidebar";
import { DashboardView }    from "./views/DashboardView";
import { RiskAnalysisView } from "./views/RiskAnalysisView";
import { InventoryView }    from "./views/InventoryView";
import { LogisticsView }    from "./views/LogisticsView";
import { AgentsView }       from "./views/AgentsView";
import type { NavPage } from "./lib/types";
import { authStorage } from "./lib/auth";

// ─── View Registry (OCP — yeni sayfa = yeni kayıt) ───────────────────────────
const VIEWS: Record<NavPage, React.ReactNode> = {
  dashboard: <DashboardView />,
  risks:     <RiskAnalysisView />,
  inventory: <InventoryView />,
  logistics: <LogisticsView />,
  agents:    <AgentsView />,
};

export default function App() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [activePage, setActivePage] = useState<NavPage>("dashboard");

  useEffect(() => {
    const user = authStorage.getUser();
    if (!user) { router.push("/login"); return; }
    if (user.role === "admin") { router.push("/admin"); return; }
    setReady(true);
  }, []);

  if (!ready) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f0f4f8", color: "#6366f1", fontFamily: "Inter", fontSize: 14 }}>
      Yükleniyor...
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f4f8" }}>
      <Sidebar active={activePage} onNavigate={setActivePage} />
      <main style={{ marginLeft: 260, flex: 1, padding: "36px 40px", minHeight: "100vh" }}>
        {VIEWS[activePage]}
      </main>
    </div>
  );
}
