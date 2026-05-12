"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authStorage, fetchUsersApi, deleteUserApi } from "../lib/auth";
import type { User } from "../lib/auth";

const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const IconRefresh = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
);
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);
const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

interface ApiUser {
  username: string;
  role: string;
  company_name: string;
  email: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingUser, setDeletingUser] = useState<string | null>(null);
  const [syncTime] = useState(() => new Date().toLocaleTimeString("tr-TR"));

  useEffect(() => {
    const user = authStorage.getUser();
    if (!user) { router.push("/login"); return; }
    if (user.role !== "admin") { router.push("/"); return; }
    setCurrentUser(user);
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const token = authStorage.getToken();
      if (!token) throw new Error("Token bulunamadı");
      const data = await fetchUsersApi(token);
      setUsers(data.users || data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Kullanıcılar yüklenemedi");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(username: string) {
    if (!confirm(`${username} kullanıcısını silmek istediğinize emin misiniz?`)) return;
    setDeletingUser(username);
    try {
      const token = authStorage.getToken();
      if (!token) throw new Error("Token bulunamadı");
      await deleteUserApi(username, token);
      setUsers(u => u.filter(x => x.username !== username));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Silme başarısız");
    } finally {
      setDeletingUser(null);
    }
  }

  function handleLogout() {
    authStorage.clear();
    router.push("/login");
  }

  const totalUsers = users.length;
  const smeCount = users.filter(u => u.role === "sme").length;
  const adminCount = users.filter(u => u.role === "admin").length;

  const stats = [
    { label: "Toplam Kullanıcı", value: totalUsers, color: "#6366f1", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.2)" },
    { label: "KOBİ Kullanıcı", value: smeCount, color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)" },
    { label: "Admin Kullanıcı", value: adminCount, color: "#a5b4fc", bg: "rgba(165,180,252,0.1)", border: "rgba(165,180,252,0.2)" },
    { label: "Sistem Durumu", value: "Aktif", color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", padding: 0, position: "relative", overflow: "hidden" }}>
      {/* Background orbs */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "50vh", pointerEvents: "none", background: "radial-gradient(ellipse 80% 60% at 30% -10%,rgba(99,102,241,0.1),transparent)", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-20%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(99,102,241,0.4)", color: "white" }}>
              <IconShield />
            </div>
            <div>
              <div style={{ fontFamily: "Fira Code", fontWeight: 700, fontSize: 22, color: "#0f172a", lineHeight: 1.2 }}>Admin Paneli</div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontFamily: "Fira Code" }}>SupplyShield · Sistem Yönetimi</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {currentUser && (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, color: "#0f172a", fontWeight: 500 }}>{currentUser.username}</div>
                <div style={{ fontSize: 11, color: "#6366f1", fontFamily: "Fira Code" }}>Administrator</div>
              </div>
            )}
            <button
              onClick={handleLogout}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "9px 16px",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, color: "#94a3b8", cursor: "pointer", fontSize: 13,
                transition: "all 0.15s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.3)"; (e.currentTarget as HTMLElement).style.color = "#f87171"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "#94a3b8"; }}
            >
              <IconLogout /> Çıkış Yap
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: s.bg,
              border: `1px solid ${s.border}`,
              borderRadius: 14,
              padding: "20px 22px",
              backdropFilter: "blur(10px)",
            }}>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1, fontFamily: "Fira Code" }}>{s.label}</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: s.color, fontFamily: "Fira Code", lineHeight: 1 }}>{loading && typeof s.value === "number" ? "—" : s.value}</div>
            </div>
          ))}
        </div>

        {/* Users table */}
        <div style={{
          background: "rgba(15,20,40,0.7)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          backdropFilter: "blur(16px)",
          marginBottom: 20,
          overflow: "hidden",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                <IconUsers /> Kullanıcı Yönetimi
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "Fira Code", marginTop: 2 }}>Kayıtlı kullanıcılar</div>
            </div>
            <button
              onClick={loadUsers}
              style={{
                display: "flex", alignItems: "center", gap: 7, padding: "8px 14px",
                background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: 9, color: "#a5b4fc", cursor: "pointer", fontSize: 12,
                fontFamily: "Fira Code", transition: "all 0.15s",
              }}
            >
              <IconRefresh /> Yenile
            </button>
          </div>

          {error && (
            <div style={{ padding: "14px 24px", background: "rgba(245,158,11,0.08)", borderBottom: "1px solid rgba(245,158,11,0.2)", color: "#f59e0b", fontSize: 13 }}>
              ⚠ {error}
            </div>
          )}

          {loading ? (
            <div style={{ padding: 48, textAlign: "center", color: "#6366f1", fontFamily: "Fira Code", fontSize: 13 }}>
              <div style={{ marginBottom: 8, fontSize: 22 }}>⟳</div>
              Yükleniyor...
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Kullanıcı Adı", "Şirket", "E-posta", "Rol", "İşlemler"].map(h => (
                    <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, color: "#94a3b8", fontFamily: "Fira Code", letterSpacing: 1, textTransform: "uppercase", fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "32px 20px", textAlign: "center", color: "#475569", fontSize: 13 }}>
                      Kullanıcı bulunamadı
                    </td>
                  </tr>
                ) : users.map((u, i) => (
                  <tr key={u.username} style={{ borderBottom: i < users.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                  >
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#0f172a", fontFamily: "Fira Code" }}>{u.username}</td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#94a3b8" }}>{u.company_name || "—"}</td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#94a3b8" }}>{u.email || "—"}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: 6, fontSize: 11, fontFamily: "Fira Code", fontWeight: 600,
                        background: u.role === "admin" ? "rgba(99,102,241,0.15)" : "rgba(52,211,153,0.12)",
                        color: u.role === "admin" ? "#a5b4fc" : "#34d399",
                        border: u.role === "admin" ? "1px solid rgba(99,102,241,0.25)" : "1px solid rgba(52,211,153,0.2)",
                      }}>
                        {u.role === "admin" ? "Admin" : "KOBİ"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      {u.role !== "admin" ? (
                        <button
                          onClick={() => handleDelete(u.username)}
                          disabled={deletingUser === u.username}
                          style={{
                            display: "flex", alignItems: "center", gap: 5, padding: "6px 12px",
                            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                            borderRadius: 8, color: "#f87171", cursor: "pointer", fontSize: 12,
                            transition: "all 0.15s", opacity: deletingUser === u.username ? 0.5 : 1,
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.2)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)"; }}
                        >
                          <IconTrash /> {deletingUser === u.username ? "Siliniyor..." : "Sil"}
                        </button>
                      ) : (
                        <span style={{ fontSize: 11, color: "#475569", fontFamily: "Fira Code" }}>Korumalı</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* System Info */}
        <div style={{
          background: "rgba(15,20,40,0.7)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          padding: "24px",
          backdropFilter: "blur(16px)",
        }}>
          <div style={{ fontSize: 11, color: "#6366f1", fontFamily: "Fira Code", marginBottom: 16, letterSpacing: 1, textTransform: "uppercase" }}>
            Sistem Bilgileri
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              { label: "Backend URL", value: "localhost:8000" },
              { label: "Versiyon", value: "v1.0" },
              { label: "Aktif Ajanlar", value: "7 aktif" },
              { label: "Son Senkron", value: syncTime },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: 10, color: "#475569", fontFamily: "Fira Code", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", fontFamily: "Fira Code" }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
