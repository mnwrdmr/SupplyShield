"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerApi, authStorage } from "../lib/auth";

const IconShield = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconBuilding = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="15" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
  </svg>
);
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
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

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ company_name: "", email: "", username: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }
    setLoading(true);
    try {
      const data = await registerApi({
        username: form.username,
        password: form.password,
        company_name: form.company_name,
        email: form.email,
      });
      authStorage.setToken(data.access_token);
      authStorage.setUser(data.user);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız");
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

  const fields = [
    { field: "company_name", placeholder: "Şirket Adı", icon: <IconBuilding />, type: "text" },
    { field: "email", placeholder: "E-posta", icon: <IconMail />, type: "email" },
    { field: "username", placeholder: "Kullanıcı Adı", icon: <IconUser />, type: "text" },
    { field: "password", placeholder: "Şifre", icon: <IconLock />, type: "password" },
    { field: "confirmPassword", placeholder: "Şifre Tekrar", icon: <IconLock />, type: "password" },
  ];

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
      {/* Background orbs */}
      <div style={{ position: "fixed", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-20%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{
        width: "100%",
        maxWidth: 440,
        background: "#ffffff",
        
        
        border: "1px solid #e2e8f0",
        borderRadius: 20,
        padding: "40px 36px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px rgba(99,102,241,0.1)",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 28px rgba(99,102,241,0.4)",
            color: "white", marginBottom: 14,
          }}>
            <IconShield />
          </div>
          <div style={{ fontFamily: "Fira Code", fontWeight: 700, fontSize: 20, color: "#0f172a" }}>
            Hesap Oluştur
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, fontFamily: "Fira Code" }}>
            SupplyShield platformuna katılın
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: 10, padding: "10px 14px", marginBottom: 20,
            color: "#f59e0b", fontSize: 13, display: "flex", alignItems: "center", gap: 8,
          }}>
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {fields.map(({ field, placeholder, icon, type }) => (
            <div key={field} style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b", pointerEvents: "none" }}>
                {icon}
              </div>
              <input
                type={type}
                placeholder={placeholder}
                value={form[field as keyof typeof form]}
                onChange={update(field)}
                required
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
          ))}

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
            {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#64748b" }}>
          Zaten hesabınız var mı?{" "}
          <a href="/login" style={{ color: "#a5b4fc", textDecoration: "none", fontWeight: 500 }}>
            Giriş yapın
          </a>
        </div>
      </div>
    </div>
  );
}
