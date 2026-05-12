"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginApi, authStorage } from "../lib/auth";

const IconShield = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const IconEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginApi(username, password);
      authStorage.setToken(data.access_token);
      authStorage.setUser(data.user);
      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "11px 12px 11px 40px",
    background: "#f8fafc",
    border: "1px solid #d1d5db",
    borderRadius: 10,
    color: "#0f172a",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.15s ease",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f4f8 0%, #e8edf5 60%, #f0f4f8 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Arka plan süslemeleri */}
      <div style={{ position: "fixed", top: "-20%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-20%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{
        width: "100%",
        maxWidth: 440,
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 20,
        padding: "44px 40px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 36 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 32px rgba(99,102,241,0.5)",
            color: "white", marginBottom: 16,
          }}>
            <IconShield />
          </div>
          <div style={{ fontFamily: "Fira Code", fontWeight: 700, fontSize: 22, color: "#0f172a", letterSpacing: "-0.5px" }}>
            SupplyShield
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, fontFamily: "Fira Code" }}>
            AI Destekli Tedarik Zinciri Platformu
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#fffbeb", border: "1px solid #fde68a",
            borderRadius: 10, padding: "10px 14px", marginBottom: 20,
            color: "#d97706", fontSize: 13, display: "flex", alignItems: "center", gap: 8,
          }}>
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Username */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }}>
              <IconUser />
            </div>
            <input
              type="text"
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* Password */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }}>
              <IconLock />
            </div>
            <input
              type={showPw ? "text" : "password"}
              placeholder="Şifre"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ ...inputStyle, paddingRight: 44 }}
              onFocus={e => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
            >
              {showPw ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "13px",
              background: loading ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
              border: "none", borderRadius: 12, color: "white",
              fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.4)",
              marginTop: 4,
            }}
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        {/* Register link */}
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#94a3b8" }}>
          Hesabınız yok mu?{" "}
          <a href="/register" style={{ color: "#a5b4fc", textDecoration: "none", fontWeight: 500 }}>
            Kayıt olun
          </a>
        </div>

        {/* Demo credentials */}
        <div style={{
          marginTop: 24,
          padding: "14px 16px",
          background: "#f0f4ff",
          border: "1px solid #c7d2fe",
          borderRadius: 12,
        }}>
          <div style={{ fontSize: 10, color: "#4338ca", fontFamily: "Fira Code", marginBottom: 8, letterSpacing: 1 }}>
            DEMO HESAPLARI
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 12, color: "#64748b", fontFamily: "Fira Code" }}>
              <span style={{ color: "#a5b4fc" }}>Admin:</span> admin / admin123
            </div>
            <div style={{ fontSize: 12, color: "#64748b", fontFamily: "Fira Code" }}>
              <span style={{ color: "#34d399" }}>KOBİ:</span> kobi1 / kobi123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
