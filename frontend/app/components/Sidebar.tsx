"use client";
import { useRouter } from "next/navigation";
import { authStorage } from "../lib/auth";
import type { NavPage } from "../lib/types";

// ─── İkonlar ──────────────────────────────────────────────────────────────────
const IconShield = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconGrid   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
const IconAlert  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IconBox    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>;
const IconTruck  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IconBot    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>;
const IconLogout = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

// ─── Navigasyon Yapılandırması ─────────────────────────────────────────────────
const NAV_ITEMS: { id: NavPage; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: "dashboard",  label: "Ana Panel",          icon: <IconGrid />,  },
  { id: "risks",      label: "Risk Analizi",        icon: <IconAlert />, badge: "YZ" },
  { id: "inventory",  label: "Stok Sağlığı",        icon: <IconBox />   },
  { id: "logistics",  label: "Tedarik Planı",       icon: <IconTruck />, badge: "YZ" },
  { id: "agents",     label: "Yapay Zeka Ajanları", icon: <IconBot />,   badge: "7"  },
];

interface SidebarProps {
  active: NavPage;
  onNavigate: (page: NavPage) => void;
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const router = useRouter();
  const user = authStorage.getUser();

  function handleLogout() {
    authStorage.clear();
    router.push("/login");
  }

  return (
    <aside style={{
      width: 260, minHeight: "100vh",
      background: "#ffffff",
      borderRight: "1px solid #e2e8f0",
      display: "flex", flexDirection: "column",
      padding: "24px 16px",
      position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 50,
      boxShadow: "2px 0 8px rgba(0,0,0,0.06)",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, paddingLeft: 8 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 14px rgba(99,102,241,0.35)", color: "white",
        }}>
          <IconShield />
        </div>
        <div>
          <div style={{ fontFamily: "Fira Code", fontWeight: 700, fontSize: 16, color: "#0f172a" }}>SupplyShield</div>
          <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "Inter" }}>Tedarik Risk Platformu</div>
        </div>
      </div>

      {/* Navigasyon */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {NAV_ITEMS.map(({ id, label, icon, badge }) => {
          const isActive = active === id;
          return (
            <button key={id} onClick={() => onNavigate(id)} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "13px 14px", borderRadius: 12, width: "100%", textAlign: "left",
              background: isActive ? "rgba(99,102,241,0.08)" : "transparent",
              border: isActive ? "1px solid rgba(99,102,241,0.2)" : "1px solid transparent",
              color: isActive ? "#6366f1" : "#64748b",
              cursor: "pointer", transition: "all 0.15s ease",
              fontSize: 14, fontFamily: "Inter", fontWeight: isActive ? 600 : 400,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ opacity: isActive ? 1 : 0.65 }}>{icon}</span>
                {label}
              </div>
              {badge && (
                <span style={{
                  fontSize: 10, fontFamily: "Fira Code",
                  background: isActive ? "rgba(99,102,241,0.15)" : "#f1f5f9",
                  color: isActive ? "#6366f1" : "#94a3b8",
                  padding: "2px 7px", borderRadius: 6, fontWeight: 600,
                }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sistem Durumu */}
      <div style={{
        padding: "14px 16px", borderRadius: 12,
        background: "#f0fdf4", border: "1px solid #bbf7d0",
        marginBottom: 12,
      }}>
        <div style={{ fontSize: 10, color: "#16a34a", fontFamily: "Fira Code", marginBottom: 6, fontWeight: 600 }}>SİSTEM DURUMU</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
          <span style={{ fontSize: 12, color: "#166534", fontWeight: 500 }}>Tüm servisler aktif</span>
        </div>
        <div style={{ marginTop: 6, fontSize: 10, color: "#86efac", fontFamily: "Fira Code" }}>
          v1.0 · 7 ajan · FastAPI
        </div>
      </div>

      {/* Kullanıcı + Çıkış */}
      <div style={{
        padding: "14px 16px", borderRadius: 12,
        background: "#f8fafc", border: "1px solid #e2e8f0",
      }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: "#0f172a", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user?.company_name || "—"}
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "Fira Code", marginTop: 2 }}>
            @{user?.username || "—"}
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: "100%", padding: "10px 14px",
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: 10, color: "#dc2626", cursor: "pointer",
            fontSize: 13, fontFamily: "Inter", fontWeight: 500,
            transition: "all 0.15s", display: "flex", alignItems: "center",
            justifyContent: "center", gap: 8,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#fee2e2"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fef2f2"; }}
        >
          <IconLogout /> Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
